const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  organization: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  photo: { type: String, default: null }, // Path to the uploaded profile photo
  registeredEmails: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Email' }], // Reference to Email documents
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

module.exports = mongoose.model('User', userSchema);
