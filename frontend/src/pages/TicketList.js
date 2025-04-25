import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/TicketList.css';

function TicketList() {
    const [tickets, setTickets] = useState([]);
    const user = JSON.parse(localStorage.getItem('user'));
    const UserRole = user.role;
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = () => {
        axios.get('https://helpdesk-system-5nuy.vercel.app/api/ticket', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        })
            .then(res => setTickets(res.data))
            .catch(err => console.error('Error loading tickets', err));
    };

    const handleStatusChange = (ticketId, newStatus) => {
        axios.put(`https://helpdesk-system-5nuy.vercel.app/api/ticket/${ticketId}/status`,
            { status: newStatus },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                }
            }
        )
            .then(() => {
                setTickets(prevTickets =>
                    prevTickets.map(ticket =>
                        ticket._id === ticketId ? { ...ticket, status: newStatus } : ticket
                    )
                );
            })
            .catch(err => {
                console.error('Error updating ticket status:', err);
                alert('Failed to update status');
            });
    };

    return (
        <div className="ticket-list-container">
            <h2>Tickets</h2>
            <table className="ticket-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Status</th>
                        <th>Customer</th>
                        <th>Last Updated</th>
                        <th>Add Notes</th>
                    </tr>
                </thead>
                <tbody>
                    {tickets.map(ticket => (
                        <tr key={ticket._id}>
                            <td>{ticket._id}</td>
                            <td>
                                <Link to={`/tickets/${ticket._id}`} className="ticket-link">
                                    {ticket.title}
                                </Link>
                            </td>
                            <td>
                                {UserRole !== 'customer' ? (
                                    <select
                                        value={ticket.status}
                                        onChange={(e) => handleStatusChange(ticket._id, e.target.value)}
                                        className="status-select"
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Pending">Pending</option>
                                        <option value="Closed">Closed</option>
                                    </select>
                                ) : (
                                    ticket.status
                                )}
                            </td>
                            <td>{ticket.customer?.name || 'N/A'}</td>
                            <td>{new Date(ticket.updatedAt).toLocaleString()}</td>
                            <td>
                                <button
                                    className="notes-button"
                                    onClick={() => navigate(`/tickets/${ticket._id}`)}
                                >
                                    Notes
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default TicketList;
