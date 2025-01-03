require('dotenv').config();
const Email = require("../Modals/Email");
const Token = require('../Modals/tokens');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { google } = require("googleapis");
const User = require("../Modals/user");
const user = require('../Modals/user');
const CLIENT_ID = '930555176944-2j56obf153h6okjjj7arsr6kquvg8dk6.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'http://localhost:3000/oauth2callback';
console.log("redirect uri is",REDIRECT_URI)
const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, 'http://localhost:3000/oauth2callback');
exports.registerMail = async (req, res) => {
  try {
    
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: [
        "https://www.googleapis.com/auth/gmail.send",
        "https://www.googleapis.com/auth/gmail.compose",
        "https://www.googleapis.com/auth/gmail.modify",
        "https://www.googleapis.com/auth/gmail.readonly",
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
      ],
    });
    const userId = req.user.id; // Assuming `req.user` contains the authenticated user info
    res.status(200).json({ authUrl: authUrl });
  } catch (error) {
    console.error("Error registering email:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

exports.oauth2callback= async (req, res) => {
  const code = req.query.code; // Authorization code from Google
  try {
    console.log("user is ",req.user)
    // Exchange authorization code for tokens
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);
    userTokens = tokens; // Save tokens for later use
    const oauth2=google.oauth2({version:"v2",auth:oAuth2Client});
    const userinfo=await oauth2.userinfo.get();
    const userEmail=userinfo.data.email;
    if (tokens.refresh_token) {
      // Save the refresh token and email in the `.env` file
      const envFilePath = path.join(__dirname, ".env");
      const envKey = userEmail.replace(/[@.]/g, "_").toUpperCase() + "_REFRESH_TOKEN";
      process.env[envKey] = tokens.refresh_token;
      const newEnvEntry = `\n${envKey}=${tokens.refresh_token}`;
      fs.appendFileSync(envFilePath, newEnvEntry);

    }
    const refresh_token=tokens.refresh_token;
 

    res.redirect(`http://localhost:3001/verification-success?token=${refresh_token}&email=${userEmail}`);

  } catch (error) {
    console.error("Error during authentication:", error);
    res.status(500).send("Authentication failed. Please try again.");
  }
};


const mongoose = require("mongoose");
exports.getRegisteredEmails = async (req, res) => {
  try {
    const userId = req.user?._id;

    // Check if userId exists
    if (!userId) {
      return res.status(400).json({ message: "User ID is missing or invalid." });
    }

    // Convert userId to ObjectId
    const objectId = new mongoose.Types.ObjectId(userId);

    // Fetch all matching records with only the emailId field
    const tokens = await Token.find({ userId: objectId }, { emailId: 1, _id: 0 });


    // Ensure tokens is an array
    if (!tokens || !Array.isArray(tokens)) {
      return res.status(500).json({ message: "Unexpected response from database." });
    }

    // Extract email IDs into an array
    const emailArray = tokens.map((token) => token.emailId);



    // Send the array of emails to the frontend
    res.status(200).json({ registeredEmails: emailArray });
  } catch (error) {
    console.error("Error fetching registered emails:", error.message);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Remove an email
exports.removeEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const userId = req.user.id; // Assuming `req.user` contains the authenticated user info

    // Validate input
    if (!email) {
      return res.status(400).json({ message: "Email is required to remove." });
    }

    // Find the email to be removed in the Email collection
    const emailDoc = await Email.findOne({ userId, email });
    if (!emailDoc) {
      return res.status(404).json({ message: "Email not found." });
    }

    // Remove the email document from the Email collection
    await Email.findByIdAndDelete(emailDoc._id);

    // Remove the email reference from the user's registeredEmails array
    await User.findByIdAndUpdate(userId, {
      $pull: { registeredEmails: emailDoc._id }
    });

    res.status(200).json({ message: "Email removed successfully." });
  } catch (error) {
    console.error("Error removing email:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};


exports.saveToken = async (req, res) => {
  try {
    const token = req.body.token;
    const email = req.body.email;
    console.log("storing the token ")

    // Ensure the required data is present
    if (!token || !email) {
      return res.status(400).json({ message: "Token and email are required" });
    }

    // Get the authenticated user's ID from req.user (assumes authentication middleware is used)
    const userId = req.user._id;
    console.log("user id is here ", userId)

    // Find if there is an existing record for the token, email, and userId
    const existingRecord = await Token.findOne({ emailId: email, userId: userId });
    console.log("existing token record fetched: ", existingRecord);

    // If a record is found, return a response saying the token is already saved
    if (existingRecord) {
      console.log("Token already saved");
      return res.status(200).json({ message: "Token already saved" });
    }

    // If no record is found, create and save a new token record
    console.log("No existing token found, saving new token");

    const newToken = new Token({
      token: token,
      emailId: email,
      userId: userId,
    });

    await newToken.save();
    console.log("Token saved successfully");

    return res.status(201).json({ message: "Token saved successfully" });

  } catch (error) {
    console.error("Error saving token:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
