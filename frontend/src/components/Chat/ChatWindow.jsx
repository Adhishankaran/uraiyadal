import React, { useState, useEffect, useRef } from 'react';
import { Send, Image, Paperclip, MoreVertical, ChevronLeft, Smile } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import API from '../../services/api';
import toast from 'react-hot-toast';
import EmojiPicker from 'emoji-picker-react';

const ChatWindow = ({ selectedChat, setSelectedChat, setChats }) => {
    const { user } = useAuth();
    const socket = useSocket();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchMessages = async () => {
        if (!selectedChat) return;
        setLoading(true);
        try {
            const { data } = await API.get(`/messages/${selectedChat._id}`);
            setMessages(data);
            socket.emit('join chat', selectedChat._id);
        } catch (error) {
            toast.error('Failed to load messages');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, [selectedChat]);

    useEffect(() => {
        if (!socket) return;
        socket.on('message received', (newMessageReceived) => {
            if (!selectedChat || selectedChat._id !== newMessageReceived.chat._id) {
                // notification logic here could go here
            } else {
                setMessages((prev) => [...prev, newMessageReceived]);
                socket.emit('mark as seen', {
                    messageId: newMessageReceived._id,
                    chatId: selectedChat._id,
                    senderId: newMessageReceived.sender._id || newMessageReceived.sender
                });
            }
        });

        socket.on('typing', () => setIsTyping(true));
        socket.on('stop typing', () => setIsTyping(false));

        socket.on('message status update', ({ messageId, status, chatId }) => {
            if (selectedChat?._id === chatId) {
                setMessages(prev => prev.map(m => m._id === messageId ? { ...m, status } : m));
            }
        });

        return () => {
             socket.off('message received');
             socket.off('typing');
             socket.off('stop typing');
             socket.off('message status update');
        };
    }, [socket, selectedChat]);

    const sendMessage = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        if (!newMessage.trim()) return;

        socket.emit('stop typing', selectedChat._id);
        try {
            const currentMessage = newMessage;
            setNewMessage('');
            const { data } = await API.post('/messages', {
                content: currentMessage,
                chatId: selectedChat._id,
            });
            socket.emit('new message', data);
            setMessages((prev) => [...prev, data]);
        } catch (error) {
            toast.error('Failed to send message');
        }
    };

    const handleTyping = (e) => {
        setNewMessage(e.target.value);
        if (!socket) return;

        if (!typing) {
            setTyping(true);
            socket.emit('typing', selectedChat._id);
        }
        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= timerLength && typing) {
                socket.emit('stop typing', selectedChat._id);
                setTyping(false);
            }
        }, timerLength);
    };

    const handleEmojiClick = (emojiData) => {
        setNewMessage(prev => prev + emojiData.emoji);
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        toast.loading('Uploading...', { id: 'upload' });
        try {
            const { data: uploadData } = await API.post('/messages/upload', formData);
            const { data: messageData } = await API.post('/messages', {
                chatId: selectedChat._id,
                messageType: uploadData.type.startsWith('image') ? 'image' : 'file',
                fileUrl: uploadData.url,
                content: file.name
            });
            socket.emit('new message', messageData);
            setMessages([...messages, messageData]);
            toast.success('Uploaded!', { id: 'upload' });
        } catch (error) {
            toast.error('File storage keys missing in .env. Files cannot be sent until Cloudinary is configured.', { id: 'upload' });
        }
    };

    const getSenderName = (chat) => {
        if (chat.isGroupChat) return chat.chatName;
        return chat.users.find(u => u._id !== user._id)?.name;
    };

    const getDefaultAvatar = (name) => {
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=128`;
    };

    return (
        <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800">
            {/* Chat Header */}
            <div className="p-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 glass z-10">
                <div className="flex items-center gap-3">
                    <button onClick={() => setSelectedChat(null)} className="md:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                        <ChevronLeft size={20} className="dark:text-white" />
                    </button>
                    <div className="relative">
                        <img 
                            src={selectedChat.isGroupChat ? 'https://cdn-icons-png.flaticon.com/512/166/166258.png' : (selectedChat.users.find(u => u._id !== user._id)?.avatar || getDefaultAvatar(getSenderName(selectedChat)))} 
                            className="w-10 h-10 rounded-full object-cover shadow-sm border border-slate-200 dark:border-slate-700" 
                            alt="avatar"
                            onError={(e) => { e.target.src = getDefaultAvatar(getSenderName(selectedChat)); }}
                        />
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
                    </div>
                    <div>
                        <h3 className="font-semibold text-sm dark:text-white">{getSenderName(selectedChat)}</h3>
                        <p className="text-[10px] text-green-500 font-medium">{isTyping ? 'typing...' : 'Online'}</p>
                    </div>
                </div>
                <div className="flex gap-4 text-slate-500">
                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <MoreVertical size={20} />
                    </button>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950/50 relative">
                {/* Watermark Logo */}
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none">
                    <img src="/logo.jpeg" alt="Watermark" className="w-[300px] h-[300px] md:w-[500px] md:h-[500px] object-contain opacity-[0.03]" />
                </div>
                
                <div className="relative z-10 space-y-4">
                    {messages.map((m) => {
                    const isMe = String(m.sender._id || m.sender) === String(user._id);
                    return (
                    <div key={m._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[75%] px-4 py-2 rounded-2xl shadow-sm ${isMe ? 'bg-primary-600 text-white rounded-tr-none' : 'bg-white dark:bg-slate-800 dark:text-white rounded-tl-none'}`}>
                            {m.messageType === 'image' && (
                                <img src={m.fileUrl} alt="sent" className="rounded-lg mb-2 max-h-60 cursor-pointer" />
                            )}
                            {m.messageType === 'file' && (
                                <a href={m.fileUrl} target="_blank" className="flex items-center gap-2 text-sm underline pb-1">
                                    <Paperclip size={14} /> {m.content}
                                </a>
                            )}
                            <p className="text-sm">{m.content}</p>
                            <div className="flex justify-end items-center gap-1 mt-1 opacity-70 text-[10px]">
                                <span>{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                {isMe && (
                                    <span>
                                        {m.status === 'seen' ? (
                                            <span className="text-blue-300">✓✓</span>
                                        ) : m.status === 'delivered' ? (
                                            <span>✓✓</span>
                                        ) : (
                                            <span>✓</span>
                                        )}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                )})}
                </div>
                <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form onSubmit={sendMessage} className="p-4 border-t border-slate-200 dark:border-slate-800 glass relative flex items-center gap-2">
                {showEmojiPicker && (
                    <div className="absolute bottom-20 left-4 z-50">
                        <EmojiPicker onEmojiClick={handleEmojiClick} theme="auto" />
                    </div>
                )}
                <input 
                    type="file" 
                    hidden 
                    ref={fileInputRef} 
                    onChange={handleFileUpload}
                />
                <button type="button" onClick={() => fileInputRef.current.click()} className="p-2 text-slate-500 hover:text-primary-600 transition-colors">
                    <Paperclip size={22} />
                </button>
                <button type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="p-2 text-slate-500 hover:text-primary-600 transition-colors">
                    <Smile size={22} />
                </button>
                <input 
                    type="text" 
                    placeholder="Type a message..." 
                    value={newMessage}
                    onChange={handleTyping}
                    onFocus={() => setShowEmojiPicker(false)}
                    className="flex-1 bg-slate-100 dark:bg-slate-800 p-2.5 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 dark:text-white transition-all"
                />
                <button 
                    disabled={!newMessage.trim()} 
                    className="p-3 bg-primary-600 text-white rounded-xl shadow-lg shadow-primary-500/30 hover:bg-primary-700 transition-all disabled:opacity-50"
                >
                    <Send size={20} />
                </button>
            </form>
        </div>
    );
};

export default ChatWindow;
