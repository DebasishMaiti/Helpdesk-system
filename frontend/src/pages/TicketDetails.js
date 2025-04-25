import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../css/TicketDetail.css';

function TicketDetail() {
    const { id } = useParams();
    const [ticket, setTicket] = useState(null);
    const [noteMessage, setNoteMessage] = useState('');
    const [attachments, setAttachments] = useState([]);
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    const isAdmin = user?.role === 'admin';

    const fetchTicket = async () => {
        try {
            const res = await axios.get(`https://helpdesk-system-5nuy.vercel.app/api/ticket/${id}`, {
                headers: {
                    'Authorization': token,
                }
            });
            setTicket(res.data);
        } catch (err) {
            console.error('Error fetching ticket:', err);
        }
    };

    useEffect(() => {
        fetchTicket();
    }, [id]);

    const handleNoteSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('message', noteMessage);
        attachments.forEach(file => {
            formData.append('attachments', file);
        });

        try {
            await axios.post(`https://helpdesk-system-5nuy.vercel.app/api/ticket/${id}/notes`, formData, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'multipart/form-data',
                }
            });

            setNoteMessage('');
            setAttachments([]);
            fetchTicket();
        } catch (err) {
            console.error('Error adding note:', err);
            alert('Failed to add note');
        }
    };

    const deleteNote = async (noteId) => {
        if (!window.confirm('Are you sure you want to delete this note?')) return;
        try {
            await axios.delete(`https://helpdesk-system-5nuy.vercel.app/api/notes/${noteId}`, {
                headers: { Authorization: token }
            });
            alert('Note deleted');
            fetchTicket();
        } catch (err) {
            console.error('Error deleting note:', err);
            alert('Failed to delete note');
        }
    };

    const isImage = (filename) => {
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
        return imageExtensions.some(ext => filename.toLowerCase().endsWith(ext));
    };

    if (!ticket) return <div>Loading...</div>;

    return (
        <div className="ticket-detail-container">
            <h2>{ticket.title}</h2>
            <p>Status: {ticket.status}</p>
            <p>Customer: {ticket.customer.name}</p>

            <h3>Notes</h3>
            <ul className="notes-list">
                {ticket.notes.map(note => (
                    <li className="note-item" key={note._id}>
                        <span className="note-user">{note.user.name} ({note.user.role})</span>: {note.message}
                        <br />
                        <span className="note-time">{new Date(note.createdAt).toLocaleString()}</span>

                        {note.attachments?.length > 0 && (
                            <ul className="attachments-list">
                                {note.attachments.map((f, i) => (
                                    <li key={i}>
                                        {isImage(f) ? (
                                            <div>
                                                <img
                                                    src={`https://helpdesk-system-5nuy.vercel.app/Uploads/${f}`}
                                                    alt={f}
                                                    className="note-img"
                                                />
                                                <a href={`https://helpdesk-system-5nuy.vercel.app/Uploads/${f}`} target="_blank" rel="noreferrer">
                                                    View Full Image
                                                </a>
                                            </div>
                                        ) : (
                                            <a href={`https://helpdesk-system-5nuy.vercel.app/Uploads/${f}`} target="_blank" rel="noreferrer">
                                                {f.split('-').slice(1).join('-')}
                                            </a>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}

                        {isAdmin && (
                            <button className="note-delete-btn" onClick={() => deleteNote(note._id)}>Delete</button>
                        )}
                    </li>
                ))}
            </ul>

            <h3>Add Note</h3>
            <form onSubmit={handleNoteSubmit} className="add-note-form">
                <textarea
                    value={noteMessage}
                    onChange={(e) => setNoteMessage(e.target.value)}
                    required
                    placeholder="Write your note..."
                />
                <input
                    type="file"
                    multiple
                    onChange={(e) => setAttachments([...e.target.files])}
                />
                <button type="submit">Add Note</button>
            </form>
        </div>
    );
}

export default TicketDetail;
