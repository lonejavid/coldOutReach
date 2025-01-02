const CompanyDetails = require('../Modals/CompanyDetails');

const removeCompany = async (req, res) => {
  try {
    // Extract the company name from the request body
    const { companyName } = req.body;
    const userId = req.user.id; // Assuming user authentication middleware adds user info to req.user

    // Check if companyName is provided
    if (!companyName) {
      return res.status(400).json({ message: 'Company name is required.' });
    }

    // Find the company and ensure it belongs to the authenticated user
    const company = await CompanyDetails.findOneAndDelete({
      name: companyName,
      userId: userId, // Assuming that the CompanyDetails model has a userId field to associate it with a user
    });

    // If the company doesn't exist or doesn't belong to the user
    if (!company) {
      return res.status(404).json({ message: 'Company not found or you do not have permission to delete it.' });
    }

    // Successfully removed the company
    return res.status(200).json({ message: 'Company removed successfully.' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error removing company.' });
  }
};

module.exports = removeCompany;
