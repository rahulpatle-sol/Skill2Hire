import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { verifyOTP } from '../auth/authServices';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { ShieldCheck, Loader2, ArrowLeft, ChevronRight } from 'lucide-react';

const VerifyOTP = () => {
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    
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
        // 1. Backend se response lo (isme token aur user details honi chahiye)
        const response = await verifyOTP({ email, otp }); 
        
        // 2. LocalStorage update karo (Taaki Dashboard ko pata chale ki login hai)
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("token", response.data.token);

        toast.success("Verified & Logged In! 🚀");

        // 3. Role ke hisaab se direct dashboard bhejo
        const role = response.data.user.role;
        if (role === "ADMIN") navigate("/admin/users");
        else if (role === "MANAGER") navigate("/manager/bridge");
        
    } catch (err) {
        toast.error(err.response?.data?.message || "Invalid OTP");
    } finally {
        setLoading(false);
    }
};

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4 font-sans relative overflow-hidden">
            {/* Top Indicator Line (Emerald for Success/Verification) */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-600"></div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-10 rounded-2xl w-full max-w-[420px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 z-10"
            >
                <button 
                    onClick={() => navigate("/register")}
                    className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors text-sm mb-8 font-medium"
                >
                    <ArrowLeft size={16} /> Back
                </button>

                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-emerald-100">
                        <ShieldCheck className="text-emerald-600" size={32} />
                    </div>
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Verify Email</h2>
                    <p className="text-slate-500 mt-3 text-sm leading-relaxed">
                        We've sent a 6-digit verification code to <br/>
                        <span className="text-slate-900 font-bold underline decoration-emerald-400 decoration-2 underline-offset-4">{email}</span>
                    </p>
                </div>

                <form onSubmit={handleVerify} className="space-y-8">
                    <div className="space-y-3">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-[2px] ml-1">
                            Verification Code
                        </label>
                        <input 
                            type="text" 
                            maxLength="6"
                            placeholder="000000" 
                            className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:ring-4 focus:ring-emerald-50/50 focus:border-emerald-500 text-center text-3xl tracking-[0.4em] font-bold transition-all placeholder:text-slate-200"
                            onChange={e => setOtp(e.target.value)} 
                            autoFocus
                            required
                        />
                    </div>

                    <button 
                        disabled={loading || otp.length < 6}
                        className="w-full bg-slate-900 hover:bg-black text-white py-4 rounded-xl font-bold shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:bg-slate-200 disabled:text-slate-400"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            <>Confirm Code <ChevronRight size={18} /></>
                        )}
                    </button>
                </form>

                <div className="mt-10 text-center">
                    <p className="text-slate-500 text-sm font-medium">
                        Didn't receive code? {' '}
                        <button className="text-emerald-600 font-bold hover:text-emerald-700 transition-all">Resend OTP</button>
                    </p>
                </div>
            </motion.div>

            {/* Subtle Tag */}
            <div className="absolute bottom-8 text-slate-300 text-[10px] font-bold tracking-[3px] uppercase">
                Skill2Hire Identity Service
            </div>
        </div>
    );
};

export default VerifyOTP;