const express = require('express');
const router = express.Router();
const authMiddleware = require('../Middleware/AuthMiddleware');
const { isAdmin } = require('../Middleware/isAdmin');
const { getAllUsers, updateUserRole, addUser } = require('../Controller/UserController');

// Get all users (only for admins)
router.get('/users', authMiddleware, isAdmin, getAllUsers);

// Update user role (only for admins)
router.put('/users/:id/role', authMiddleware, isAdmin, updateUserRole);

router.post('/adduser', authMiddleware, isAdmin, addUser)

module.exports = router;
