import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../auth/authServices';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { User, Mail, Lock, Camera, Loader2, UserPlus, Briefcase, ChevronDown } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({ fullName: '', email: '', password: '', role: 'MANAGER' });
    const [profilePic, setProfilePic] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreview(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        if (profilePic) data.append('profilePic', profilePic);

        try {
            await registerUser(data);
            toast.success("OTP sent to your email! 📧");
            navigate("/verify-otp", { state: { email: formData.email } });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4 font-sans">
            {/* Minimal Clean Background */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-10 rounded-2xl w-full max-w-[450px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100"
            >
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                        Create Account
                    </h2>
                    <p className="text-slate-500 mt-2 font-medium">Join the Skill2Hire network</p>
                </div>

                <form onSubmit={onSubmit} className="space-y-6">
                    {/* Professional Avatar Upload */}
                    <div className="flex justify-center mb-8">
                        <div className="relative group">
                            <div className="w-24 h-24 rounded-full bg-slate-50 border-2 border-slate-200 flex items-center justify-center overflow-hidden transition-all group-hover:border-blue-400">
                                {preview ? (
                                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <Camera className="text-slate-400" size={28} />
                                )}
                            </div>
                            <input 
                                type="file" 
                                className="absolute inset-0 opacity-0 cursor-pointer" 
                                onChange={handleImageChange}
                                accept="image/*"
                            />
                            <div className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full border-4 border-white shadow-sm">
                                <UserPlus size={12} className="text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {/* Input Field Helper */}
                        {[
                            { icon: User, type: 'text', name: 'fullName', placeholder: 'Full Name' },
                            { icon: Mail, type: 'email', name: 'email', placeholder: 'Email Address' },
                            { icon: Lock, type: 'password', name: 'password', placeholder: 'Password' }
                        ].map((field, idx) => (
                            <div key={idx} className="relative group">
                                <field.icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={19} />
                                <input 
                                    type={field.type} 
                                    placeholder={field.placeholder}
                                    required
                                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                                    onChange={e => setFormData({...formData, [field.name]: e.target.value})}
                                />
                            </div>
                        ))}

                        {/* Role Selector */}
                        <div className="relative group">
                            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={19} />
                            <select 
                                className="w-full pl-12 pr-10 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 outline-none focus:border-blue-500 appearance-none transition-all cursor-pointer"
                                onChange={e => setFormData({...formData, role: e.target.value})}
                            >
                                <option value="MANAGER">Joining as Manager</option>
                                <option value="ADMIN">Joining as Admin</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                        </div>
                    </div>

                    <button 
                        disabled={loading}
                        className="w-full bg-slate-900 hover:bg-black text-white py-4 rounded-xl font-semibold shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-6 disabled:bg-slate-400"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : "Get Started"}
                    </button>
                </form>

                <p className="text-center text-slate-600 text-sm mt-8 font-medium">
                    Already have an account? <Link to="/login" className="text-blue-600 hover:font-bold transition-all">Sign In</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Register;