import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import {
  CheckCircle2,
  XCircle,
  Users,
  Clock,
  Award,
  Sparkles,
  Download,
  AlertCircle,
  TrendingUp,
  Filter,
  Check,
  X,
  HelpCircle,
  ChevronRight
} from 'lucide-react';

export default function ManagerDashboard() {
  const { user } = useContext(AuthContext);
  const [teamGoals, setTeamGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Modal Decision State
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    goalId: null,
    goalTitle: null,
    employeeName: null,
    actionType: null // 'Approve' | 'Reject'
  });

  // Toast alert feedback state
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Filter state
  const [activeFilter, setActiveFilter] = useState('All');

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  const fetchTeamGoals = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/goals/team-goals`, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setTeamGoals(res.data);
    } catch (err) {
      console.error(err);
      showToast('Failed to load team objectives.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamGoals();
  }, []);

  const openConfirmation = (goal, actionType) => {
    setConfirmationModal({
      isOpen: true,
      goalId: goal._id,
      goalTitle: goal.title,
      employeeName: goal.employeeName,
      actionType
    });
  };

  const closeConfirmation = () => {
    setConfirmationModal({
      isOpen: false,
      goalId: null,
      goalTitle: null,
      employeeName: null,
      actionType: null
    });
  };

  const handleProcessAction = async () => {
    const { goalId, actionType, goalTitle, employeeName } = confirmationModal;
    if (!goalId) return;

    setActionLoadingId(goalId);
    const newStatus = actionType === 'Approve' ? 'Approved' : 'Rejected';

    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/goals/${goalId}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setTeamGoals(teamGoals.map(g => g._id === goalId ? { ...g, status: newStatus } : g));
      showToast(
        `Goal "${goalTitle}" for ${employeeName} was successfully ${newStatus.toLowerCase()}.`,
        actionType === 'Approve' ? 'success' : 'info'
      );
    } catch (err) {
      showToast(`Failed to update status for "${goalTitle}".`, 'error');
    } finally {
      setActionLoadingId(null);
      closeConfirmation();
    }
  };

  // Math Counters
  const totalTeamSize = new Set(teamGoals.map(g => g.employeeId?._id || g.employeeId)).size || 0;
  const pendingCount = teamGoals.filter(g => g.status === 'Pending Approval').length;
  const approvedCount = teamGoals.filter(g => g.status === 'Approved').length;
  const rejectedCount = teamGoals.filter(g => g.status === 'Rejected').length;

  const filteredGoals = teamGoals.filter(g => {
    if (activeFilter === 'All') return true;
    return g.status === activeFilter;
  });

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(teamGoals, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `team_goals_matrix_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Team Goals Matrix export downloaded successfully.', 'success');
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-slide-up font-sans relative">
      {/* Toast System Alert */}
      {toast.show && (
        <div className={`fixed top-6 right-6 z-50 p-4 rounded-2xl shadow-2xl border flex items-center gap-3.5 animate-in fade-in slide-in-from-top duration-300 ${
          toast.type === 'success' ? 'bg-emerald-950/95 border-emerald-500/30 text-emerald-300' :
          toast.type === 'error' ? 'bg-rose-950/95 border-rose-500/30 text-rose-300' : 'bg-slate-900/95 border-slate-800 text-slate-300'
        }`}>
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
          <span className="text-xs font-semibold">{toast.message}</span>
        </div>
      )}

      {/* Header Container */}
      <header className="flex flex-col md:flex-row md:justify-between items-start md:items-center bg-white p-6 rounded-3xl shadow-sm border border-slate-100 gap-4">
        <div>
          <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg">Management Hub</span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-2.5">
            Team Matrix <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">Console</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">Review, synchronize, and authorize organizational objectives designed by your direct reports.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleExport}
            className="cursor-pointer bg-slate-900 hover:bg-slate-800 text-white font-semibold px-5 py-3 rounded-2xl shadow-md transition flex items-center gap-2 text-sm"
          >
            <Download size={16} />
            <span>Export Matrix Report</span>
          </button>
        </div>
      </header>

      {/* Analytics Counter Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4.5 premium-shadow-hover">
          <div className="p-3.5 bg-indigo-50 text-indigo-600 rounded-2xl"><Users size={24} /></div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Direct Reports</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{totalTeamSize} <span className="text-xs font-semibold text-slate-400">Members</span></h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4.5 premium-shadow-hover">
          <div className="p-3.5 bg-amber-50 text-amber-600 rounded-2xl"><Clock size={24} /></div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Awaiting Decision</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{pendingCount} <span className="text-xs font-semibold text-amber-500">Pending</span></h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4.5 premium-shadow-hover">
          <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-2xl"><CheckCircle2 size={24} /></div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Approved Sheets</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{approvedCount} <span className="text-xs font-semibold text-emerald-500">Active</span></h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4.5 premium-shadow-hover">
          <div className="p-3.5 bg-rose-50 text-rose-600 rounded-2xl"><XCircle size={24} /></div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Rejected Sheets</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{rejectedCount} <span className="text-xs font-semibold text-rose-500">Returned</span></h3>
          </div>
        </div>
      </div>

      {/* Directory Layout Container */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Table Head & Filtering Badge System */}
        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl"><Filter size={18} /></div>
            <div>
              <h2 className="font-bold text-slate-900 text-lg">Team Goals Directory</h2>
              <p className="text-xs text-slate-400 font-medium">Verify employee scores, weight percentages, and current tracking statuses.</p>
            </div>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-xl shrink-0 gap-1 self-start lg:self-auto">
            {['All', 'Pending Approval', 'Approved', 'Rejected'].map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`cursor-pointer px-4 py-1.5 rounded-lg text-xs font-semibold transition duration-200 ${
                  activeFilter === filter
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-950'
                }`}
              >
                {filter === 'Pending Approval' ? 'Awaiting Action' : filter}
              </button>
            ))}
          </div>
        </div>

        {/* Matrix Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50/50">
                <th className="p-5">Team Employee</th>
                <th className="p-5">Thrust Category</th>
                <th className="p-5">Goal Title</th>
                <th className="p-5 text-center">Status</th>
                <th className="p-5 text-right">Weight</th>
                <th className="p-5 text-right">Goal Progress</th>
                <th className="p-5 text-center w-64">Decisions & Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {filteredGoals.map(g => (
                <tr key={g._id} className="hover:bg-slate-50/80 transition group">
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-blue-500 flex items-center justify-center font-bold text-white text-xs shrink-0 shadow-sm">
                        {g.employeeName.charAt(0)}
                      </div>
                      <div>
                        <span className="font-semibold text-slate-900 block leading-tight">{g.employeeName}</span>
                        <span className="text-[10px] text-slate-400">Developer</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <span className="inline-flex items-center text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg">
                      {g.thrustArea}
                    </span>
                  </td>
                  <td className="p-5 max-w-xs truncate font-medium text-slate-800" title={g.title}>
                    {g.title}
                  </td>
                  <td className="p-5 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                      g.status === 'Approved' ? 'bg-emerald-50 text-emerald-700' :
                      g.status === 'Pending Approval' ? 'bg-amber-50 text-amber-700' :
                      g.status === 'Rejected' ? 'bg-rose-50 text-rose-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        g.status === 'Approved' ? 'bg-emerald-500' :
                        g.status === 'Pending Approval' ? 'bg-amber-500' :
                        g.status === 'Rejected' ? 'bg-rose-500' : 'bg-slate-500'
                      }`} />
                      {g.status}
                    </span>
                  </td>
                  <td className="p-5 text-right font-bold text-slate-900">{g.weightage}%</td>
                  <td className="p-5 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden shrink-0">
                        <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" style={{ width: `${g.progress}%` }} />
                      </div>
                      <span className="font-bold text-slate-900 w-8">{g.progress}%</span>
                    </div>
                  </td>
                  <td className="p-5 text-center">
                    {g.status === 'Pending Approval' ? (
                      <div className="flex justify-center gap-2.5">
                        <button
                          disabled={actionLoadingId === g._id}
                          onClick={() => openConfirmation(g, 'Approve')}
                          className="cursor-pointer inline-flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600 active:scale-[0.97] text-white text-xs font-bold px-3.5 py-2 rounded-xl transition duration-150 shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/20"
                        >
                          <Check size={14} className="stroke-[2.5]" />
                          <span>Approve</span>
                        </button>
                        <button
                          disabled={actionLoadingId === g._id}
                          onClick={() => openConfirmation(g, 'Reject')}
                          className="cursor-pointer inline-flex items-center gap-1 bg-rose-500 hover:bg-rose-600 active:scale-[0.97] text-white text-xs font-bold px-3.5 py-2 rounded-xl transition duration-150 shadow-md shadow-rose-500/10 hover:shadow-rose-500/20"
                        >
                          <X size={14} className="stroke-[2.5]" />
                          <span>Reject</span>
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 font-medium">Decided</span>
                    )}
                  </td>
                </tr>
              ))}
              {filteredGoals.length === 0 && (
                <tr>
                  <td colSpan="7" className="p-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center">
                      <HelpCircle size={40} className="stroke-[1.2] mb-2 text-slate-300" />
                      <p className="text-sm font-medium">No direct reports goals meet current filtration badge criteria.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Action Modal Overlay */}
      {confirmationModal.isOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3.5 mb-4">
              <div className={`p-3 rounded-2xl shrink-0 ${
                confirmationModal.actionType === 'Approve' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
              }`}>
                {confirmationModal.actionType === 'Approve' ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Confirm Goal {confirmationModal.actionType}
                </h3>
                <p className="text-xs text-slate-400">Action is permanent and triggers direct employee notifications.</p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4.5 border border-slate-100 text-xs space-y-3.5 my-5 text-slate-600">
              <div>
                <span className="font-bold text-slate-400 uppercase tracking-widest block mb-1">Employee Name</span>
                <span className="font-semibold text-slate-900 text-sm">{confirmationModal.employeeName}</span>
              </div>
              <div>
                <span className="font-bold text-slate-400 uppercase tracking-widest block mb-1">Goal Metric Title</span>
                <span className="font-semibold text-slate-900 leading-snug block">{confirmationModal.goalTitle}</span>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={closeConfirmation}
                className="cursor-pointer border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold px-4 py-2.5 rounded-xl transition duration-150 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleProcessAction}
                className={`cursor-pointer text-white font-bold px-4.5 py-2.5 rounded-xl transition duration-150 text-xs shadow-md ${
                  confirmationModal.actionType === 'Approve' 
                    ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/10' 
                    : 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/10'
                }`}
              >
                Confirm & {confirmationModal.actionType}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
