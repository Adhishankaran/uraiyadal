import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { user } = useAuth();
    const ENDPOINT = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

    useEffect(() => {
        if (user) {
            const newSocket = io(ENDPOINT);
            setSocket(newSocket);

            newSocket.emit('setup', user);

            return () => newSocket.disconnect();
        }
    }, [user]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);
