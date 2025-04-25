import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import '../css/Layout.css';

function Layout() {
    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();

    const logout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className="layout">
            {/* Sidebar */}
            <div className="sidebar">
                <div>
                    <h3>Helpdesk</h3>
                    <nav>
                        <ul>
                            <li><Link to="/dashboard">Dashboard</Link></li>
                            <li><Link to="/tickets">Tickets</Link></li>
                            {user.role === 'customer' && (
                                <li><Link to="/tickets/new">Create Ticket</Link></li>
                            )}
                            {user.role === 'admin' && <li><Link to="/users">Users</Link></li>}
                        </ul>
                    </nav>
                </div>
            </div>

            {/* Main content */}
            <div className="main">
                <div className="navbar">
                    <span>Welcome, {user.name} ({user.role})</span>
                    <button onClick={logout}>Logout</button>
                </div>
                <div className="page-content">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default Layout;
