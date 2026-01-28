import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, ShieldCheck, UserCog, LogOut, Briefcase, ChevronRight } from 'lucide-react';

const DashbordLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Auth Logic: LocalStorage se role check
  const user = JSON.parse(localStorage.getItem("user") || '{"role":"ADMIN", "fullName": "Admin User"}'); 

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Active Link check karne ke liye helper
  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans overflow-hidden">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-72 bg-slate-900 flex flex-col shadow-2xl z-20">
        {/* Logo Section */}
        <div className="p-8">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/50">
                    <Briefcase className="text-white" size={22} />
                </div>
                <div>
                    <h1 className="text-lg font-black text-white tracking-tighter uppercase">sKILL2HIRE</h1>
                    <div className="h-1 w-full bg-blue-600 rounded-full mt-1 opacity-50"></div>
                </div>
            </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1 mt-4">
          {user.role === "ADMIN" && (
            <>
              <div className="text-[10px] font-black text-slate-500 px-4 py-4 uppercase tracking-[2px]">Systems Control</div>
              <SidebarLink to="/admin/users" icon={Users} label="User Management" active={isActive('/admin/users')} />
              <SidebarLink to="/admin/managers" icon={UserCog} label="Manager Control" active={isActive('/admin/managers')} />
            </>
          )}

          {user.role === "MANAGER" && (
            <>
              <div className="text-[10px] font-black text-slate-500 px-4 py-4 uppercase tracking-[2px]">Operations</div>
              <SidebarLink to="/manager/bridge" icon={LayoutDashboard} label="Bridge Panel" active={isActive('/manager/bridge')} />
              <SidebarLink to="/manager/verify" icon={ShieldCheck} label="Verification Hub" active={isActive('/manager/verify')} />
            </>
          )}
        </nav>

        {/* User Profile & Logout */}
        <div className="p-4 bg-slate-950/50 border-t border-slate-800">
            <div className="flex items-center gap-3 px-4 py-4 mb-2">
                <div className="w-9 h-9 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold">
                    {user.fullName[0]}
                </div>
                <div className="overflow-hidden">
                    <p className="text-sm font-bold text-white truncate">{user.fullName}</p>
                    <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">{user.role}</p>
                </div>
            </div>
            <button 
                onClick={handleLogout} 
                className="flex items-center justify-between w-full p-3.5 text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all group"
            >
                <div className="flex items-center gap-3 font-bold text-xs uppercase tracking-wider">
                    <LogOut size={18} /> Logout
                </div>
                <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-all" />
            </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-10">
          <div>
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Active Workspace</h2>
            <p className="text-lg font-black text-slate-800">
                {location.pathname.split('/').pop().replace('-', ' ')}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
              <div className="h-10 w-[1px] bg-slate-100"></div>
              <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                  <div className={`w-2 h-2 rounded-full animate-pulse ${user.role === 'ADMIN' ? 'bg-purple-500' : 'bg-blue-500'}`}></div>
                  <span className="text-[11px] font-black text-slate-600 uppercase tracking-wider italic">System Live</span>
              </div>
          </div>
        </header>
        
        {/* Dynamic Page Content */}
        <div className="flex-1 overflow-y-auto p-10">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

// Helper Component for Sidebar Links
const SidebarLink = ({ to, icon: Icon, label, active }) => (
  <Link 
    to={to} 
    className={`flex items-center justify-between p-3.5 rounded-xl transition-all group ${
      active 
      ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
      : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
    }`}
  >
    <div className="flex items-center gap-3 font-bold text-[13px]">
        <Icon size={20} className={active ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'} />
        {label}
    </div>
    {active && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
  </Link>
);

export default DashbordLayout;