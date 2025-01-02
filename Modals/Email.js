

// models/Email.js
const mongoose = require('mongoose');
const emailSchema = new mongoose.Schema({
  email: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Reference to User
});

module.exports = mongoose.model('Email', emailSchema);
