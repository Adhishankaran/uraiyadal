import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import API from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Auth = () => {
    const [isRightPanelActive, setIsRightPanelActive] = useState(false);

    // Login State
    const [loginData, setLoginData] = useState({ username: '', password: '' });
    const [loginLoading, setLoginLoading] = useState(false);

    // Signup State
    const [signupData, setSignupData] = useState({ name: '', username: '', password: '' });
    const [signupLoading, setSignupLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.pathname === '/signup') {
            setIsRightPanelActive(true);
        } else {
            setIsRightPanelActive(false);
        }
    }, [location]);

    const handleLoginChange = (e) =>
        setLoginData({ ...loginData, [e.target.name]: e.target.value });

    const handleSignupChange = (e) =>
        setSignupData({ ...signupData, [e.target.name]: e.target.value });

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setLoginLoading(true);
        try {
            const { data } = await API.post('/auth/login', loginData);
            login(data);
            toast.success('Welcome back!');
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
        } finally {
            setLoginLoading(false);
        }
    };

    const handleSignupSubmit = async (e) => {
        e.preventDefault();
        setSignupLoading(true);
        try {
            const { data } = await API.post('/auth/register', signupData);
            toast.success('Account created successfully!');
            login(data);
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Signup failed');
        } finally {
            setSignupLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-yellow-50 dark:bg-slate-950 p-4 font-['Outfit']">

            {/* Giant Watermark Background */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none opacity-5">
                <img
                    src={`${import.meta.env.BASE_URL}logo.jpeg`}
                    alt="Watermark"
                    className="w-[600px] md:w-[800px] object-contain"
                />
            </div>

            {/* Absolute Title */}
            {/* Absolute Title & Logo */}
       <div className="absolute top-8 left-0 right-0 flex items-center justify-center z-10 gap-6">
            <img
              src="/uraiyadal/logo.jpeg"
              alt="Logo"
              className="w-20 h-20 md:w-28 md:h-28 object-contain border-2 border-yellow-500 rounded-full shadow-lg bg-white"
            />

    <h1 className="text-6xl md:text-8xl font-black text-yellow-500/40 tracking-widest drop-shadow-sm">
        URAIYADAL
    </h1>
</div>

            <div className={`auth-container bg-white dark:bg-slate-900 shadow-2xl relative w-[900px] max-w-full min-h-[550px] overflow-hidden rounded-[30px] z-10 ${isRightPanelActive ? "right-panel-active" : ""}`}>

                {/* Sign Up Container */}
                <div className="form-container sign-up-container">
                    <form
                        onSubmit={handleSignupSubmit}
                        className="bg-white dark:bg-slate-900 flex items-center justify-center flex-col px-12 h-full text-center"
                    >
                        <h1 className="font-bold text-3xl mb-6 text-slate-800 dark:text-white">
                            Registration
                        </h1>

                        <div className="w-full mb-4 relative">
                            <input
                                name="name"
                                type="text"
                                required
                                value={signupData.name}
                                placeholder="Full Name"
                                className="bg-slate-100 dark:bg-slate-800 border-none px-4 py-3 rounded-lg w-full outline-none focus:ring-2 focus:ring-yellow-400 dark:text-white transition-all"
                                onChange={handleSignupChange}
                            />
                        </div>

                        <div className="w-full mb-4 relative">
                            <input
                                name="username"
                                type="text"
                                required
                                value={signupData.username}
                                placeholder="Username"
                                className="bg-slate-100 dark:bg-slate-800 border-none px-4 py-3 rounded-lg w-full outline-none focus:ring-2 focus:ring-yellow-400 dark:text-white transition-all"
                                onChange={handleSignupChange}
                            />
                        </div>

                        <div className="w-full mb-6 relative">
                            <input
                                name="password"
                                type="password"
                                required
                                value={signupData.password}
                                placeholder="Password"
                                className="bg-slate-100 dark:bg-slate-800 border-none px-4 py-3 rounded-lg w-full outline-none focus:ring-2 focus:ring-yellow-400 dark:text-white transition-all"
                                onChange={handleSignupChange}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={signupLoading}
                            className="rounded-full border border-yellow-500 bg-yellow-500 text-white text-sm font-bold py-3 px-12 uppercase tracking-wider transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 shadow-lg shadow-yellow-500/30"
                        >
                            {signupLoading ? 'Registering...' : 'Register'}
                        </button>
                    </form>
                </div>

                {/* Sign In Container */}
                <div className="form-container sign-in-container">
                    <form
                        onSubmit={handleLoginSubmit}
                        className="bg-white dark:bg-slate-900 flex items-center justify-center flex-col px-12 h-full text-center"
                    >
                        <h1 className="font-bold text-3xl mb-6 text-slate-800 dark:text-white">
                            Login
                        </h1>

                        <div className="w-full mb-4 relative">
                            <input
                                name="username"
                                type="text"
                                required
                                value={loginData.username}
                                placeholder="Username"
                                className="bg-slate-100 dark:bg-slate-800 border-none px-4 py-3 rounded-lg w-full outline-none focus:ring-2 focus:ring-yellow-400 dark:text-white transition-all"
                                onChange={handleLoginChange}
                            />
                        </div>

                        <div className="w-full mb-2 relative">
                            <input
                                name="password"
                                type="password"
                                required
                                value={loginData.password}
                                placeholder="Password"
                                className="bg-slate-100 dark:bg-slate-800 border-none px-4 py-3 rounded-lg w-full outline-none focus:ring-2 focus:ring-yellow-400 dark:text-white transition-all"
                                onChange={handleLoginChange}
                            />
                        </div>

                        <a
                            href="#"
                            className="text-sm text-yellow-600 dark:text-yellow-400 hover:underline mb-6"
                        >
                            Forgot Password?
                        </a>

                        <button
                            type="submit"
                            disabled={loginLoading}
                            className="rounded-full border border-yellow-500 bg-yellow-500 text-white text-sm font-bold py-3 px-12 uppercase tracking-wider transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 shadow-lg shadow-yellow-500/30"
                        >
                            {loginLoading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                </div>

                {/* Overlay Container */}
                <div className="overlay-container">
                    <div className="overlay">
                        <div className="overlay-panel overlay-left">
                            <h1 className="font-bold text-4xl text-white mb-4">
                                Welcome Back!
                            </h1>
                            <p className="text-yellow-50 text-sm font-light leading-relaxed tracking-wide mb-8 px-6">
                                Already have an account? Login with your details to start chatting instantly.
                            </p>
                            <button
                                type="button"
                                className="rounded-full border-2 border-white bg-transparent text-white text-sm font-bold py-3 px-12 uppercase tracking-wider transition-transform hover:scale-105 active:scale-95"
                                onClick={() => setIsRightPanelActive(false)}
                            >
                                Login
                            </button>
                        </div>

                        <div className="overlay-panel overlay-right">
                            <h1 className="font-bold text-4xl text-white mb-4">
                                Hello, Welcome!
                            </h1>
                            <p className="text-yellow-50 text-sm font-light leading-relaxed tracking-wide mb-8 px-6">
                                Don't have an account? Join Uraiyadal and connect with friends immediately.
                            </p>
                            <button
                                type="button"
                                className="rounded-full border-2 border-white bg-transparent text-white text-sm font-bold py-3 px-12 uppercase tracking-wider transition-transform hover:scale-105 active:scale-95"
                                onClick={() => setIsRightPanelActive(true)}
                            >
                                Register
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Auth;
