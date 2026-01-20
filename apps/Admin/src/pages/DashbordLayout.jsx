import { Link, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, ShieldCheck, UserCog, LogOut, Briefcase } from 'lucide-react';

const DashbordLayout = () => {
  const navigate = useNavigate();
  // Abhi ke liye localStorage se role uthate hain (Ya useAuth hook se)
  const user = JSON.parse(localStorage.getItem("user") || '{"role":"ADMIN"}'); 

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shadow-xl">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Briefcase className="text-blue-500" /> sKILL2HIRE
          </h1>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-semibold">Console</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {user.role === "ADMIN" && (
            <>
              <p className="text-xs text-slate-500 px-3 py-2 uppercase">Admin Menu</p>
              <Link to="/admin/users" className="flex items-center gap-3 p-3 hover:bg-slate-800 hover:text-white rounded-xl transition-all">
                <Users size={18} /> User Management
              </Link>
              <Link to="/admin/managers" className="flex items-center gap-3 p-3 hover:bg-slate-800 hover:text-white rounded-xl transition-all">
                <UserCog size={18} /> Manager Control
              </Link>
            </>
          )}

          {user.role === "MANAGER" && (
            <>
              <p className="text-xs text-slate-500 px-3 py-2 uppercase">Management</p>
              <Link to="/manager/bridge" className="flex items-center gap-3 p-3 hover:bg-slate-800 hover:text-white rounded-xl transition-all">
                <LayoutDashboard size={18} /> Bridge Panel
              </Link>
              <Link to="/manager/verify" className="flex items-center gap-3 p-3 hover:bg-slate-800 hover:text-white rounded-xl transition-all">
                <ShieldCheck size={18} /> Verification Hub
              </Link>
            </>
          )}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="flex items-center gap-3 p-3 w-full text-red-400 hover:bg-red-500/10 rounded-xl transition-all">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b flex items-center justify-between px-8 shadow-sm">
          <h2 className="font-semibold text-slate-700">Welcome Back, {user.role}</h2>
          <div className="w-10 h-10 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-600 font-bold">
            {user.role[0]}
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashbordLayout;