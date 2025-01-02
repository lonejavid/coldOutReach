require('dotenv').config();


const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

const UserData = require('../Modals/UserData')

const CompanyDetails = require('../Modals/CompanyDetails');
const Email = require('../Modals/Email');
const nodemailer = require("nodemailer");
const Token = require('../Modals/tokens');
const Groq = require('groq-sdk');
const { google } = require("googleapis");
console.log(process.env.CLIENT_ID)

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);


const groq = new Groq({ apiKey: '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' });
var emailsub='';
var emailbod='';
var count=0;
var totalcount=0;
let latestSubject = "";
let latestBody = "";


// Delay function to pause for a specified time
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Function to generate email content from Groq
async function generateEmail(prompt) {
  try {
    const chatCompletion = await groq.chat.completions.create({
      "messages": [
        {
          "role": "user",
          "content": prompt,
        }
      ],
      "model": "llama3-70b-8192",
      "temperature": 0.7,
      "max_tokens": 300,
      "top_p": 1,
      "stream": false,
      "stop": null
    });

    const emailContent = chatCompletion.choices[0]?.message?.content || chatCompletion.choices[0]?.text || '';

    if (!emailContent) {
      return { subject: '', body: 'No content generated' };
    }

    const subjectMatch = emailContent.match(/startSubject\s*(.*?)\s*endSubject/);
    const bodyMatch = emailContent.match(/startBody([\s\S]*?)endBody/);

    const subject = subjectMatch ? subjectMatch[1].trim() : '';
    const body = bodyMatch ? bodyMatch[1].trim() : 'No body content generated';

    
  
    return { subject, body };
  } catch (error) {
    console.error('Error fetching Groq response:', error);
    return { subject: 'Error', body: 'Error generating email' };
  }
}


const launchEmailcompaign = async (req, res) => {
  try {
    // Parse company details and emails from the request body
    let data = req.body;
    let { company, emails, target } = data;
    company = company;
    const emailArray = emails;
    totalcount = target;

    // Fetch company details from the database
    const companyDetails = await CompanyDetails.findOne({
      userId: req.user._id,
      name: company.name,
    });

    if (!companyDetails) {
      return res.status(400).json({ message: "Company details not found." });
    }

    // Find the registered emails from the database based on the user's selection
    const tokens = await Token.find({
      userId: req.user._id,
      emailId: { $in: emailArray },
    });

    if (tokens.length === 0) {
      return res.status(400).json({ message: "No valid registered emails found." });
    }

    // Fetch emails with disposition "not contacted" from the database
    const uncontactedEmails = await UserData.find({
      userId: req.user._id,
      disposition: "not contacted",
    }).limit(target); // Limit to the target count

    if (uncontactedEmails.length === 0) {
      return res.status(400).json({ message: "No uncontacted emails available." });
    }

    // Immediately respond to the frontend that the campaign has started
    res.status(200).json({ message: "Email campaign started successfully." });

    // Process the email sending queue asynchronously in the background
    let emailIndex = 0;

    for (let i = 0; i < uncontactedEmails.length; i++) {
      const recipientEmail = uncontactedEmails[i].email;
      const currentSourceEmail = tokens[emailIndex].emailId;
      const refresh_token = tokens[emailIndex].token;

      // Construct the prompt for generating the email
      const prompt = `
        These are the details of my company name=${companyDetails.name} and details are ${companyDetails.details}. Please carefully read and understand the services my company offers.
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

        In this place [Your Name], do have Outreach Team with no braces. Please only return the subject and the body in this specific format. Do not include any other information or explanations.
      `;

      // Generate the subject and body
      const { subject, body } = await generateEmail(prompt);
      latestSubject = subject;
      latestBody = body;
      count++;

      // Authenticate using the refresh token
      oAuth2Client.setCredentials({ refresh_token });
      const newTokens = await oAuth2Client.refreshAccessToken();
      const accessToken = newTokens.credentials.access_token;
      oAuth2Client.setCredentials({ access_token: accessToken });

      // Set up Gmail API
      const gmail = google.gmail({ version: "v1", auth: oAuth2Client });

      // Create the email content
      const emailContent = [
        `To: ${recipientEmail}`,
        `Subject: ${subject}`,
        "",
        `${body}`,
      ].join("\n");

      const encodedMessage = Buffer.from(emailContent)
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

      // Send the email
      const response = await gmail.users.messages.send({
        userId: "me",
        requestBody: { raw: encodedMessage },
      });

      await UserData.updateOne({ _id: uncontactedEmails[i]._id }, { disposition: "contacted" });

      // Move to the next token for sending
      emailIndex = (emailIndex + 1) % tokens.length;

      // Stop if target is reached
      if (i + 1 >= target) {
        break;
      }

      // Random delay between sending emails (less than 4 seconds)
      const delay = Math.floor(Math.random() * 4000); // Random delay up to 4 seconds
      console.log(`Delaying for ${delay}ms before sending the next email...`);
      await new Promise((resolve) => setTimeout(resolve, delay)); // Delay before the next email
    }

    console.log("Email campaign completed successfully.");
  } catch (error) {
    console.error("Error in launching email campaign:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Simple email validation function
const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};
const emailPreview = async (req, res) => {
    
    return res.status(200).json({ subject: latestSubject, body: latestBody });
}
const getProgress = async (req, res) => {
    // Ensure count and totalcount are available
    if (!count || !totalcount || totalcount === 0) {
        return res.status(400).json({ error: 'Invalid count or totalcount' });
    }

    // Correct percentage calculation
    var percent = (count / totalcount) * 100;

    // Log the values for debugging
  

    return res.status(200).json({ percent: percent });
}

module.exports = {launchEmailcompaign,emailPreview,getProgress};
