const User = require('../models/User');
const Ticket = require('../models/Ticket');
const bcrypt = require('bcrypt');

// Get dashboard stats
exports.getDashboardStats = async (req, res) => {
    try {
        const totalTickets = await Ticket.countDocuments();
        const totalCustomers = await User.countDocuments({ role: 'customer' });
        res.json({ totalTickets, totalCustomers });
    } catch (error) {
        res.status(500).json({ message: 'Failed to load dashboard stats' });
    }
};

// Create a user (agent/admin)
exports.createUser = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ message: 'Email already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
        });

        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: 'User creation failed' });
    }
};

// View all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch users' });
    }
};
