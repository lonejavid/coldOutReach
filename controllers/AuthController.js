const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer'); // Multer for handling file uploads
const path = require('path');
const User = require('../Modals/user'); // Assuming the User model is defined in models/User.js

// Multer Configuration for File Upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Specify the upload directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Generate a unique filename
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/; // Allowed file types
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only images are allowed (JPEG, JPG, PNG).'));
    }
  },
}).single('photo'); // 'photo' matches the input field name in the frontend

// SignUp Function
exports.SignUp = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    const { name, organization, email, password } = req.body;
    const photo = req.file ? req.file.path : null; // Path to the uploaded photo

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
        photo, // Save the photo path
      });

      // Save the user to the database
      await newUser.save();

      // Send a success response
      res.status(201).json({ message: 'Signup successful!' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while saving user.' });
    }
  });
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
