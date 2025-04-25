import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        user: null,
        token: localStorage.getItem('token'),
    });

    useEffect(() => {
        if (auth.token && !auth.user) {
            // You can fetch user profile using the token here if needed
        }
    }, [auth.token]);

    const login = (user, token) => {
        localStorage.setItem('token', token);
        setAuth({ user, token });
    };

    const logout = () => {
        localStorage.removeItem('token');
        setAuth({ user: null, token: null });
    };

    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
