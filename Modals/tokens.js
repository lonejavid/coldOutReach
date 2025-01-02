// models/Token.js
const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  token: { type: String, required: true }, // The OAuth token or app password token
  emailId: { type: String,  required: true }, 
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the User model
  expiryDate: { type: Date, default: null }, // Optional: Token expiry date for OAuth tokens
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

module.exports = mongoose.model('Token', tokenSchema);
