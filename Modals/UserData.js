const mongoose = require("mongoose");

const UserData = new mongoose.Schema({
  email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ }, // Email validation with regex
  url: { type: String, required: true },
  disposition: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the User model
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// Create and export the model
module.exports = mongoose.model('UserData', UserData);
