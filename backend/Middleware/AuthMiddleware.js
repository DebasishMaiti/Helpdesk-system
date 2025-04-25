const jwt = require('jsonwebtoken');
const User = require('../Model/UserModel'); // Import the User model

// Auth Middleware to verify the token and attach user to req
const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId); // Fetch user from DB

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = user; // Attach full user object to req
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = authMiddleware;
