import React, { useState } from 'react';
import { useAuth } from '../auth/useAuth';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { Mail, Lock, LogIn, Loader2, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { handleLogin } = useAuth();

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await handleLogin({ email, password });
            toast.success("Welcome Back! Redirecting...");
        } catch (err) {
            toast.error(err.message || "Invalid Credentials");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4 font-sans relative overflow-hidden">
            {/* Minimal Decorative Line at Top */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white p-10 rounded-2xl w-full max-w-[420px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 z-10"
            >
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                        sKILL2HIRE
                    </h2>
                    <p className="text-slate-500 mt-2 font-medium">Please enter your credentials</p>
                </div>

                <form onSubmit={onSubmit} className="space-y-6">
                    <div className="space-y-4">
                        {/* Email Field */}
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={19} />
                            <input 
                                type="email" 
                                required
                                placeholder="Email Address" 
                                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                                onChange={e => setEmail(e.target.value)} 
                            />
                        </div>

                        {/* Password Field */}
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={19} />
                            <input 
                                type="password" 
                                required
                                placeholder="Password" 
                                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                                onChange={e => setPassword(e.target.value)} 
                            />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <span className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer font-medium">Forgot password?</span>
                    </div>

                    <button 
                        disabled={loading}
                        className="w-full bg-slate-900 hover:bg-black text-white py-4 rounded-xl font-semibold shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:bg-slate-400"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            <>
                                Sign In <ChevronRight size={18} />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-slate-500 text-sm font-medium">
                        Don't have an account? {' '}
                        <Link to="/register" className="text-blue-600 hover:font-bold transition-all">
                            Request Access
                        </Link>
                    </p>
                </div>
            </motion.div>

            {/* Subtle background branding */}
            <div className="absolute bottom-8 text-slate-300 text-xs font-bold tracking-widest uppercase">
                Secure Terminal v1.0
            </div>
        </div>
    );
};

export default Login;