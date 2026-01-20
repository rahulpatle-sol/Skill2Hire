import { useEffect, useState } from 'react';
import { api } from '../../auth/authServices';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { GitPullRequestArrow, UserPlus, Briefcase, ExternalLink, Loader2 } from 'lucide-react';

const BridgePanel = () => {
    const [team, setTeam] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTeam = async () => {
        try {
            setLoading(true);
            const res = await api.get('/manager/bridge'); // Manager controller API
            setTeam(res.data.data);
        } catch (err) {
            toast.error("Failed to sync team data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchTeam(); }, []);

    return (
        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
        >
            {/* Header Section */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-extrabold flex items-center gap-3 text-slate-900">
                        <div className="p-2 bg-indigo-100 rounded-lg">
                            <GitPullRequestArrow size={28} className="text-indigo-600" />
                        </div>
                        Operations Bridge
                    </h2>
                    <p className="text-slate-500 mt-1 ml-14">Monitor and manage your assigned talent pool</p>
                </div>
                <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={fetchTeam}
                    className="bg-white border border-slate-200 p-2 rounded-xl shadow-sm hover:bg-slate-50 transition-all"
                >
                    <Loader2 size={20} className={`text-slate-600 ${loading ? 'animate-spin' : ''}`} />
                </motion.button>
            </div>
            
            {/* Main Table Card */}
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <UserPlus size={20} className="text-indigo-500" /> Under Your Management
                    </h3>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        Total: {team.length} Members
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-slate-400 text-[11px] uppercase tracking-[0.15em] font-black">
                                <th className="p-6">Candidate / HR</th>
                                <th className="p-6">Role / Level</th>
                                <th className="p-6">Job Status</th>
                                <th className="p-6 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            <AnimatePresence>
                                {loading ? (
                                    // Simple Loading Row
                                    <tr>
                                        <td colSpan="4" className="p-20 text-center text-slate-400">
                                            <Loader2 className="animate-spin mx-auto mb-2" size={32} />
                                            Syncing with server...
                                        </td>
                                    </tr>
                                ) : team.map((member, index) => (
                                    <motion.tr 
                                        key={member.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="hover:bg-indigo-50/30 transition-all group"
                                    >
                                        <td className="p-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border-2 border-white shadow-sm">
                                                    {member.fullName[0]}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">
                                                        {member.fullName}
                                                    </div>
                                                    <div className="text-xs text-slate-400">{member.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                                member.role === 'ADMIN' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                                            }`}>
                                                {member.role}
                                            </span>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center gap-2 text-slate-500 text-sm">
                                                <Briefcase size={14} />
                                                <span className="italic font-medium">Not Assigned</span>
                                            </div>
                                        </td>
                                        <td className="p-6 text-right">
                                            <motion.button 
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 flex items-center gap-2 ml-auto"
                                            >
                                                Assign Task <ExternalLink size={14} />
                                            </motion.button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
};

export default BridgePanel;