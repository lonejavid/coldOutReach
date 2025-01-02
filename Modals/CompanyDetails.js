const mongoose = require('mongoose');

// Define the schema
const companyDetailsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  details: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User
});

// Check if the model already exists before defining it
const CompanyDetails =
  mongoose.models.CompanyDetails || mongoose.model('CompanyDetails', companyDetailsSchema);

module.exports = CompanyDetails;
