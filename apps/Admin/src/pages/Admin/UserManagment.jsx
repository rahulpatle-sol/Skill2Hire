import { useEffect, useState } from 'react';
import { getAllUsers, deleteUser } from '../../auth/authServices';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, RefreshCw, UserCheck } from 'lucide-react';

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
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100"
        >
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Platform Users</h2>
                <button onClick={loadData} className="p-2 hover:rotate-180 transition-all duration-500">
                    <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                        <tr>
                            <th className="p-4 font-semibold">Name & Email</th>
                            <th className="p-4 font-semibold">Role</th>
                            <th className="p-4 font-semibold">Status</th>
                            <th className="p-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        <AnimatePresence>
                            {users.map((user) => (
                                <motion.tr 
                                    key={user.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="hover:bg-slate-50/50 transition-colors"
                                >
                                    <td className="p-4">
                                        <div className="font-medium text-slate-700">{user.fullName}</div>
                                        <div className="text-xs text-slate-400">{user.email}</div>
                                    </td>
                                    <td className="p-4">
                                        <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600">
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className={`flex items-center gap-1 text-sm ${user.isVerified ? "text-emerald-500" : "text-rose-500"}`}>
                                            <UserCheck size={14} /> {user.isVerified ? "Verified" : "Pending"}
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button 
                                            onClick={() => deleteUser(user.id).then(loadData)}
                                            className="p-2 text-rose-400 hover:bg-rose-50 rounded-lg transition-colors"
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