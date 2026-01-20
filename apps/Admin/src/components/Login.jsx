import React, { useState } from 'react';
import { useAuth } from '../auth/useAuth';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { Mail, Lock, LogIn, Loader2 } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { handleLogin } = useAuth();

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // handleLogin internally redirect karega based on role
            await handleLogin({ email, password });
            toast.success("Welcome Back! Redirecting...");
        } catch (err) {
            // Error handling jo global api interceptor se match kare
            toast.error(err.message || "Invalid Credentials");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-[#0f172a] text-white font-sans overflow-hidden relative">
            {/* Background Decorative Circles */}
            <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-blue-600/20 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-72 h-72 bg-purple-600/20 rounded-full blur-[120px]"></div>

            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="bg-slate-800/50 backdrop-blur-xl p-10 rounded-2xl w-full max-w-[400px] border border-slate-700 shadow-2xl z-10"
            >
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        sKILL2HIRE
                    </h2>
                    <p className="text-slate-400 text-sm mt-2">Enter your details to access your console</p>
                </div>

                <form onSubmit={onSubmit} className="space-y-5">
                    <div className="relative group">
                        <Mail className="absolute left-3 top-3 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={20} />
                        <input 
                            type="email" 
                            required
                            placeholder="Email Address" 
                            className="w-full pl-11 p-3 rounded-xl bg-slate-900/50 border border-slate-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-600"
                            onChange={e => setEmail(e.target.value)} 
                        />
                    </div>

                    <div className="relative group">
                        <Lock className="absolute left-3 top-3 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={20} />
                        <input 
                            type="password" 
                            required
                            placeholder="Password" 
                            className="w-full pl-11 p-3 rounded-xl bg-slate-900/50 border border-slate-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-600"
                            onChange={e => setPassword(e.target.value)} 
                        />
                    </div>

                    <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-500 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all disabled:opacity-70"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            <>
                                <LogIn size={20} /> Sign In
                            </>
                        )}
                    </motion.button>
                </form>

                <div className="mt-8 text-center text-sm text-slate-500">
                    Don't have an account? <span className="text-blue-400 cursor-pointer hover:underline">Request Access</span>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;