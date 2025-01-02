// services/emailService.js
const nodemailer = require('nodemailer');
require('dotenv').config();
// Set up Nodemailer transporter with hard-coded email credentials
const transporter = nodemailer.createTransport({
  service: 'gmail', // or use the appropriate service if not Gmail
  host: process.env.EMAIL_HOST || 'smtp.gmail.com', // Optional: Use process.env if not Gmail
  port: 465,
  secure: true, // Use secure: true for some providers (e.g., Outlook)
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

exports.sendEmail = async (mailOptions) => {
  try {
    // Always use the hard-coded email address as the sender
    const updatedMailOptions = {
      ...mailOptions,
      from: 'lonejavid07391@gmail.com', // Override the 'from' field
    };

    console.log('Sending email with options:', updatedMailOptions);
    await transporter.sendMail(updatedMailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};
