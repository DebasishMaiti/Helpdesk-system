const express = require('express');
const router = express.Router();
const authMiddleware = require('../Middleware/AuthMiddleware');
const { isUser } = require('../Middleware/isUser');
const { isAgent } = require('../Middleware/isAgent');
const { isAdmin } = require('../Middleware/isAdmin');
const uploads = require("../Middleware/Uploads")

const {
    createTicket,
    getTickets,
    getTicketById,
    updateTicketStatus,
    addNoteToTicket
} = require('../Controller/TicketController');

// Customer: Create new ticket
router.post('/', authMiddleware, isUser, createTicket);

// All: View tickets (filtered by role in controller)
router.get('/', authMiddleware, getTickets);

// All: View single ticket with notes
router.get('/:id', authMiddleware, getTicketById);

// Agent/Admin: Update ticket status
router.put('/:id/status', authMiddleware, (req, res, next) => {
    if (req.user.role === 'agent' || req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({ message: 'Access Denied' });
    }
}, updateTicketStatus);

// All: Add note to ticket
router.post('/:id/notes', authMiddleware, uploads.array('attachments', 5), addNoteToTicket);

module.exports = router;

