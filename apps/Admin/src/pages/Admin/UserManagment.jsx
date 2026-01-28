import { useEffect, useState } from 'react';
import { getAllUsers, deleteUser } from '../../auth/authServices';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, RefreshCw, UserCheck, Shield, User } from 'lucide-react';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await getAllUsers();
            setUsers(data.data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm"
        >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">Platform Users</h2>
                    <p className="text-sm text-slate-500">Manage all registered accounts and roles</p>
                </div>
                <button 
                    onClick={loadData} 
                    className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl transition-all"
                >
                    <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50 text-slate-500 text-[11px] uppercase tracking-[1px] font-bold">
                            <th className="p-5">User Details</th>
                            <th className="p-5">System Role</th>
                            <th className="p-5">Status</th>
                            <th className="p-5 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        <AnimatePresence>
                            {users.map((user) => (
                                <motion.tr 
                                    key={user.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="hover:bg-slate-50/30 transition-colors"
                                >
                                    <td className="p-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                                                <User size={18} />
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-800 text-sm">{user.fullName}</div>
                                                <div className="text-xs text-slate-400 font-medium">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black tracking-wide uppercase ${
                                            user.role === 'ADMIN' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'
                                        }`}>
                                            <Shield size={12} /> {user.role}
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <div className={`flex items-center gap-1.5 text-xs font-bold ${user.isVerified ? "text-emerald-500" : "text-amber-500"}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${user.isVerified ? "bg-emerald-500" : "bg-amber-500"}`}></div>
                                            {user.isVerified ? "Verified" : "Pending"}
                                        </div>
                                    </td>
                                    <td className="p-5 text-right">
                                        <button 
                                            onClick={() => deleteUser(user.id).then(loadData)}
                                            className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

export default UserManagement;