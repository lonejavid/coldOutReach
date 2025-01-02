
const CompanyDetails= require('../Modals/CompanyDetails')// Ensure correct path to the model

const companydetails = async (req, res) => {
  try {
    // Validate incoming request body
    const { name, details } = req.body;
    if (!name || !details) {
      return res.status(400).json({ message: 'Both name and details are required.' });
    }

  

    // Create a new CompanyDetails document
    const companyDetailsData = new CompanyDetails({
      name,
      details,
      userId: req.user._id, // Assuming req.user._id is set after authentication middleware
    });

    // Save to MongoDB
    await companyDetailsData.save();

    // Respond to the client
    res.status(201).json({
      message: 'Company details saved successfully.',
      companyDetails: companyDetailsData,
    });
  } catch (error) {
    console.error('Error saving company details:', error);
    res.status(500).json({ message: 'Failed to save company details. Please try again.' });
  }
};

module.exports = companydetails;
