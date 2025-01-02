const nodemailer = require("nodemailer");
const ExcelJS = require("exceljs");
const fs = require("fs");
const Email = require("../Modals/Email");
const mongoose = require("mongoose");
const Groq = require('groq-sdk');
const groq = new Groq({ apiKey: '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' });
// Delay function to pause for a specified time
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Function to generate email content
async function generateEmail(prompt) {
  try {
    // Create a chat completion with a user message based on the prompt
    const chatCompletion = await groq.chat.completions.create({
      "messages": [
        {
          "role": "user",
          "content": prompt,  // The prompt for generating email
        }
      ],
      "model": "llama3-70b-8192", 
      "temperature": 0.7,
      "max_tokens": 300,  // Increase token limit to capture the full response
      "top_p": 1,
      "stream": false,
      "stop": null
    });

    // Extract the generated content
    const emailContent = chatCompletion.choices[0]?.message?.content || chatCompletion.choices[0]?.text || '';

    if (!emailContent) {
      return { subject: 'No subject generated', body: 'No content generated' };
    }

    //console.log("Full AI Response:", emailContent);  // To inspect the full response for debugging

    // Use regex to capture content between startSubject/endSubject and startBody/endBody
    const subjectMatch = emailContent.match(/startSubject\s*(.*?)\s*endSubject/);  // Match subject between startSubject and endSubject
    const bodyMatch = emailContent.match(/startBody([\s\S]*?)endBody/);

    const subject = subjectMatch ? subjectMatch[1].trim() : 'No subject generated';
    const body = bodyMatch ? bodyMatch[1].trim() : 'No body content generated';

    // console.log("Subject of the mail:", subject);
    // console.log("Body of the mail:", body);

    return { subject, body };

  } catch (error) {
    console.error('Error fetching Groq response:', error);
    return { subject: 'Error', body: 'Error generating email' };  // Return an error message
  }
}



const sendMails = async (req, res) => {

    const companyDetails = req.body.companyDetails;


   // console.log("Company Details received:", companyDetails);
 
  try {
    
    const userId = req.user.id;
    let selectedEmails = req.body.emails;
    selectedEmails = JSON.parse(selectedEmails);
    selectedEmails = selectedEmails.map(email => email.replace(/^"|"$/g, '').trim());
    const file = req.file;
    
    

    // Validate if at least one email is selected
    if (!selectedEmails || selectedEmails.length === 0) {
      return res.status(400).json({ message: "Please select at least one source email." });
    }

    // Parse the Excel file to get the emails and other data
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(file.path);
    const worksheet = workbook.getWorksheet(1);

    // Find the "Email" column by looking at the headers (first row)
    const headerRow = worksheet.getRow(1);
    let emailColumnIndex = null;

    headerRow.eachCell((cell, colNumber) => {
      if (cell.value && cell.value.toString().toLowerCase() === "email") {
        emailColumnIndex = colNumber;
      }
    });

    if (!emailColumnIndex) {
      return res.status(400).json({ message: "Email column not found in the Excel file." });
    }

    // Fetch registered emails for the user
    const registeredEmails = await Email.find({
      userId: new mongoose.Types.ObjectId(userId),
      email: { $in: selectedEmails.map(email => email.toLowerCase()) },
    });

    if (registeredEmails.length === 0) {
      return res.status(403).json({ message: "No valid registered emails found for the user." });
    }

    // Loop through the rows and build the email queue
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

    // Process the email sending in a round-robin manner
    let emailIndex = 0;

    for (let i = 0; i < emailQueue.length; i++) {
      const recipientEmail = emailQueue[i];
      const currentSourceEmail = registeredEmails[emailIndex].email;
      const appPassword = registeredEmails[emailIndex].appPassword;

      // Generate email subject and body
      const prompt = `
      These are the details of my company: ${companyDetails}. Please carefully read and understand the services my company offers.
      Next, look at this email address: ${recipientEmail}. Identify the domain name, research the company behind it, and then compose an email suggesting how our company can help them grow their business.
      
      If the domain is a Gmail address (gmail.com), compose a simple email asking about their thoughts on our company and the services we provide.
      
      Please structure the response with the following format:
      - **Subject:** The subject line of the email.
      - **Body:** The body content of the email.

      Your response should be structured as follows:

      startSubject
      [Your Subject Here]
      endSubject

      startBody
      [Your Email Body Here]
      endBody

     in this place [Your Name] do have lingopalTeam with no braces  Please only return the subject and the body in this specific format. Do not include any other information or explanations.
`;

      const {subject,body}=await generateEmail(prompt);
      console.log("subject is",subject);
      console.log("body is",body)
     
      // Set up Nodemailer transporter
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: currentSourceEmail,
          pass: appPassword,
        },
      });

    
      await transporter.sendMail({
        from: currentSourceEmail,
        to: recipientEmail,
        subject,
        text: body,
      });

      //console.log(`Email sent from: ${currentSourceEmail} to: ${recipientEmail}`);

      // Delay before sending the next email
      await delay(5000);

      // Cycle through the selected emails
      emailIndex = (emailIndex + 1) % registeredEmails.length;
    }

    res.status(200).json({ message: "Emails sent successfully!" });

    // Clean up the uploaded file
    fs.unlinkSync(file.path);

  } catch (error) {
    console.error("Error in sending emails:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Simple email validation function
const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

module.exports = sendMails;


