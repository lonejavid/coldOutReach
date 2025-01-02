const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const User = require('../Modals/user'); // Assuming the User model is defined in models/User.js






exports.SignUp = async (req, res) => {
  const { name, organization, email, password } = req.body;


  // Validation (basic example, you can add more as needed)
  if (!name || !organization || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    // Check if the email already exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists.' });
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      name,
      organization,
      email,
      password: hashedPassword, // Store the hashed password
      // Remove `photo` or handle it if needed (e.g., file upload logic)
    });

    // Save the user to the database
    await newUser.save();

    // Send a success response
    
    res.status(201).json({ message: 'Signup successful!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while saving user.' });
  }
};


// Login Function with JWT Token
exports.Login = async (req, res) => {
  const { email, password } = req.body;
  console.log("login file called ",email,"password",password)

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: 'Both email and password are required.' });
  }

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // Generate a JWT token
    const payload = { userId: user._id, email: user.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '3h' });

    // Send the token and user data in the response
    res.status(200).json({
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        organization: user.organization,
        photo: user.photo, // Include the photo path
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred during login.' });
  }
};
