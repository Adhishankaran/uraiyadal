import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginLoading(true);

    try {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('username', loginData.username)
            .eq('password', loginData.password)
            .single();

        if (error || !data) {
            throw new Error('Invalid username or password');
        }

        localStorage.setItem('user', JSON.stringify(data));

        toast.success('Welcome back!');
        navigate('/');

    } catch (error) {
        toast.error(error.message || 'Login failed');
    } finally {
        setLoginLoading(false);
    }
};
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-300 to-primary-500 dark:from-primary-900 dark:to-slate-950 p-4">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md glass p-8 rounded-2xl shadow-xl"
            >
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold dark:text-white">Sign In</h2>
                    <p className="text-slate-500 mt-2">Welcome back to Uraiyadal</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Username (ID)</label>
                        <input
                            name="username"
                            type="text"
                            required
                            placeholder="user123"
                            className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 focus:ring-2 focus:ring-primary-500 outline-none transition-all dark:text-white"
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <div className="flex justify-between mb-1">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                            <Link to="/forgot-password" size="sm" className="text-sm text-primary-600 hover:underline">Forgot?</Link>
                        </div>
                        <input
                            name="password"
                            type="password"
                            required
                            className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 focus:ring-2 focus:ring-primary-500 outline-none transition-all dark:text-white"
                            onChange={handleChange}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold p-3 rounded-lg transition-colors shadow-lg shadow-primary-500/30 disabled:opacity-50"
                    >
                        {loading ? 'Logging in...' : 'Sign In'}
                    </button>
                </form>

                <p className="mt-8 text-center text-slate-600 dark:text-slate-400">
                    Don't have an account? <Link to="/signup" className="text-primary-600 hover:underline">Create one</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
