import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('userInfo')) || null);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('userInfo', JSON.stringify(userData));
        localStorage.setItem('token', userData.token);
        localStorage.setItem('refreshToken', userData.refreshToken);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('userInfo');
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
