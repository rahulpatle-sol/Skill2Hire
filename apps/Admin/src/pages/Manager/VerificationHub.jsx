import { useEffect, useState } from 'react';
import { api } from '../../auth/authServices';
import { motion, AnimatePresence } from 'framer-motion'; // For animations
import { toast } from 'react-toastify'; // For professional alerts
import { ShieldAlert, CheckCircle, Loader2, UserX } from 'lucide-react';

const VerificationHub = () => {
    const [pendingUsers, setPendingUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPending = async () => {
        try {
            setLoading(true);
            const res = await api.get('/manager/bridge'); // Manager controller call
            // Sirf unverified talent ko filter karo
            setPendingUsers(res.data.data.filter(u => !u.isVerified));
        } catch (err) {
            toast.error("Failed to load pending talent");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchPending(); }, []);

    const handleVerify = async (id) => {
        try {
            await api.post('/manager/verify-talent', { talentId: id }); // Verify logic
            toast.success("Talent Verified Successfully! 🎉");
            
            // UI se remove karne ke liye filter (Fast feedback)
            setPendingUsers(prev => prev.filter(user => user.id !== id));
        } catch (err) {
            toast.error("Verification failed. Please try again.");
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <ShieldAlert className="text-amber-500" /> Verification Hub
                </h2>
                <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold">
                    {pendingUsers.length} Pending
                </span>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                        <tr>
                            <th className="p-4">Candidate Details</th>
                            <th className="p-4">Requested Role</th>
                            <th className="p-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        <AnimatePresence mode='popLayout'>
                            {pendingUsers.length > 0 ? (
                                pendingUsers.map((u) => (
                                    <motion.tr 
                                        key={u.id}
                                        layout
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 50, backgroundColor: "rgba(16, 185, 129, 0.1)" }}
                                        transition={{ duration: 0.3 }}
                                        className="hover:bg-slate-50/50 transition-colors"
                                    >
                                        <td className="p-4">
                                            <div className="font-semibold text-slate-700">{u.fullName}</div>
                                            <div className="text-xs text-slate-400">{u.email}</div>
                                        </td>
                                        <td className="p-4 text-sm font-medium text-slate-500">
                                            <span className="bg-slate-100 px-2 py-1 rounded-md">{u.role}</span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <motion.button 
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleVerify(u.id)}
                                                className="bg-emerald-600 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all flex items-center gap-2 ml-auto"
                                            >
                                                <CheckCircle size={16} /> Approve
                                            </motion.button>
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <motion.tr initial={{ opacity: 0 }}>
                                    <td colSpan="3" className="p-20 text-center">
                                        {loading ? (
                                            <Loader2 className="animate-spin mx-auto text-slate-300" size={40} />
                                        ) : (
                                            <div className="flex flex-col items-center gap-2 text-slate-400">
                                                <UserX size={48} strokeWidth={1} />
                                                <p className="text-lg">No pending verifications</p>
                                            </div>
                                        )}
                                    </td>
                                </motion.tr>
                            )}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

export default VerificationHub;