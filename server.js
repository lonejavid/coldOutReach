// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const bodyParser = require('body-parser');
const emailRoutes = require('./routes/emailRoutes'); // Import email routes
const authRoutes=require('./routes/Authroutes')

const connectDB = require('./config/db'); // Import the DB connection

// Initialize the Express app
const app = express();
const port = process.env.PORT || 3000;


// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// Use the email routes for handling emails
app.use(emailRoutes); // All routes in emailRoutes.js will be prefixed with '/api/email'
app.use(authRoutes);

// Start the server
// Serve the React frontend in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder to the client build folder
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
  app.use(express.static(path.join(__dirname, 'client', 'build')));

  // Serve the frontend
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
  });
}

app.get('/get-photo', (req, res) => {
  const { photoName } = req.query; // Get the photo name from query parameters

  const cleanedPhotoName = photoName.replace(/^uploads[\\/]/, ''); // Remove "uploads/" or "uploads\"


  // Validate the photo name
  if (!photoName) {
    return res.status(400).json({ message: 'Photo name is required' });
  }

  // Construct the file path to the image

  const photoPath = path.join(__dirname, 'uploads', cleanedPhotoName);

  // Check if the file exists
  
fs.access(photoPath, fs.constants.F_OK, (err) => {
  if (err) {
      console.log('Photo not found:', err);
      return res.status(404).json({ message: 'Photo not found' });
  }


  res.sendFile(photoPath);
});
});
app.get("/oauth2callback", async (req, res) => {
  const code = req.query.code; // Authorization code from Google
  try {
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
      console.log(`Stored refresh token for ${userEmail} in .env file`);
    }
    res.send(`
      <h1>Authentication successful!</h1>
      <p>You can now read emails by clicking "Read Mails" on the homepage.</p>
    `);
  } catch (error) {
    console.error("Error during authentication:", error);
    res.status(500).send("Authentication failed. Please try again.");
  }
});




app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
