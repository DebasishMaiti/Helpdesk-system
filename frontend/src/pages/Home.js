import React from 'react'
import { useNavigate } from 'react-router-dom'
const Home = () => {
    const navigate = useNavigate()
    return (
        <div style={{ textAlign: 'center' }}>
            <h2>Welcme to Helpdesk System</h2>
            <div>
                <button onClick={() => navigate('/register')}>Register</button>
                <button onClick={() => navigate('/login')}>Login</button>
            </div>
        </div>
    )
}

export default Home
