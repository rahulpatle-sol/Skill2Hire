import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../auth/authServices';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { User, Mail, Lock, Camera, Loader2, UserPlus, Briefcase } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({ fullName: '', email: '', password: '', role: 'TALENT' });
    const [avatar, setAvatar] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Image Preview Logic
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatar(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        const data = new FormData();
        data.append('fullName', formData.fullName);
        data.append('email', formData.email);
        data.append('password', formData.password);
        data.append('role', formData.role);
        if (avatar) data.append('avatar', avatar);

        try {
            await registerUser(data);
            toast.success("OTP sent to your email! 📧");
            navigate("/verify-otp", { state: { email: formData.email } });
        } catch (err) {
            // Error handling already in interceptor
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4 relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]"></div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-slate-800/40 backdrop-blur-xl p-8 rounded-3xl w-full max-w-[500px] border border-slate-700/50 shadow-2xl z-10"
            >
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                        Create Account
                    </h2>
                    <p className="text-slate-400 text-sm mt-2">Join the sKILL2HIRE network</p>
                </div>

                <form onSubmit={onSubmit} className="space-y-5">
                    {/* Avatar Upload */}
                    <div className="flex justify-center mb-6">
                        <div className="relative group">
                            <motion.div 
                                whileHover={{ scale: 1.05 }}
                                className="w-24 h-24 rounded-2xl bg-slate-900 border-2 border-dashed border-slate-600 flex items-center justify-center overflow-hidden transition-all group-hover:border-blue-500"
                            >
                                {preview ? (
                                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <Camera className="text-slate-500 group-hover:text-blue-400" size={32} />
                                )}
                            </motion.div>
                            <input 
                                type="file" 
                                className="absolute inset-0 opacity-0 cursor-pointer" 
                                onChange={handleImageChange}
                                accept="image/*"
                            />
                            <div className="absolute -bottom-2 -right-2 bg-blue-600 p-1.5 rounded-lg shadow-lg">
                                <UserPlus size={14} className="text-white" />
                            </div>
                        </div>
                    </div>

                    {/* Inputs */}
                    <div className="grid grid-cols-1 gap-4">
                        <div className="relative group">
                            <User className="absolute left-3 top-3.5 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                            <input 
                                type="text" placeholder="Full Name" required
                                className="w-full pl-10 p-3 rounded-xl bg-slate-900/50 border border-slate-700 outline-none focus:border-blue-500 transition-all"
                                onChange={e => setFormData({...formData, fullName: e.target.value})}
                            />
                        </div>

                        <div className="relative group">
                            <Mail className="absolute left-3 top-3.5 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                            <input 
                                type="email" placeholder="Email Address" required
                                className="w-full pl-10 p-3 rounded-xl bg-slate-900/50 border border-slate-700 outline-none focus:border-blue-500 transition-all"
                                onChange={e => setFormData({...formData, email: e.target.value})}
                            />
                        </div>

                        <div className="relative group">
                            <Lock className="absolute left-3 top-3.5 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                            <input 
                                type="password" placeholder="Password" required
                                className="w-full pl-10 p-3 rounded-xl bg-slate-900/50 border border-slate-700 outline-none focus:border-blue-500 transition-all"
                                onChange={e => setFormData({...formData, password: e.target.value})}
                            />
                        </div>

                        <div className="relative group">
                            <Briefcase className="absolute left-3 top-3.5 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                            <select 
                                className="w-full pl-10 p-3 rounded-xl bg-slate-900/50 border border-slate-700 outline-none focus:border-blue-500 transition-all appearance-none text-slate-300"
                                onChange={e => setFormData({...formData, role: e.target.value})}
                            >
                               
                                <option value="MANAGER">Joining as Manager</option>
                                <option value="ADMIN">Joining as Admin</option>
                            </select>
                        </div>
                    </div>

                    <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 rounded-xl font-bold text-white shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 transition-all mt-4"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : "Create Account"}
                    </motion.button>
                </form>

                <p className="text-center text-slate-500 text-sm mt-6">
                    Already have an account? <Link to="/login" className="text-blue-400 hover:underline">Sign In</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Register;