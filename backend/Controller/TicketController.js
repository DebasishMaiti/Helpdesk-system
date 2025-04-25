const Ticket = require('../Model/TicketModel');
const Note = require('../Model/NotesModel');



// 1. Create a Ticket (Customer Only)
exports.createTicket = async (req, res) => {
    try {
        const { title } = req.body;
        console.log(req.user._id);

        const newTicket = new Ticket({
            title,


            customer: req.user._id, // user from auth middleware
        });

        await newTicket.save();

        res.status(201).json({
            message: 'Ticket created successfully.',
            ticket: newTicket
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to create ticket.', error: error.message });
    }
};

// 2. Get Tickets (Role-based: customer gets their own, others get all)
exports.getTickets = async (req, res) => {
    try {
        const filter = req.user.role === 'customer'
            ? { customer: req.user._id }
            : {};

        const tickets = await Ticket.find(filter)
            .populate('customer', 'name email')
            .sort({ updatedAt: -1 });

        res.status(200).json(tickets);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tickets.', error: error.message });
    }
};

// 3. Get Ticket by ID with Notes
exports.getTicketById = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id)
            .populate('customer', 'name email')
            .populate({
                path: 'notes',
                populate: { path: 'user', select: 'name role' },
                options: { sort: { createdAt: 1 } }
            });

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found.' });
        }

        // If customer trying to access another user's ticket
        if (req.user.role === 'customer' && String(ticket.customer._id) !== String(req.user._id)) {
            return res.status(403).json({ message: 'Unauthorized to view this ticket.' });
        }

        res.status(200).json(ticket);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching ticket.', error: error.message });
    }
};

// 4. Update Ticket Status (Agent or Admin Only)
exports.updateTicketStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['Active', 'Pending', 'Closed'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status value.' });
        }

        const ticket = await Ticket.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found.' });
        }

        res.status(200).json({
            message: 'Ticket status updated.',
            ticket
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating ticket status.', error: error.message });
    }
};

// 5. Add Note to Ticket
exports.addNoteToTicket = async (req, res) => {
    try {
        const { message } = req.body;
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) return res.status(404).json({ message: 'Ticket not found.' });

        // Customers can only add notes to their own tickets
        if (req.user.role === 'customer' && String(ticket.customer) !== String(req.user._id)) {
            return res.status(403).json({ message: 'Unauthorized to add note to this ticket.' });
        }

        // Handle uploaded files if any
        const attachments = req.files?.map(file => file.filename) || [];

        const note = await Note.create({
            ticket: ticket._id,
            user: req.user._id,
            message,
            attachments
        });

        ticket.notes.push(note._id);
        await ticket.save();

        res.status(201).json({
            message: 'Note added to ticket.',
            note
        });
    } catch (error) {
        res.status(500).json({ message: 'Error adding note.', error: error.message });
    }
};
