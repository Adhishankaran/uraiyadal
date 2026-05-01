import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { supabase } from '../supabaseClient';

const Signup = () => {
    const [formData, setFormData] = useState({ name: '', username: '', password: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setSignupLoading(true);

    try {
        const { error } = await supabase.from('users').insert([
            {
                name: signupData.name,
                username: signupData.username,
                password: signupData.password,
            }
        ]);

        if (error) throw error;

        toast.success('Account created successfully!');
        setIsRightPanelActive(false);

    } catch (error) {
        toast.error(error.message || 'Signup failed');
    } finally {
        setSignupLoading(false);
    }
  };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-300 to-primary-500 dark:from-primary-900 dark:to-slate-950 p-4">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md glass p-8 rounded-2xl shadow-xl"
            >
                <h2 className="text-3xl font-bold text-center mb-6 text-slate-800 dark:text-white">
                    Create Account
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                        <input
                            name="name"
                            type="text"
                            required
                            placeholder="John Doe"
                            className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 focus:ring-2 focus:ring-primary-500 outline-none transition-all dark:text-white"
                            onChange={handleChange}
                        />
                    </div>
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
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
                        <input
                            name="password"
                            type="password"
                            required
                            placeholder="••••••••"
                            className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 focus:ring-2 focus:ring-primary-500 outline-none transition-all dark:text-white"
                            onChange={handleChange}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold p-3 rounded-lg transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <p className="mt-6 text-center text-slate-600 dark:text-slate-400">
                    Already have an account? <Link to="/login" className="text-primary-600 hover:underline">Login</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Signup;
