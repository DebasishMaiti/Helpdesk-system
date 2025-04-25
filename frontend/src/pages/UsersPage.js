import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/UserPage.css';

function UsersPage() {
    const [users, setUsers] = useState([]);
    const [form, setForm] = useState({ name: '', email: '', password: '', role: 'customer' });
    const token = localStorage.getItem('token');

    const fetchUsers = () => {
        axios.get('https://helpdesk-system-5nuy.vercel.app/api/user/users', {
            headers: {
                'Authorization': token
            }
        }).then(res => setUsers(res.data));
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleRoleChange = (id, role) => {
        axios.put(`https://helpdesk-system-5nuy.vercel.app/api/user/users/${id}/role`, { role }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        }).then(fetchUsers);
    };

    const handleAddUser = (e) => {
        e.preventDefault();
        axios.post('https://helpdesk-system-5nuy.vercel.app/api/user/adduser', form, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        }).then(() => {
            setForm({ name: '', email: '', password: '', role: 'customer' });
            fetchUsers();
        });
    };

    return (
        <div className="users-page">
            <h2>Users</h2>
            <table className="users-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Change Role</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(u => (
                        <tr key={u._id}>
                            <td>{u.name}</td>
                            <td>{u.email}</td>
                            <td>{u.role}</td>
                            <td>
                                <select value={u.role} onChange={e => handleRoleChange(u._id, e.target.value)}>
                                    <option value="customer">Customer</option>
                                    <option value="agent">Agent</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h3>Add New User</h3>
            <form onSubmit={handleAddUser} className="add-user-form">
                <input
                    placeholder="Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                />
                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                    <option value="customer">Customer</option>
                    <option value="agent">Agent</option>
                    <option value="admin">Admin</option>
                </select>
                <button type="submit">Add User</button>
            </form>
        </div>
    );
}

export default UsersPage;
