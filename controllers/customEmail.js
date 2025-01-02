const nodemailer = require("nodemailer");
const ExcelJS = require("exceljs");
const fs = require("fs");
const path = require("path");
const Email = require("../Modals/Email");
const mongoose = require("mongoose");

// Delay function to pause for a specified time
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Function to generate personalized email content
function generatePersonalizedEmail(recipientEmail, body) {
  const firstName = recipientEmail.split("@")[0];
  const capitalizedFirstName =
    firstName.charAt(0).toUpperCase() + firstName.slice(1);
  return `Hello ${capitalizedFirstName},\n\n${body}`;
}

// Simple email validation function
const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Function to handle the background task of sending emails
const processEmailSending = async (
  userId,
  selectedEmails,
  subject,
  body,
  filePath
) => {
  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.getWorksheet(1);

    const headerRow = worksheet.getRow(1);
    let emailColumnIndex = null;
    headerRow.eachCell((cell, colNumber) => {
      if (cell.value && cell.value.toString().toLowerCase() === "email") {
        emailColumnIndex = colNumber;
      }
    });

    if (!emailColumnIndex) {
      console.error("Email column not found in the Excel file.");
      return;
    }

    const registeredEmails = await Email.find({
      userId: new mongoose.Types.ObjectId(userId),
      email: { $in: selectedEmails.map((email) => email.toLowerCase()) },
    });

    if (registeredEmails.length === 0) {
      console.error("No valid registered emails found for the user.");
      return;
    }

    const emailQueue = [];
    for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {
      const row = worksheet.getRow(rowNumber);
      const emailCell = row.getCell(emailColumnIndex).value;
      let email = null;
      if (emailCell && emailCell.text) {
        email = emailCell.text.trim();
      } else if (emailCell && typeof emailCell === "string") {
        email = emailCell.trim();
      }
      if (email && validateEmail(email)) {
        emailQueue.push(email);
      }
    }

    if (emailQueue.length === 0) {
      console.error("No valid recipient emails found in the Excel file.");
      return;
    }

    const createTransporter = (userEmail, appPassword) => {
      return nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: userEmail,
          pass: appPassword,
        },
      });
    };

    let emailIndex = 0;
    for (let i = 0; i < emailQueue.length; i++) {
      const recipientEmail = emailQueue[i];
      const currentSourceEmail = registeredEmails[emailIndex].email;
      const appPassword = registeredEmails[emailIndex].appPassword;

      const personalizedBody = generatePersonalizedEmail(recipientEmail, body);

      const transporter = createTransporter(currentSourceEmail, appPassword);
      const mailOptions = {
        from: currentSourceEmail,
        to: recipientEmail,
        subject,
        text: personalizedBody,
        ...(filePath && { attachments: [{ path: filePath }] }),
      };

      await transporter.sendMail(mailOptions);
      console.log(`Email sent from: ${currentSourceEmail} to: ${recipientEmail}`);

      // Wait for 3 seconds before sending the next email
      await delay(3000);

      // Cycle through the registered emails for the next email
      emailIndex = (emailIndex + 1) % registeredEmails.length;
    }

    if (filePath) {
      fs.unlinkSync(filePath);
    }
    console.log("All emails have been sent successfully.");
  } catch (error) {
    console.error("Error in sending emails:", error);
  }
};

const customEmailController = async (req, res) => {
  try {
    const userId = req.user.id;
    let selectedEmails = req.body.emails;

    selectedEmails = JSON.parse(selectedEmails).map((email) =>
      email.replace(/^"|"$/g, "").trim()
    );
    const { subject, body } = req.body;
    const file = req.file;

    if (!selectedEmails || selectedEmails.length === 0) {
      return res
        .status(400)
        .json({ message: "Please select at least one source email." });
    }

    if (!file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    // Respond to the frontend immediately
    res.status(200).json({ message: "Email sending is in progress." });

    // Start email processing in the background
    setImmediate(() => {
      processEmailSending(userId, selectedEmails, subject, body, file.path);
    });
  } catch (error) {
    console.error("Error in email controller:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

module.exports = customEmailController;
