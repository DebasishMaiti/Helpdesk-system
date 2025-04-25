const express = require('express');
const router = express.Router();
const { getAllUsers, getAllTicketsStats } = require('../Controller/AdminController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/users', authMiddleware, getAllUsers);
router.get('/tickets/stats', authMiddleware, getAllTicketsStats);

module.exports = router;
