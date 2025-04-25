import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/CreateTicket.css';

function CreateTicket() {
    const [title, setTitle] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/api/ticket', { title }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                }
            });
            alert('Ticket submitted!');
            navigate('/tickets');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to create ticket');
        }
    };

    return (
        <div className="create-ticket-container">
            <h2>Create New Ticket</h2>
            <form onSubmit={handleSubmit}>
                <label>Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required
                />
                <button type="submit">Submit Ticket</button>
            </form>
        </div>
    );
}

export default CreateTicket;
