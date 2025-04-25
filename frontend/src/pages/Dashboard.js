import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/Dashboard.css';

function Dashboard() {
    const [stats, setStats] = useState({ totalTickets: 0, totalCustomers: 0 });
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    const role = user.role;

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get('http://localhost:8000/api/ticket', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token
                    }
                });
                setStats(res.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="dashboard-container">
            <h2>Helpdesk System</h2>
            <h3>Hello, {role}. Welcome to your Dashboard.</h3>
        </div>
    );
}

export default Dashboard;
