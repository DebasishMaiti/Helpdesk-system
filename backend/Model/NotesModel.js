const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    ticket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: { type: String, required: true },
    attachments: [String], // paths to uploaded files
}, {
    timestamps: true // includes createdAt (for timestamp)
});

module.exports = mongoose.model('Note', noteSchema);
