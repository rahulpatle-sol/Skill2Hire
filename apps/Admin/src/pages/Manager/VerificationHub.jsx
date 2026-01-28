import { useEffect, useState } from 'react';
import { api } from '../../auth/authServices';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { ShieldCheck, CheckCircle, Loader2, UserX, Mail, Clock } from 'lucide-react';

const VerificationHub = () => {
    const [pendingUsers, setPendingUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPending = async () => {
        try {
            setLoading(true);
            const res = await api.get('/manager/pending-reviews');
// Kyunki backend { assessments, profiles } bhej raha hai
setPendingUsers(res.data.data.profiles);
        } catch (err) {
            toast.error("Sync failed");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchPending(); }, []);

 const handleVerify = async (id) => {
    try {
        // Talent ID URL mein jayegi aur baki data body mein
        await api.patch(`/manager/verify-talent/${id}`, { 
            isApproved: true, 
            makePublic: true,
            score: 85,
            feedback: "Excellent skills!" 
        });
        toast.success("Talent Verified & Activated!");
        fetchPending(); // List refresh karo
    } catch (err) {
        toast.error("Approval Error!");
    }
};

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div>
                    <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                        <ShieldCheck className="text-emerald-500" size={24} /> Verification Hub
                    </h2>
                    <p className="text-xs text-slate-500 font-medium mt-1">Review and approve pending talent requests</p>
                </div>
                <div className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold border border-emerald-100">
                    {pendingUsers.length} Pending Requests
                </div>
            </div>
            
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-[2px] font-black">
                            <th className="p-5">Candidate</th>
                            <th className="p-5">Role</th>
                            <th className="p-5 text-right">Decision</th>
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
                                        exit={{ opacity: 0, scale: 0.95, backgroundColor: "#f0fdf4" }}
                                        className="hover:bg-slate-50/30 transition-colors"
                                    >
                                        <td className="p-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold border border-slate-200">
                                                    {u.fullName[0]}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-800 text-sm">{u.fullName}</div>
                                                    <div className="flex items-center gap-1 text-[11px] text-slate-400">
                                                        <Mail size={10} /> {u.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-[10px] font-black tracking-wider uppercase border border-slate-200">
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="p-5 text-right">
                                            <button 
                                                onClick={() => handleVerify(u.id)}
                                                className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-slate-200 flex items-center gap-2 ml-auto"
                                            >
                                                <CheckCircle size={14} /> Approve Talent
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="p-24 text-center">
                                        {loading ? (
                                            <Loader2 className="animate-spin mx-auto text-indigo-500" size={32} />
                                        ) : (
                                            <div className="flex flex-col items-center gap-3 text-slate-300">
                                                <UserX size={48} strokeWidth={1.5} />
                                                <p className="text-sm font-bold tracking-tight text-slate-400">All clear! No pending talent.</p>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            )}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

export default VerificationHub;