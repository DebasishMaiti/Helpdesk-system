const User = require('../Model/UserModel');

// Get all users (only accessible by admin)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Exclude password from the response
        res.json(users);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: 'Server Error: Unable to fetch users.'
        });
    }
};

// Update a user's role (only accessible by admin)
exports.updateUserRole = async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    if (!role || !['customer', 'agent', 'admin'].includes(role)) {
        return res.status(400).send({
            message: 'Invalid role. Please provide a valid role: customer, agent, or admin.'
        });
    }

    try {
        // Find and update the user's role
        const updatedUser = await User.findByIdAndUpdate(id, { role }, { new: true });

        if (!updatedUser) {
            return res.status(404).send({
                message: 'User not found.'
            });
        }

        res.json({
            message: 'User role updated successfully.',
            user: updatedUser
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: 'Server Error: Unable to update user role.'
        });
    }
};

exports.addUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Basic validation
        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check for existing user
        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // Create new user
        const newUser = new User({ name, email, password, role });
        await newUser.save();

        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: 'Server Error: Unable to add user'
        });
    }
}
