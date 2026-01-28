import { useEffect, useState } from 'react';
import { api } from '../../auth/authServices';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { GitPullRequestArrow, Briefcase, ExternalLink, Loader2, Users } from 'lucide-react';

const BridgePanel = () => {
    const [team, setTeam] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTeam = async () => {
    try {
        const res = await api.get('/manager/bridge');
        // Backend se { assessments, profiles } aa raha hai
        setTeam(res.data.data.assessments); 
    } catch (err) {
        toast.error("Sync Failed!");
    }
};

    useEffect(() => { fetchTeam(); }, []);

    return (
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-900 rounded-2xl text-white shadow-xl shadow-slate-200">
                        <GitPullRequestArrow size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-slate-900 tracking-tight">Operations Bridge</h2>
                        <p className="text-xs text-slate-500 font-medium">Monitoring your assigned talent pool</p>
                    </div>
                </div>
                <button 
                    onClick={fetchTeam}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-all text-slate-600"
                >
                    <Loader2 size={18} className={loading ? 'animate-spin' : ''} />
                </button>
            </div>
            
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[2px]">Team Roster</h3>
                    <div className="flex items-center gap-2 text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                        <Users size={12} /> {team.length} Members
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-slate-400 text-[10px] uppercase tracking-widest font-black border-b border-slate-50">
                                <th className="p-6">Member</th>
                                <th className="p-6">System Role</th>
                                <th className="p-6">Assignment</th>
                                <th className="p-6 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan="4" className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-slate-200" size={32} /></td></tr>
                            ) : team.map((member, index) => (
                                <motion.tr 
                                    key={member.id}
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    className="hover:bg-slate-50/50 transition-all group"
                                >
                                    <td className="p-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center text-slate-500 font-bold">
                                                {member.fullName[0]}
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-800 text-sm">{member.fullName}</div>
                                                <div className="text-[11px] text-slate-400">{member.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border border-blue-100">
                                            {member.role}
                                        </span>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex items-center gap-2 text-slate-400 text-[11px] font-bold">
                                            <Briefcase size={12} /> <span className="uppercase">Idle</span>
                                        </div>
                                    </td>
                                    <td className="p-6 text-right">
                                        <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-[11px] font-black uppercase hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm flex items-center gap-2 ml-auto">
                                            Assign <ExternalLink size={12} />
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
};

export default BridgePanel;