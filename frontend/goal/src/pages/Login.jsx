import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, AlertCircle, ArrowRight, Shield } from 'lucide-react';

export default function Login() {
  const { login, syncEntra } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showEntraModal, setShowEntraModal] = useState(false);
  const [entraLoading, setEntraLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication lifecycle handshake failure');
    } finally {
      setLoading(false);
    }
  };

  const handleEntraSSO = async (profile) => {
    setEntraLoading(true);
    setError('');
    try {
      await syncEntra({
        entraId: profile.entraId,
        name: profile.name,
        email: profile.email,
        department: profile.department,
        upnManagerEmail: profile.upnManagerEmail,
        groups: profile.groups
      });
      setShowEntraModal(false);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Entra ID SSO handshake failure.');
    } finally {
      setEntraLoading(false);
    }
  };

  const entraProfiles = [
    {
      entraId: 'entra-user-001',
      name: 'Jane Vance (Employee)',
      email: 'jane.vance@company.com',
      department: 'Engineering',
      upnManagerEmail: 'manager@company.com',
      groups: ['Entra_Employees'],
      desc: 'Role: Employee (Mapped from Group: Entra_Employees)'
    },
    {
      entraId: 'entra-user-002',
      name: 'Marcus Sterling (Manager)',
      email: 'marcus.sterling@company.com',
      department: 'Engineering',
      upnManagerEmail: 'admin@company.com',
      groups: ['Entra_Managers', 'Entra_Employees'],
      desc: 'Role: Manager (Mapped from Group: Entra_Managers)'
    },
    {
      entraId: 'entra-user-003',
      name: 'Claire Redfield (HR Admin)',
      email: 'claire.redfield@company.com',
      department: 'HR',
      upnManagerEmail: null,
      groups: ['Entra_Admins', 'Entra_Employees'],
      desc: 'Role: Admin (Mapped from Group: Entra_Admins)'
    }
  ];

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-slate-950 overflow-hidden px-4 font-sans">
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none animate-pulse duration-[6000ms]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none animate-pulse duration-[8000ms]" />

      <div className="max-w-md w-full relative z-10 animate-slide-up">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-3xl font-black text-white tracking-tight font-heading">
            CompleteIt
          </h1>
        </div>

        <div className="glass-card-dark rounded-3xl p-8 shadow-2xl relative overflow-hidden border border-slate-800 bg-slate-900/40 backdrop-blur-md">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white tracking-tight">Welcome Back</h2>
            <p className="text-sm text-slate-400 mt-1">Authenticate to synchronize your quarterly performance objectives.</p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-300 text-xs flex items-start gap-2.5 animate-in fade-in duration-300">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Corporate Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-slate-900/50 border border-slate-800 text-white placeholder-slate-500 pl-10 pr-4 py-3 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition duration-200"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">Access Password</label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-900/50 border border-slate-800 text-white placeholder-slate-500 pl-10 pr-4 py-3 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition duration-200"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full relative group bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-500/10 transition duration-300 cursor-pointer overflow-hidden flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-4">
            <button
              onClick={() => setShowEntraModal(true)}
              className="w-full bg-slate-800 hover:bg-slate-750 text-white font-bold py-3 px-4 rounded-xl border border-slate-700 transition duration-200 flex items-center justify-center gap-2.5 text-xs shadow-sm cursor-pointer"
            >
              <Shield size={16} className="text-blue-400" />
              <span>Sign in with Microsoft Entra ID</span>
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-900 text-center">
            <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500 block mb-2">Quick Reference Sign-in Accounts</span>
            <div className="grid grid-cols-3 gap-2 text-[10px] text-slate-400">
              <button 
                onClick={() => { setEmail('emp@company.com'); setPassword('password123'); }}
                className="cursor-pointer bg-slate-900/50 hover:bg-slate-900 p-2 rounded-lg border border-slate-900 text-left"
              >
                <span className="font-semibold text-slate-300 block">Employee</span>
                emp@company.com
              </button>
              <button 
                onClick={() => { setEmail('manager@company.com'); setPassword('password123'); }}
                className="cursor-pointer bg-slate-900/50 hover:bg-slate-900 p-2 rounded-lg border border-slate-900 text-left"
              >
                <span className="font-semibold text-slate-300 block">Manager</span>
                manager@company.com
              </button>
              <button 
                onClick={() => { setEmail('admin@company.com'); setPassword('password123'); }}
                className="cursor-pointer bg-slate-900/50 hover:bg-slate-900 p-2 rounded-lg border border-slate-900 text-left"
              >
                <span className="font-semibold text-slate-300 block">Administrator</span>
                admin@company.com
              </button>
            </div>
            <span className="text-[9px] text-slate-500 mt-2.5 block italic">All accounts password: password123</span>
          </div>
        </div>
      </div>

      {showEntraModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center px-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl relative">
            
            <div className="bg-blue-600 p-4.5 text-white flex items-center gap-3">
              <Shield size={20} className="fill-white/20 text-white" />
              <div>
                <h3 className="font-bold text-sm">Microsoft Entra ID</h3>
                <p className="text-[10px] text-blue-100 font-sans">Simulating Single Sign-On (SSO) OAuth Consent</p>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-xs text-slate-300 leading-relaxed">
                CompleteIt is requesting permission to authenticate you and sync your corporate reporting lines and security group assignments.
              </p>

              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Select Synced Identity Profile:</span>
                
                {entraProfiles.map((profile, i) => (
                  <button
                    key={i}
                    disabled={entraLoading}
                    onClick={() => handleEntraSSO(profile)}
                    className="cursor-pointer w-full p-4 bg-slate-955 hover:bg-slate-800 border border-slate-800 hover:border-blue-500/50 rounded-xl text-left transition flex items-start gap-3.5 group"
                  >
                    <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-lg group-hover:bg-blue-500 group-hover:text-white transition duration-200">
                      <Mail size={16} />
                    </div>
                    <div>
                      <span className="block font-bold text-xs text-white group-hover:text-blue-400 transition">{profile.name}</span>
                      <span className="block text-[10px] text-slate-400 mt-0.5">{profile.email}</span>
                      <span className="block text-[9px] text-slate-500 italic mt-1">{profile.desc}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-slate-950 p-4 border-t border-slate-850 flex justify-end gap-2.5">
              <button
                onClick={() => setShowEntraModal(false)}
                className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-4 py-2 rounded-xl text-xs transition duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}