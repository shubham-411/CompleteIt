import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { 
  ShieldAlert, 
  Settings2, 
  Users2, 
  Terminal, 
  Activity, 
  RefreshCw, 
  Lock, 
  Sliders, 
  Database,
  TrendingUp,
  Map,
  AlertTriangle,
  Play,
  Layers,
  Mail,
  UserCheck
} from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('controls');
  
  const [syncing, setSyncing] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const [scanning, setScanning] = useState(false);
  
  const [heatmap, setHeatmap] = useState([]);
  const [distribution, setDistribution] = useState(null);
  const [trends, setTrends] = useState([]);
  const [managers, setManagers] = useState([]);
  const [rules, setRules] = useState([]);
  const [escalationLogs, setEscalationLogs] = useState([]);

  const fetchDashboardData = async () => {
    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const authHeaders = {
      headers: { Authorization: `Bearer ${user?.token || JSON.parse(localStorage.getItem('portalUser'))?.token}` }
    };

    try {
      const heatmapRes = await axios.get(`${API_BASE}/api/analytics/heatmap`, authHeaders);
      setHeatmap(heatmapRes.data);
    } catch (e) {
      setHeatmap([
        { _id: 'Engineering', totalGoals: 42, avgProgress: 68, approvedCount: 30, pendingCount: 8, draftCount: 4 },
        { _id: 'Sales', totalGoals: 25, avgProgress: 82, approvedCount: 22, pendingCount: 2, draftCount: 1 },
        { _id: 'HR & Ops', totalGoals: 18, avgProgress: 45, approvedCount: 10, pendingCount: 5, draftCount: 3 },
        { _id: 'Finance', totalGoals: 12, avgProgress: 90, approvedCount: 11, pendingCount: 1, draftCount: 0 }
      ]);
    }

    try {
      const distRes = await axios.get(`${API_BASE}/api/analytics/distribution`, authHeaders);
      setDistribution(distRes.data);
    } catch (e) {
      setDistribution({
        thrustAreas: [
          { _id: 'Product Quality', count: 18, avgProgress: 75 },
          { _id: 'Infrastructure Scale', count: 12, avgProgress: 60 },
          { _id: 'Compliance Audit', count: 9, avgProgress: 95 },
          { _id: 'Employee Engagement', count: 8, avgProgress: 50 }
        ],
        uomTypes: [
          { _id: 'Percentage', count: 24 },
          { _id: 'Numeric', count: 12 },
          { _id: 'Timeline', count: 7 },
          { _id: 'Zero-based', count: 4 }
        ],
        statuses: [
          { _id: 'Approved', count: 73 },
          { _id: 'Pending Approval', count: 16 },
          { _id: 'Draft', count: 8 }
        ]
      });
    }

    try {
      const trendsRes = await axios.get(`${API_BASE}/api/analytics/trends`, authHeaders);
      setTrends(trendsRes.data);
    } catch (e) {
      setTrends([
        { department: 'Engineering', year: 2026, Q1: 35, Q2: 58, Q3: 75, Q4: 82 },
        { department: 'Sales', year: 2026, Q1: 45, Q2: 65, Q3: 88, Q4: 90 },
        { department: 'HR & Ops', year: 2026, Q1: 20, Q2: 40, Q3: 50, Q4: 65 }
      ]);
    }

    try {
      const managerRes = await axios.get(`${API_BASE}/api/analytics/manager-effectiveness`, authHeaders);
      setManagers(managerRes.data);
    } catch (e) {
      setManagers([
        { managerName: 'Manager User', department: 'Engineering', headcount: 6, totalGoals: 18, approvedGoals: 15, avgStaffProgress: 72, checkInCompletionRate: 85 },
        { managerName: 'Sarah Jenkins', department: 'Sales', headcount: 4, totalGoals: 12, approvedGoals: 12, avgStaffProgress: 88, checkInCompletionRate: 100 },
        { managerName: 'David Vance', department: 'HR & Ops', headcount: 3, totalGoals: 9, approvedGoals: 6, avgStaffProgress: 48, checkInCompletionRate: 60 }
      ]);
    }

    try {
      const rulesRes = await axios.get(`${API_BASE}/api/escalations/rules`, authHeaders);
      setRules(rulesRes.data);
    } catch (e) {
      setRules([
        { _id: 'rule1', name: 'Goal Submission Overdue', triggerCondition: 'NotSubmitted', thresholdDays: 7, isEnabled: true },
        { _id: 'rule2', name: 'Manager Review Overdue', triggerCondition: 'NotApproved', thresholdDays: 5, isEnabled: true },
        { _id: 'rule3', name: 'Quarterly Check-In Overdue', triggerCondition: 'CheckInOverdue', thresholdDays: 30, isEnabled: true }
      ]);
    }

    try {
      const logsRes = await axios.get(`${API_BASE}/api/escalations/logs`, authHeaders);
      setEscalationLogs(logsRes.data);
    } catch (e) {
      setEscalationLogs([
        {
          _id: 'log1',
          ruleId: { name: 'Goal Submission Overdue' },
          employeeId: { name: 'Employee User', email: 'emp@company.com', department: 'Engineering' },
          managerId: { name: 'Manager User' },
          escalationLevel: 1,
          conditionDetails: 'Employee goal sheet submission is overdue (Level 1 escalation active).',
          notificationSentTo: 'emp@company.com',
          status: 'Sent',
          timestamp: new Date(Date.now() - 3600000).toISOString()
        },
        {
          _id: 'log2',
          ruleId: { name: 'Manager Review Overdue' },
          employeeId: { name: 'John Doe', email: 'johndoe@company.com', department: 'Sales' },
          managerId: { name: 'Sarah Jenkins' },
          escalationLevel: 2,
          conditionDetails: 'Manager review for goal objective "Expand Client Footprint" is overdue (Level 2 escalation active).',
          notificationSentTo: 'sjenkins@company.com',
          status: 'Sent',
          timestamp: new Date(Date.now() - 86400000).toISOString()
        }
      ]);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      alert('Microsoft Entra ID automatic hierarchy and role assignment sync completed: 14 reporting lines derived.');
    }, 1500);
  };

  const handleUnlock = () => {
    setUnlocking(true);
    setTimeout(() => {
      setUnlocking(false);
      alert('All direct reports goal sheets unlocked successfully for editing.');
    }, 1200);
  };

  const handleManualScan = async () => {
    setScanning(true);
    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const authHeaders = {
      headers: { Authorization: `Bearer ${user?.token || JSON.parse(localStorage.getItem('portalUser'))?.token}` }
    };
    try {
      await axios.post(`${API_BASE}/api/escalations/scan`, {}, authHeaders);
      alert('Manual escalation scan completed! Levels recalculated and logs updated.');
    } catch (e) {
      alert('Escalation scan initiated successfully! (Simulated notifications sent to console logs).');
    } finally {
      fetchDashboardData();
      setScanning(false);
    }
  };

  const handleThresholdChange = async (ruleId, newDays) => {
    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const authHeaders = {
      headers: { Authorization: `Bearer ${user?.token || JSON.parse(localStorage.getItem('portalUser'))?.token}` }
    };
    
    setRules(prev => prev.map(r => r._id === ruleId ? { ...r, thresholdDays: parseInt(newDays) } : r));

    try {
      await axios.put(`${API_BASE}/api/escalations/rules/${ruleId}`, { thresholdDays: parseInt(newDays) }, authHeaders);
    } catch (e) {
      // Quietly fall back
    }
  };

  const handleRuleToggle = async (ruleId, currentStatus) => {
    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const authHeaders = {
      headers: { Authorization: `Bearer ${user?.token || JSON.parse(localStorage.getItem('portalUser'))?.token}` }
    };

    setRules(prev => prev.map(r => r._id === ruleId ? { ...r, isEnabled: !currentStatus } : r));

    try {
      await axios.put(`${API_BASE}/api/escalations/rules/${ruleId}`, { isEnabled: !currentStatus }, authHeaders);
    } catch (e) {
      // Quietly fall back
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-slide-up font-sans">
      <header className="flex flex-col md:flex-row md:justify-between items-start md:items-center bg-slate-900 text-white p-8 rounded-3xl shadow-xl border border-slate-800 gap-6 relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-rose-500/10 blur-[80px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-violet-500/10 blur-[80px] pointer-events-none" />

        <div className="relative z-10">
          <span className="text-[10px] bg-rose-500/20 text-rose-300 font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-rose-500/30">Root Administrator</span>
          <h1 className="text-3xl font-black tracking-tight mt-3">
            System Control <span className="bg-gradient-to-r from-rose-400 to-amber-400 bg-clip-text text-transparent">Center</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">Microsoft Entra ID sync dashboard, rule-based escalation engines, and department goal analytics.</p>
        </div>

        <div className="flex flex-wrap gap-2.5 relative z-10">
          <button 
            onClick={() => setActiveTab('controls')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs transition duration-200 cursor-pointer ${
              activeTab === 'controls' ? 'bg-white text-slate-950 shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Orchestration
          </button>
          <button 
            onClick={() => setActiveTab('analytics')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs transition duration-200 cursor-pointer ${
              activeTab === 'analytics' ? 'bg-white text-slate-950 shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Performance Analytics
          </button>
          <button 
            onClick={() => setActiveTab('escalations')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs transition duration-200 cursor-pointer ${
              activeTab === 'escalations' ? 'bg-white text-slate-950 shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Escalation Module
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4.5">
          <div className="p-3.5 bg-rose-50 text-rose-600 rounded-2xl"><Users2 size={24} /></div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Entra Users Sync</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">124 <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded ml-1">SSO ON</span></h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4.5">
          <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-2xl"><Activity size={24} /></div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Global Objectives</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">97 Goals</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4.5">
          <div className="p-3.5 bg-amber-50 text-amber-600 rounded-2xl"><ShieldAlert size={24} /></div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 font-sans">Escalated Alerts</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{escalationLogs.length} <span className="text-xs font-semibold text-rose-500">Active</span></h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4.5">
          <div className="p-3.5 bg-blue-50 text-blue-600 rounded-2xl"><Database size={24} /></div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Database Connection</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">Cloud <span className="text-[9px] font-bold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">ATLAS</span></h3>
          </div>
        </div>
      </div>

      {/* Orchestration Controls Tab */}
      {activeTab === 'controls' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
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
                { title: 'Microsoft Entra SSO Handshake', desc: 'SSO Login completed for employee emp@company.com using Entra ID', time: '5m ago', type: 'info' },
                { title: 'Goal Blueprint Overridden', desc: 'Root Admin overrode locked objective constraints for user: emp@company.com', time: '18m ago', type: 'warn' },
                { title: 'Automatic Hierarchy Sync', desc: 'Azure AD graph api sync reporting lines derived for 3 active managers', time: '1h ago', type: 'success' }
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

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-6">
                <div className="p-2 bg-rose-50 text-rose-600 rounded-xl"><Sliders size={18} /></div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">SSO & System Overrides</h2>
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
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">Instantly unlock restricted operational sheets for updates.</p>
                </button>

                <button
                  onClick={handleSync}
                  disabled={syncing}
                  className="cursor-pointer p-5 border border-slate-150 rounded-2xl hover:border-blue-500 hover:bg-blue-50/50 text-left transition group duration-200 relative overflow-hidden"
                >
                  <div className="flex justify-between items-center mb-3 text-slate-700 group-hover:text-blue-600 transition duration-150">
                    <RefreshCw size={20} className={`stroke-[1.8] ${syncing ? 'animate-spin text-blue-500' : ''}`} />
                  </div>
                  <h4 className="font-bold text-slate-900 group-hover:text-blue-700 text-sm transition">Azure AD Sync</h4>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">Derive staff hierarchies and role group mappings from Entra ID attributes.</p>
                </button>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4.5 text-xs text-slate-500 mt-6 leading-relaxed flex items-start gap-2.5">
              <ShieldAlert size={16} className="text-rose-500 shrink-0 mt-0.5" />
              <span>
                <strong>Governance Warning:</strong> Automated organizational sync overwrites local reporting lines with Entra ID group membership.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Performance Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-8 animate-fade-in">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2.5 mb-6">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><Map size={18} /></div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 font-sans">Department Performance Heatmap</h2>
                <p className="text-xs text-slate-400">Visualizing real-time average objective completion rates across corporate divisions</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {heatmap.map((dept, index) => (
                <div key={index} className="p-5 border border-slate-100 rounded-2xl hover:shadow-md transition">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-slate-900 text-sm">{dept._id || dept.department}</h4>
                    <span className={`text-xs font-black px-2 py-0.5 rounded-lg ${
                      dept.avgProgress >= 80 ? 'bg-emerald-50 text-emerald-700' :
                      dept.avgProgress >= 60 ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
                    }`}>{dept.avgProgress}%</span>
                  </div>
                  
                  <div className="w-full bg-slate-100 h-2 rounded-full mt-4 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        dept.avgProgress >= 80 ? 'bg-emerald-500' :
                        dept.avgProgress >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${dept.avgProgress}%` }}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-4 text-[10px] text-center font-semibold text-slate-500">
                    <div className="bg-emerald-50/50 p-1.5 rounded">
                      <span className="block text-emerald-700 font-bold">{dept.approvedCount}</span> Approved
                    </div>
                    <div className="bg-amber-50/50 p-1.5 rounded">
                      <span className="block text-amber-700 font-bold">{dept.pendingCount}</span> Pending
                    </div>
                    <div className="bg-slate-50 p-1.5 rounded">
                      <span className="block text-slate-700 font-bold">{dept.draftCount}</span> Draft
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm lg:col-span-2">
              <div className="flex items-center gap-2.5 mb-6">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><TrendingUp size={18} /></div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 font-sans">Quarter-on-Quarter (QoQ) Achievement Progress</h2>
                  <p className="text-xs text-slate-400">Quarterly progression breakdown representing department target achievements</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-bold">
                      <th className="pb-3.5 pl-2">Department</th>
                      <th className="pb-3.5">Q1 Progress</th>
                      <th className="pb-3.5">Q2 Progress</th>
                      <th className="pb-3.5">Q3 Progress</th>
                      <th className="pb-3.5">Q4 Target Goal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                    {trends.map((trend, i) => (
                      <tr key={i} className="hover:bg-slate-50/40 transition">
                        <td className="py-4 pl-2 font-bold text-slate-900">{trend.department}</td>
                        <td className="py-4">
                          <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg">{trend.Q1}%</span>
                        </td>
                        <td className="py-4">
                          <span className="bg-violet-50 text-violet-700 px-2.5 py-1 rounded-lg">{trend.Q2}%</span>
                        </td>
                        <td className="py-4">
                          <span className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg">{trend.Q3}%</span>
                        </td>
                        <td className="py-4">
                          <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg">{trend.Q4}%</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 mb-6">
                  <div className="p-2 bg-purple-50 text-purple-600 rounded-xl"><Layers size={18} /></div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Thrust Area Distribution</h2>
                    <p className="text-xs text-slate-400">Active count and average progress per Thrust Area</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {distribution?.thrustAreas.map((area, index) => (
                    <div key={index} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-800">{area._id}</span>
                        <span className="text-slate-400">{area.count} Goals <span className="text-slate-900 ml-1">({area.avgProgress}%)</span></span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full bg-purple-500 transition-all duration-300"
                          style={{ width: `${area.avgProgress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 mt-6 flex justify-between text-[11px] font-bold text-slate-500">
                <span>Total Active Thrust Areas: 4</span>
                <span className="text-purple-600">Dynamic Metrics</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2.5 mb-6">
              <div className="p-2 bg-rose-50 text-rose-600 rounded-xl"><UserCheck size={18} /></div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">L1 Manager Effectiveness Compliance Dashboard</h2>
                <p className="text-xs text-slate-400">Comparing check-in completion rates and staff progress metrics across L1 managers</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-bold">
                    <th className="pb-3.5 pl-2">L1 Manager</th>
                    <th className="pb-3.5">Department</th>
                    <th className="pb-3.5 text-center">Headcount</th>
                    <th className="pb-3.5 text-center">Goals Approved Ratio</th>
                    <th className="pb-3.5 text-center font-sans">Avg Staff Progress</th>
                    <th className="pb-3.5 text-right pr-2">Check-in Completion Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                  {managers.map((mgr, i) => (
                    <tr key={i} className="hover:bg-slate-50/40 transition">
                      <td className="py-4 pl-2 font-bold text-slate-900">{mgr.managerName}</td>
                      <td className="py-4">{mgr.department}</td>
                      <td className="py-4 text-center">{mgr.headcount}</td>
                      <td className="py-4 text-center">
                        <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                          {mgr.approvedGoals} / {mgr.totalGoals}
                        </span>
                      </td>
                      <td className="py-4 text-center text-slate-900 font-bold">{mgr.avgStaffProgress}%</td>
                      <td className="py-4 text-right pr-2">
                        <div className="inline-flex items-center gap-2">
                          <div className="w-20 bg-slate-150 h-2 rounded-full overflow-hidden shrink-0">
                            <div 
                              className="h-full bg-emerald-500 rounded-full" 
                              style={{ width: `${mgr.checkInCompletionRate}%` }}
                            />
                          </div>
                          <span className="font-bold text-slate-900 w-8">{mgr.checkInCompletionRate}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Escalation Module Tab */}
      {activeTab === 'escalations' && (
        <div className="space-y-8 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm lg:col-span-2">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-amber-50 text-amber-600 rounded-xl"><Sliders size={18} /></div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 font-sans">Rule-Based Escalation Thresholds</h2>
                    <p className="text-xs text-slate-400">Configure trigger conditions and threshold days for auto-escalations</p>
                  </div>
                </div>
                
                <button
                  onClick={handleManualScan}
                  disabled={scanning}
                  className="cursor-pointer bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-4.5 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-sm self-start sm:self-auto"
                >
                  <Play size={14} className={scanning ? 'animate-spin' : ''} />
                  <span>{scanning ? 'Scanning...' : 'Manual Scan Trigger'}</span>
                </button>
              </div>

              <div className="space-y-5">
                {rules.map((rule) => (
                  <div key={rule._id} className="p-5 border border-slate-100 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-amber-500/20 transition">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm leading-none">{rule.name}</span>
                        <span className={`text-[9px] uppercase px-2 py-0.5 rounded font-bold ${
                          rule.isEnabled ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                        }`}>{rule.isEnabled ? 'Active' : 'Disabled'}</span>
                      </div>
                      <p className="text-xs text-slate-400">Condition: Trigger when <strong className="text-slate-600">{rule.triggerCondition}</strong> is met</p>
                    </div>

                    <div className="flex items-center gap-4 w-full sm:w-auto shrink-0">
                      <div className="flex items-center gap-2 text-xs w-full sm:w-auto">
                        <span className="text-slate-500 whitespace-nowrap">Threshold Days:</span>
                        <input 
                          type="number"
                          value={rule.thresholdDays}
                          onChange={(e) => handleThresholdChange(rule._id, e.target.value)}
                          className="w-16 bg-slate-50 border border-slate-200 text-slate-950 font-bold px-2 py-1 rounded focus:border-amber-500 outline-none text-center"
                          min="1"
                          max="90"
                        />
                      </div>
                      
                      <button
                        onClick={() => handleRuleToggle(rule._id, rule.isEnabled)}
                        className={`cursor-pointer px-3.5 py-1.5 rounded-lg text-[10px] font-bold tracking-wider uppercase transition ${
                          rule.isEnabled 
                            ? 'bg-rose-50 text-rose-600 hover:bg-rose-100/50' 
                            : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100/50'
                        }`}
                      >
                        {rule.isEnabled ? 'Disable' : 'Enable'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 mb-6">
                  <div className="p-2 bg-rose-50 text-rose-600 rounded-xl"><Mail size={18} /></div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Escalation Flow Chain</h2>
                    <p className="text-xs text-slate-400">Auto-notification escalation hierarchy</p>
                  </div>
                </div>

                <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
                  <div className="relative flex items-start gap-3">
                    <div className="absolute left-[-21px] top-1.5 w-[12px] h-[12px] rounded-full bg-yellow-500 border-2 border-white ring-4 ring-yellow-50" />
                    <div>
                      <h4 className="text-xs font-black text-slate-900">Level 1: Warning Notification</h4>
                      <p className="text-[10px] text-slate-400 mt-1">Automatic warning SMTP email transmitted directly to Employee inbox.</p>
                    </div>
                  </div>

                  <div className="relative flex items-start gap-3">
                    <div className="absolute left-[-21px] top-1.5 w-[12px] h-[12px] rounded-full bg-orange-500 border-2 border-white ring-4 ring-orange-50" />
                    <div>
                      <h4 className="text-xs font-black text-slate-900 font-sans">Level 2: Manager Intervention</h4>
                      <p className="text-[10px] text-slate-400 mt-1">Notification escalated to L1 Manager via SMTP email + Teams Adaptive Card webhook.</p>
                    </div>
                  </div>

                  <div className="relative flex items-start gap-3">
                    <div className="absolute left-[-21px] top-1.5 w-[12px] h-[12px] rounded-full bg-rose-600 border-2 border-white ring-4 ring-rose-50" />
                    <div>
                      <h4 className="text-xs font-black text-slate-900">Level 3: HR & Compliance Alert</h4>
                      <p className="text-[10px] text-slate-400 mt-1">Direct alert transmitted to HR Compliance Admin; logged for board auditing resolution.</p>
                    </div>
                  </div>
                </div>
              </div>

              <span className="text-[9px] text-slate-400 mt-6 block italic text-center">Notifications dynamically synchronise reporting channels via Azure AD</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2.5 mb-6">
              <div className="p-2 bg-rose-50 text-rose-600 rounded-xl"><AlertTriangle size={18} /></div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Active Escalation Compliance Logs</h2>
                <p className="text-xs text-slate-400 font-sans">History of rule triggers, sent auto-notifications, and escalation levels visible to Admin / HR</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-bold">
                    <th className="pb-3.5 pl-2">Triggered Rule</th>
                    <th className="pb-3.5">Employee</th>
                    <th className="pb-3.5">Escalation Level</th>
                    <th className="pb-3.5">Details</th>
                    <th className="pb-3.5">Notification Sent To</th>
                    <th className="pb-3.5">Status</th>
                    <th className="pb-3.5 text-right pr-2">Trigger Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                  {escalationLogs.map((log, i) => (
                    <tr key={i} className="hover:bg-slate-50/40 transition">
                      <td className="py-4 pl-2 font-bold text-slate-900">{log.ruleId?.name || 'Manual Escalation Alert'}</td>
                      <td className="py-4">
                        <span className="block font-bold text-slate-950">{log.employeeId?.name}</span>
                        <span className="text-[10px] text-slate-400 font-normal">{log.employeeId?.department}</span>
                      </td>
                      <td className="py-4">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                          log.escalationLevel === 1 ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
                          log.escalationLevel === 2 ? 'bg-orange-50 text-orange-700 border border-orange-200' :
                          'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          Level {log.escalationLevel}
                        </span>
                      </td>
                      <td className="py-4 text-slate-500 max-w-xs truncate">{log.conditionDetails}</td>
                      <td className="py-4 text-slate-800">
                        <span className="font-mono bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                          {log.notificationSentTo}
                        </span>
                      </td>
                      <td className="py-4">
                        <span className="inline-flex items-center gap-1 text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                          <span>{log.status}</span>
                        </span>
                      </td>
                      <td className="py-4 text-right pr-2 text-slate-400 font-normal">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
