import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import Sidebar from '../components/Chat/Sidebar';
import ChatWindow from '../components/Chat/ChatWindow';
import { useSocket } from '../context/SocketContext';

const Home = () => {
    const { user } = useAuth();
    const socket = useSocket();
    const [selectedChat, setSelectedChat] = useState(null);
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchChats = async () => {
        try {
            const { data } = await API.get('/chats');
            setChats(data);
        } catch (error) {
            console.error('Failed to fetch chats');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchChats();
    }, [user]);

    return (
        <div className="flex h-screen bg-primary-50/50 dark:bg-slate-950 overflow-hidden">
            <Sidebar 
                chats={chats} 
                setChats={setChats} 
                selectedChat={selectedChat} 
                setSelectedChat={setSelectedChat} 
                loading={loading}
            />
            
            {selectedChat ? (
                <ChatWindow 
                    selectedChat={selectedChat} 
                    setSelectedChat={setSelectedChat}
                    setChats={setChats}
                />
            ) : (
                <div className="hidden md:flex flex-1 flex-col items-center justify-center text-slate-500 dark:text-slate-400 relative overflow-hidden">
                    {/* Watermark Logo */}
                    <img src="/logo.jpeg" alt="Watermark" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] object-contain opacity-[0.03] pointer-events-none" />
                    
                    <div className="w-20 h-20 bg-primary-100 dark:bg-slate-900 rounded-full flex items-center justify-center mb-4 relative z-10">
                        <svg className="w-10 h-10 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-medium dark:text-white relative z-10">Uraiyadal</h3>
                    <p className="relative z-10">Select a contact to start messaging</p>
                </div>
            )}
        </div>
    );
};

export default Home;
