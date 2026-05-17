import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { 
  ShieldAlert, 
  FileText, 
  Settings2, 
  Users2, 
  Terminal, 
  Activity, 
  Compass, 
  RefreshCw, 
  Lock, 
  Sliders, 
  Flame, 
  Award, 
  Database 
} from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const [syncing, setSyncing] = useState(false);
  const [unlocking, setUnlocking] = useState(false);

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      alert('Entra ID organization hierarchy synchronized successfully.');
    }, 1500);
  };

  const handleUnlock = () => {
    setUnlocking(true);
    setTimeout(() => {
      setUnlocking(false);
      alert('All Direct Reports active sheets unlocked for edits.');
    }, 1500);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-slide-up font-sans">
      {/* Header container */}
      <header className="flex flex-col md:flex-row md:justify-between items-start md:items-center bg-white p-6 rounded-3xl shadow-sm border border-slate-100 gap-4">
        <div>
          <span className="text-[10px] bg-rose-50 text-rose-700 font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg">Root Administrator</span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-2.5">
            System Control <span className="bg-gradient-to-r from-rose-600 to-amber-600 bg-clip-text text-transparent">Center</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">Global monitoring, Entra ID coordination, security rules, and user-level overrides.</p>
        </div>
        <div className="flex gap-3">
          <button className="cursor-pointer bg-slate-900 hover:bg-slate-800 text-white font-semibold px-5.5 py-3 rounded-2xl shadow-md hover:shadow-lg transition duration-200 flex items-center gap-2 text-sm">
            <Settings2 size={16} />
            <span>Global Preferences</span>
          </button>
        </div>
      </header>

      {/* Grid of Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4.5 premium-shadow-hover">
          <div className="p-3.5 bg-rose-50 text-rose-600 rounded-2xl"><Users2 size={24} /></div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Users</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">124 <span className="text-xs font-semibold text-slate-400">Active</span></h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4.5 premium-shadow-hover">
          <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-2xl"><Activity size={24} /></div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Current Cycle</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">Q2 - '26</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4.5 premium-shadow-hover">
          <div className="p-3.5 bg-amber-50 text-amber-600 rounded-2xl"><ShieldAlert size={24} /></div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Security Flags</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">3 <span className="text-xs font-semibold text-rose-500">Alerts</span></h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4.5 premium-shadow-hover">
          <div className="p-3.5 bg-blue-50 text-blue-600 rounded-2xl"><Database size={24} /></div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Server Health</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">99.98%</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Dynamic System Logs */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="p-2 bg-slate-900 text-white rounded-xl"><Terminal size={18} /></div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Recent Orchestration Logs</h2>
              <p className="text-xs text-slate-400">Real-time action audit trail for global objectives updates</p>
            </div>
          </div>

          <div className="space-y-3.5">
            {[
              { title: 'Goal Blueprint Unlocked', desc: 'Overrode locked sheet status for direct report shubh@company.com', time: '12m ago', type: 'warn' },
              { title: 'Entra ID Organizational Sync', desc: 'Sync complete: 14 new employees registered under Manager index', time: '2h ago', type: 'info' },
              { title: 'Security Threshold Met', desc: 'Employee goal sheet validated against 100% total weight bounds', time: '4h ago', type: 'success' }
            ].map((log, i) => (
              <div key={i} className="flex justify-between items-start p-4 bg-slate-50 hover:bg-slate-100/50 rounded-2xl transition border border-slate-100/50 gap-4">
                <div className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                    log.type === 'warn' ? 'bg-amber-500' :
                    log.type === 'info' ? 'bg-blue-500' : 'bg-emerald-500'
                  }`} />
                  <div>
                    <p className="text-sm font-bold text-slate-900 leading-tight">{log.title}</p>
                    <p className="text-xs text-slate-500 mt-1 leading-snug">{log.desc}</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-slate-400 shrink-0 uppercase tracking-wider">{log.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Global Administrative Quick Actions */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-6">
              <div className="p-2 bg-rose-50 text-rose-600 rounded-xl"><Sliders size={18} /></div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">System Overrides</h2>
                <p className="text-xs text-slate-400">Trigger manual overrides and organizational database synchronization</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={handleUnlock}
                disabled={unlocking}
                className="cursor-pointer p-5 border border-slate-150 rounded-2xl hover:border-emerald-500 hover:bg-emerald-50/50 text-left transition group duration-200 relative overflow-hidden"
              >
                <div className="flex justify-between items-center mb-3 text-slate-700 group-hover:text-emerald-600 transition duration-150">
                  <Lock size={20} className="stroke-[1.8]" />
                  {unlocking && <RefreshCw size={14} className="animate-spin text-emerald-500" />}
                </div>
                <h4 className="font-bold text-slate-900 group-hover:text-emerald-700 text-sm transition">Unlock Sheets</h4>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">Instantly unlock restricted operational sheets for modification updates.</p>
              </button>

              <button
                onClick={handleSync}
                disabled={syncing}
                className="cursor-pointer p-5 border border-slate-150 rounded-2xl hover:border-blue-500 hover:bg-blue-50/50 text-left transition group duration-200 relative overflow-hidden"
              >
                <div className="flex justify-between items-center mb-3 text-slate-700 group-hover:text-blue-600 transition duration-150">
                  <RefreshCw size={20} className={`stroke-[1.8] ${syncing ? 'animate-spin text-blue-500' : ''}`} />
                </div>
                <h4 className="font-bold text-slate-900 group-hover:text-blue-700 text-sm transition">Force Sync</h4>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">Pull current user structures dynamically from active Microsoft Entra Directory.</p>
              </button>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4.5 text-xs text-slate-500 mt-6 leading-relaxed flex items-start gap-2.5">
            <ShieldAlert size={16} className="text-rose-500 shrink-0 mt-0.5" />
            <span>
              <strong>Operational Warning:</strong> Administrative overrides bypass configured team approval flows and are logged for governance audit tracking.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
