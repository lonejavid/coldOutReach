
const UserData = require('../Modals/UserData');  // Ensure the path is correct for your Email model
const User = require('../Modals/user');  // Assuming you have a User model for user authentication

const savedata = async (req, res) => {
  const data = req.body.results; // Get the results array from the request body

  // Assuming user authentication middleware sets req.user with the logged-in user's information
  const userId = req.user._id;  // You might need to adjust this based on your authentication method
 

  if (!userId) {
    return res.status(400).json({ message: 'User not authenticated' });
  }

  try {
    // Create an array of emails to be inserted, adding the userId and disposition
    const emailsToSave = data.map(item => ({
      email: item.email,
      url: item.url,
      disposition: 'not contacted', // Set disposition to "not contacted"
      userId: userId, // Assign the userId of the currently authenticated user
    }));

    // Find existing emails for the current user to avoid duplicates
    const existingEmails = await UserData.find({
      userId: userId,
      email: { $in: emailsToSave.map(item => item.email) },  // Find if any of these emails already exist for the user
    });

    const existingEmailSet = new Set(existingEmails.map(email => email.email));

    // Filter out emails that already exist in the database
    const emailsToInsert = emailsToSave.filter(email => !existingEmailSet.has(email.email));

    if (emailsToInsert.length === 0) {
      return res.status(200).json({ message: 'No new emails to save' });
    }

    // Save the new emails in MongoDB
    const savedEmails = await UserData.insertMany(emailsToInsert);
    

    // Respond with success
    res.status(200).json({ message: 'Emails saved successfully', data: savedEmails });
  } catch (error) {
    console.error("Error saving emails:", error);
    res.status(500).json({ message: 'Failed to save emails' });
  }
};

const getUserData = async (req, res) => {
    // Assuming user authentication middleware sets req.user with the logged-in user's information
    const userId = req.user._id;
   
    if (!userId) {
      return res.status(400).json({ message: 'User not authenticated' });
    }
  
    try {
      // Fetch all emails for the current user
      const userEmails = await UserData.find({ userId: userId });
      
  
      if (userEmails.length === 0) {
        return res.status(200).json({ message: 'No saved emails found' });
      }
  
      // Respond with the fetched data
      res.status(200).json({ message: 'Saved emails fetched successfully', data: userEmails });
    } catch (error) {
      console.error("Error fetching emails:", error);
      res.status(500).json({ message: 'Failed to fetch emails' });
    }
  };
  const storedData = async (req, res) => {
    const userId = req.user._id; // Assuming req.user contains the authenticated user's data
    try {
        // Fetch user data from the database
        const userdata = await UserData.find({ userId: userId });

        // Initialize counters
        let contacted = 0;
        let uncontacted = 0;

        // Loop through the data and count based on disposition
        userdata.forEach((record) => {
            if (record.disposition === "contacted") {
                contacted++;
            } else if (record.disposition === "not contacted") {
                uncontacted++;
            }
        });
       

        // Return the counts as a JSON response
        res.status(200).json({ contacted, uncontacted });
    } catch (err) {
        // Handle errors
        res.status(500).json({ message: "Something went wrong", error: err.message });
    }
};

  
  module.exports = {
    savedata,
    getUserData,
    storedData
  };