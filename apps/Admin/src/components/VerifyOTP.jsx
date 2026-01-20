import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyOTP } from '../auth/authServices'; // Teri authServices se
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { ShieldCheck, Loader2, ArrowLeft } from 'lucide-react';

const VerifyOTP = () => {
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    
    // Registration page se email pass ho raha hai ya nahi check karo
    const email = location.state?.email;

    useEffect(() => {
        if (!email) {
            toast.warn("Please register first");
            navigate("/register");
        }
    }, [email, navigate]);

    const handleVerify = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await verifyOTP({ email, otp }); // Backend call
            toast.success("Account Verified Successfully! 🎉");
            navigate("/login");
        } catch (err) {
            toast.error(err.response?.data?.message || "Invalid OTP");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-[#0f172a] text-white overflow-hidden relative">
            {/* Soft Background Glows */}
            <div className="absolute top-[-10%] right-[-10%] w-80 h-80 bg-emerald-600/10 rounded-full blur-[120px]"></div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-slate-800/40 backdrop-blur-2xl p-10 rounded-3xl w-full max-w-[420px] border border-slate-700/50 shadow-2xl z-10"
            >
                <button 
                    onClick={() => navigate("/register")}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm mb-6"
                >
                    <ArrowLeft size={16} /> Back to Register
                </button>

                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
                        <ShieldCheck className="text-emerald-400" size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Verify Your Email</h2>
                    <p className="text-slate-400 text-sm mt-2">
                        We've sent a 6-digit code to <br/>
                        <span className="text-emerald-400 font-medium">{email}</span>
                    </p>
                </div>

                <form onSubmit={handleVerify} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
                            Security Code
                        </label>
                        <input 
                            type="text" 
                            maxLength="6"
                            placeholder="Enter 6-digit OTP" 
                            className="w-full p-4 rounded-2xl bg-slate-900/60 border border-slate-700 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-center text-2xl tracking-[0.5em] font-mono transition-all"
                            onChange={e => setOtp(e.target.value)} 
                            required
                        />
                    </div>

                    <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={loading || otp.length < 6}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            "Verify Account"
                        )}
                    </motion.button>
                </form>

                <p className="text-center text-sm text-slate-500 mt-8">
                    Didn't receive code? <button className="text-emerald-400 font-semibold hover:underline">Resend OTP</button>
                </p>
            </motion.div>
        </div>
    );
};

export default VerifyOTP;