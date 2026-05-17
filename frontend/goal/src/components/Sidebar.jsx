import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Briefcase, Users, Shield, LogOut, User as UserIcon } from 'lucide-react';

export default function Sidebar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-64 bg-slate-950 text-slate-200 flex flex-col h-screen fixed top-0 left-0 border-r border-slate-900 shadow-2xl z-30 font-sans">
      <div className="p-6 border-b border-slate-900/60 flex items-center justify-center">
        <div>
          <span className="font-heading text-lg font-black tracking-tight text-white block">
            CompleteIt
          </span>
        </div>
      </div>

      {/* Navigation Space */}
      <nav className="flex-1 p-4 space-y-1.5">
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-2 block">Navigation</div>
        
        {user?.role === 'Employee' && (
          <Link
            to="/employee"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition duration-200 font-medium text-sm group ${
              isActive('/employee')
                ? 'bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 text-emerald-400 border-l-4 border-emerald-500 pl-3'
                : 'hover:bg-slate-900/50 hover:text-white'
            }`}
          >
            <Briefcase size={18} className={isActive('/employee') ? 'text-emerald-400' : 'text-slate-500 group-hover:text-slate-300'} />
            <span>My Workspace</span>
          </Link>
        )}

        {user?.role === 'Manager' && (
          <Link
            to="/manager"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition duration-200 font-medium text-sm group ${
              isActive('/manager')
                ? 'bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 text-emerald-400 border-l-4 border-emerald-500 pl-3'
                : 'hover:bg-slate-900/50 hover:text-white'
            }`}
          >
            <Users size={18} className={isActive('/manager') ? 'text-emerald-400' : 'text-slate-500 group-hover:text-slate-300'} />
            <span>Team Matrix</span>
          </Link>
        )}

        {user?.role === 'Admin' && (
          <Link
            to="/admin"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition duration-200 font-medium text-sm group ${
              isActive('/admin')
                ? 'bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 text-emerald-400 border-l-4 border-emerald-500 pl-3'
                : 'hover:bg-slate-900/50 hover:text-white'
            }`}
          >
            <Shield size={18} className={isActive('/admin') ? 'text-emerald-400' : 'text-slate-500 group-hover:text-slate-300'} />
            <span>Control Center</span>
          </Link>
        )}
      </nav>

      {/* User Section at Bottom */}
      <div className="p-4 border-t border-slate-900/80 bg-slate-950/40">
        <div className="flex items-center gap-3 p-2 bg-slate-900/40 border border-slate-900 rounded-xl mb-3">
          <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-sm text-emerald-400 shrink-0">
            {user?.name ? user.name.charAt(0) : 'U'}
          </div>
          <div className="min-w-0">
            <span className="font-semibold text-xs text-white block truncate">{user?.name}</span>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold block">{user?.role}</span>
          </div>
        </div>
        <button
          onClick={() => { logout(); navigate('/login'); }}
          className="w-full relative group bg-slate-900 hover:bg-rose-500/10 border border-slate-800 hover:border-rose-500/30 text-slate-400 hover:text-rose-400 py-2.5 rounded-xl text-xs font-semibold transition duration-200 flex items-center justify-center gap-2 cursor-pointer"
        >
          <LogOut size={14} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}