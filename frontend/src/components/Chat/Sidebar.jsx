import React, { useState } from 'react';
import { Search, MoreVertical, Plus, User as UserIcon, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';

const Sidebar = ({ chats, setChats, selectedChat, setSelectedChat, loading }) => {
    const { user, setUser, logout } = useAuth();
    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const fileInputRef = React.useRef(null);

    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) {
            setSearchResults([]);
            return;
        }
        setSearchLoading(true);
        try {
            const { data } = await API.get(`/auth/search?search=${query}`);
            setSearchResults(data);
        } catch (error) {
            console.error('Search failed');
        } finally {
            setSearchLoading(false);
        }
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        toast.loading('Updating profile...', { id: 'profile' });
        try {
            // Use the same upload route we created for messages
            const { data: uploadData } = await API.post('/messages/upload', formData);
            const { data: updatedUser } = await API.put('/auth/profile', {
                avatar: uploadData.url
            });
            
            setUser(updatedUser);
            localStorage.setItem('userInfo', JSON.stringify(updatedUser));
            toast.success('Profile updated!', { id: 'profile' });
        } catch (error) {
            toast.error('Failed to update profile', { id: 'profile' });
        }
    };

    const accessChat = async (userId) => {
        try {
            const { data } = await API.post('/chats', { userId });
            if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
            setSelectedChat(data);
            setSearch('');
            setSearchResults([]);
        } catch (error) {
            console.error('Error accessing chat');
        }
    };

    const getChatName = (chat) => {
        if (chat.isGroupChat) return chat.chatName;
        return chat.users.find(u => u._id !== user._id)?.name;
    };

    const getDefaultAvatar = (name) => {
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=128`;
    };

    const getChatAvatar = (chat) => {
        if (chat.isGroupChat) return 'https://cdn-icons-png.flaticon.com/512/166/166258.png';
        const targetUser = chat.users.find(u => u._id !== user._id);
        return targetUser?.avatar || getDefaultAvatar(targetUser?.name || 'User');
    };

    return (
        <div className={`w-full md:w-80 border-r border-slate-200 dark:border-slate-800 flex flex-col glass ${selectedChat ? 'hidden md:flex' : 'flex'}`}>
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleAvatarChange} 
                className="hidden" 
                accept="image/*"
            />
            {/* User Profile Header */}
            <div className="p-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3">
                    <div className="relative group cursor-pointer" onClick={() => fileInputRef.current.click()}>
                        <img 
                            src={user?.avatar || getDefaultAvatar(user?.name)} 
                            alt="Me" 
                            className="w-10 h-10 rounded-full object-cover border-2 border-primary-500/20 group-hover:opacity-75 transition-all" 
                            onError={(e) => { e.target.src = getDefaultAvatar(user?.name); }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <UserIcon size={12} className="text-white bg-black/50 rounded-full p-0.5" />
                        </div>
                    </div>
                    <div>
                        <p className="font-semibold text-sm dark:text-white truncate w-32">{user?.name}</p>
                        <p className="text-xs text-green-500 font-medium">Online</p>
                    </div>
                </div>
                <div className="flex gap-2 text-slate-500">
                    <button onClick={logout} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <LogOut size={20} />
                    </button>
                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <MoreVertical size={20} />
                    </button>
                </div>
            </div>

            {/* Search */}
            <div className="p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search users..." 
                        className="w-full bg-slate-100 dark:bg-slate-900 p-2.5 pl-10 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all dark:text-white"
                        value={search}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto">
                {search ? (
                    <div className="px-2">
                        {searchLoading ? <p className="p-4 text-center">Searching...</p> : (
                            searchResults.map(u => (
                                <div key={u._id} onClick={() => accessChat(u._id)} className="p-3 flex items-center gap-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all m-1">
                                    <img src={u.avatar || getDefaultAvatar(u.name)} className="w-11 h-11 rounded-full object-cover" onError={(e) => { e.target.src = getDefaultAvatar(u.name); }} />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm dark:text-white truncate">{u.name}</p>
                                        <p className="text-xs text-slate-500 truncate">{u.email}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                ) : (
                    <div className="px-2">
                        {loading ? <p className="p-4 text-center">Loading chats...</p> : (
                            chats.map(chat => (
                                <div 
                                    key={chat._id} 
                                    onClick={() => setSelectedChat(chat)}
                                    className={`p-3 flex items-center gap-3 cursor-pointer rounded-xl transition-all m-1 ${selectedChat?._id === chat._id ? 'bg-primary-50 dark:bg-primary-900/20' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                                >
                                    <div className="relative">
                                        <img src={getChatAvatar(chat)} className="w-11 h-11 rounded-full object-cover" onError={(e) => { e.target.src = getDefaultAvatar(getChatName(chat)); }} />
                                        {!chat.isGroupChat && (
                                             <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-950 rounded-full"></div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <p className="font-semibold text-sm dark:text-white truncate">{getChatName(chat)}</p>
                                            <span className="text-[10px] text-slate-400">12:30 PM</span>
                                        </div>
                                        <p className="text-xs text-slate-500 truncate">
                                            {chat.latestMessage ? `${chat.latestMessage.sender.name}: ${chat.latestMessage.content}` : 'Start a conversation'}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Sidebar;
