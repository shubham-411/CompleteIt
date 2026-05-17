import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';

export default function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-slate-950 overflow-hidden px-4 font-sans">
      {/* Dynamic Background Glow Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none animate-pulse duration-[6000ms]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none animate-pulse duration-[8000ms]" />

      <div className="max-w-md w-full relative z-10 animate-slide-up">
        {/* Portal Header Accent */}
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-3xl font-black text-white tracking-tight font-heading">
            CompleteIt
          </h1>
        </div>

        {/* Auth Box Container */}
        <div className="glass-card-dark rounded-3xl p-8 shadow-2xl relative overflow-hidden border border-slate-800">
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

          {/* Quick Demo Credentials Footer */}
          <div className="mt-8 pt-6 border-t border-slate-900 text-center">
            <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500 block mb-2">Quick Reference Sign-in Accounts</span>
            <div className="grid grid-cols-3 gap-2 text-[10px] text-slate-400">
              <div className="bg-slate-900/50 p-2 rounded-lg border border-slate-900">
                <span className="font-semibold text-slate-300 block">Employee</span>
                emp@company.com
              </div>
              <div className="bg-slate-900/50 p-2 rounded-lg border border-slate-900">
                <span className="font-semibold text-slate-300 block">Manager</span>
                manager@company.com
              </div>
              <div className="bg-slate-900/50 p-2 rounded-lg border border-slate-900">
                <span className="font-semibold text-slate-300 block">Administrator</span>
                admin@company.com
              </div>
            </div>
            <span className="text-[9px] text-slate-500 mt-2 block italic">All accounts password: password123</span>
          </div>
        </div>
      </div>
    </div>
  );
}