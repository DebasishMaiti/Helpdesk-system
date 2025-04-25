const express = require('express');
const router = express.Router();
const authMiddleware = require('../Middleware/AuthMiddleware');
const { isAdmin } = require('../Middleware/isAdmin');

const {
    getNotesByTicket,
    deleteNote
} = require('../Controller/NoteController');

// Get all notes for a specific ticket
router.get('/:ticketId', authMiddleware, getNotesByTicket);

// Admin: Delete a note
router.delete('/:noteId', authMiddleware, isAdmin, deleteNote);

module.exports = router;
