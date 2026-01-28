import { useEffect, useState } from 'react';
import { api } from '../../auth/authServices';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCog, UserMinus, Mail, ShieldAlert } from 'lucide-react';

const ManagerControl = () => {
    const [managers, setManagers] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchManagers = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/users');
            setManagers(res.data.data.filter(user => user.role === 'MANAGER'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchManagers(); }, []);

    const removeManager = async (id) => {
        if(window.confirm("Are you sure you want to remove this manager?")) {
            await api.delete(`/admin/user/${id}`);
            fetchManagers();
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm"
        >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                        <UserCog size={22} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Manager Control</h2>
                        <p className="text-sm text-slate-500">Promote, monitor or remove managers</p>
                    </div>
                </div>
                <div className="px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold">
                    {managers.length} Active Managers
                </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <AnimatePresence>
                    {managers.map(m => (
                        <motion.div 
                            key={m.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="group p-4 rounded-xl border border-slate-100 bg-slate-50/30 hover:bg-white hover:border-indigo-200 hover:shadow-md transition-all flex justify-between items-center"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-xl border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-indigo-500 transition-colors">
                                    <ShieldAlert size={24} />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-800 text-sm">{m.fullName}</p>
                                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                        <Mail size={12} /> {m.email}
                                    </div>
                                </div>
                            </div>
                            <button 
                                onClick={() => removeManager(m.id)} 
                                className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                            >
                                <UserMinus size={20} />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default ManagerControl;