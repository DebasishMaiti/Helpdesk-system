import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Home.css';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="home-container">
            <div className="home-box">
                <h1>Welcome to Helpdesk System</h1>
                <h2><u>Attention!!  Attention!!  Attention!!</u></h2>
                <h3>customer Login Credential:-email:-user@gmail.com</h3>
                <h3>agent Login Credential:-email:-agent@gmail.com</h3>
                <h3>admin Login Credential:-email:-admin@gmail.com</h3>
                <h3>Every email's password:-123</h3>
                <p><strong>What would you like to do?</strong></p>
                <div className="button-group">
                    <button onClick={() => navigate('/register')} className="home-button">Register</button>
                    <button onClick={() => navigate('/login')} className="home-button">Login</button>
                </div>
            </div>
        </div>
    );
};

export default Home;
