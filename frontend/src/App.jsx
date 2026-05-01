import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { CallProvider } from './context/CallContext';
import Home from './pages/Home';
import Auth from './pages/Auth';
import './index.css';

const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    return user ? children : <Navigate to="/login" />;
};

const App = () => {
    return (
        <AuthProvider>
            <SocketProvider>
                <CallProvider>
                    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
                        <Toaster position="top-center" reverseOrder={false} />
                        <Router>
                            <Routes>
                                <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                                <Route path="/login" element={<Auth />} />
                                <Route path="/signup" element={<Auth />} />
                            </Routes>
                        </Router>
                    </div>
                </CallProvider>
            </SocketProvider>
        </AuthProvider>
    );
};

export default App;
