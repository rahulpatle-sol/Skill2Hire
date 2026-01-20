import { useEffect, useState } from 'react';
import { api } from '../../auth/authServices';
import { UserCog, UserMinus } from 'lucide-react';

const ManagerControl = () => {
    const [managers, setManagers] = useState([]);

    const fetchManagers = async () => {
        const res = await api.get('/admin/users');
        // Filter only Managers from all users
        setManagers(res.data.data.filter(user => user.role === 'MANAGER'));
    };

    useEffect(() => { fetchManagers(); }, []);

    const removeManager = async (id) => {
        if(window.confirm("Manager ko delete karna hai?")) {
            await api.delete(`/admin/user/${id}`); // Teri deleteUser API
            fetchManagers();
        }
    };

    return (
        <div className="p-6 bg-white rounded-xl shadow-md">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <UserCog className="text-blue-600" /> Manager Management
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {managers.map(m => (
                    <div key={m.id} className="border p-4 rounded-lg flex justify-between items-center">
                        <div>
                            <p className="font-semibold">{m.fullName}</p>
                            <p className="text-sm text-gray-500">{m.email}</p>
                        </div>
                        <button onClick={() => removeManager(m.id)} className="text-red-500 hover:bg-red-50 p-2 rounded">
                            <UserMinus size={20} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManagerControl;