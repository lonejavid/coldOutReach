const jwt = require('jsonwebtoken');
const User = require('../Modals/user'); // Ensure the correct path to your User model

const authenticate = async (req, res, next) => {
    try {
        // Get the token from the request headers
        const token = req.headers.authorization?.split(" ")[1]; // Using "Bearer <token>" format

        // If there's no token, respond with an unauthorized error
        if (!token) {
            return res.status(401).json({ message: "No token provided. Unauthorized." });
        }

        // Verify the token and extract the user payload
        const decoded = jwt.verify(token, 'mypassword');
        const email = decoded.email;

        // Find the user in the database by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found. Unauthorized." });
        }

        // Attach the user to the request for use in later middleware or routes
        
        req.user = user;
        next();
    } catch (error) {
        console.error("Authentication error:", error);
        return res.status(401).json({ message: "Invalid token. Unauthorized." });
    }
};

module.exports = { authenticate };
