const Note = require('../Model/NotesModel');
const Ticket = require('../Model/TicketModel');

// Get notes for a ticket (must match ownership or be agent/admin)
exports.getNotesByTicket = async (req, res) => {
    try {
        const ticketId = req.params.ticketId;

        const ticket = await Ticket.findById(ticketId).populate('customer');
        if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

        // Check role-based access
        if (req.user.role === 'customer' && String(ticket.customer._id) !== String(req.user._id)) {
            return res.status(403).json({ message: 'Unauthorized to view notes' });
        }

        const notes = await Note.find({ ticket: ticketId })
            .populate('user', 'name role')
            .sort({ createdAt: 1 });

        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching notes', error: error.message });
    }
};

// Delete a note (Admin Only)
exports.deleteNote = async (req, res) => {
    try {
        const noteId = req.params.noteId;

        const note = await Note.findById(noteId);
        if (!note) return res.status(404).json({ message: 'Note not found' });

        // Remove reference from ticket
        await Ticket.findByIdAndUpdate(note.ticket, {
            $pull: { notes: note._id }
        });

        await Note.findByIdAndDelete(noteId);

        res.status(200).json({ message: 'Note deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting note', error: error.message });
    }
};
