import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import {
  Plus,
  Compass,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  FileText,
  Percent,
  Sparkles,
  Layers,
  Flame,
  ArrowUpRight,
  TrendingUp,
  Award
} from 'lucide-react';

export default function EmployeeDashboard() {
  const { user } = useContext(AuthContext);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [thrustArea, setThrustArea] = useState('');
  const [uom, setUom] = useState('Percentage');
  const [target, setTarget] = useState(100);
  const [weightage, setWeightage] = useState(20);
  const [formError, setFormError] = useState('');

  // Filtering Table State
  const [activeTab, setActiveTab] = useState('All');

  // Progress Update Modal State
  const [selectedGoalForProgress, setSelectedGoalForProgress] = useState(null);
  const [newAchievement, setNewAchievement] = useState('');
  const [progressModalLoading, setProgressModalLoading] = useState(false);

  const fetchGoals = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/goals/my-goals`, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setGoals(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleCreateGoal = async (e) => {
    e.preventDefault();
    setFormError('');

    if (weightage <= 0 || weightage > 100) {
      setFormError('Weightage must be between 1% and 100%');
      return;
    }

    const currentTotalWeight = goals
      .filter(g => g.status !== 'Rejected')
      .reduce((acc, g) => acc + g.weightage, 0);

    if (currentTotalWeight + weightage > 100) {
      setFormError(`Adding this goal would exceed 100% total weightage. Limit available: ${100 - currentTotalWeight}%`);
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/goals`,
        { title, thrustArea, uom, target, weightage },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      fetchGoals();
      setTitle('');
      setThrustArea('');
      setUom('Percentage');
      setTarget(100);
      setWeightage(20);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Goal addition schema validation failed.');
    }
  };

  const handleSubmitSheet = async () => {
    const totalWeight = goals.reduce((acc, g) => acc + g.weightage, 0);
    if (totalWeight !== 100) {
      alert(`Validation Error: Total sheet weightage must equal exactly 100%. Current allocation is ${totalWeight}%`);
      return;
    }

    setSubmitLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/goals/submit`, {}, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      alert('Goal sheet locked and pushed for tracking alignment successfully.');
      fetchGoals();
    } catch (err) {
      alert(err.response?.data?.message || 'Validation Error processing ruleset weight constraints');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleOpenUpdateProgress = (goal) => {
    setSelectedGoalForProgress(goal);
    setNewAchievement(goal.achievement || 0);
  };

  const handleUpdateProgress = async (e) => {
    e.preventDefault();
    if (!selectedGoalForProgress) return;

    setProgressModalLoading(true);
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/goals/${selectedGoalForProgress._id}/achievement`,
        { achievement: Number(newAchievement) },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      setSelectedGoalForProgress(null);
      fetchGoals();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update progress achievement metrics');
    } finally {
      setProgressModalLoading(false);
    }
  };

  // Math Metrics
  const activeGoalsCount = goals.length;
  const totalWeightAllocated = goals.reduce((acc, g) => acc + g.weightage, 0);
  const averageProgress = activeGoalsCount > 0 
    ? Math.round(goals.reduce((acc, g) => acc + g.progress, 0) / activeGoalsCount) 
    : 0;
  const approvedCount = goals.filter(g => g.status === 'Approved').length;

  const filteredGoals = goals.filter(g => {
    if (activeTab === 'All') return true;
    return g.status === activeTab;
  });

  // Recharts custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 backdrop-blur-md text-white p-3.5 rounded-xl border border-slate-800 shadow-xl text-xs">
          <p className="font-bold text-slate-200">{payload[0].payload.title}</p>
          <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">Progress Metrics</p>
          <div className="flex items-center gap-2 mt-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="font-bold text-sm text-emerald-400">{payload[0].value}% Complete</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-slide-up font-sans">
      {/* Header Panel */}
      <header className="flex flex-col md:flex-row md:justify-between items-start md:items-center bg-white p-6 rounded-3xl shadow-sm border border-slate-100 gap-4">
        <div>
          <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg">Operational Console</span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-2.5">
            Welcome, <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">{user?.name}</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">Design your objective blueprint, customize targets, and coordinate performance scores.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSubmitSheet}
            disabled={submitLoading}
            className="cursor-pointer bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold px-5.5 py-3 rounded-2xl shadow-lg shadow-emerald-600/10 hover:shadow-emerald-600/20 active:scale-[0.98] transition flex items-center gap-2"
          >
            {submitLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Award size={18} />
                <span>Finalize & Submit Sheet</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Grid of Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4.5 premium-shadow-hover">
          <div className="p-3.5 bg-blue-50 text-blue-600 rounded-2xl"><Sparkles size={24} /></div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Objectives</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{activeGoalsCount} <span className="text-xs font-semibold text-slate-400">/ 8 max</span></h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4.5 premium-shadow-hover">
          <div className="p-3.5 bg-purple-50 text-purple-600 rounded-2xl"><Percent size={24} /></div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Weightage Locked</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{totalWeightAllocated}% <span className="text-xs font-semibold text-slate-400">/ 100%</span></h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4.5 premium-shadow-hover">
          <div className="p-3.5 bg-amber-50 text-amber-600 rounded-2xl"><TrendingUp size={24} /></div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Avg. Goal Progress</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{averageProgress}%</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4.5 premium-shadow-hover">
          <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-2xl"><CheckCircle2 size={24} /></div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Approved Targets</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{approvedCount} <span className="text-xs font-semibold text-slate-400">goals</span></h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Objective Creation Form Panel */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm h-fit">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="p-2 bg-slate-900 text-white rounded-xl"><Plus size={18} /></div>
            <h2 className="text-lg font-bold text-slate-900">Add Objective Goal</h2>
          </div>

          {formError && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 text-xs flex items-start gap-2 animate-in fade-in">
              <AlertCircle size={15} className="shrink-0 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleCreateGoal} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Goal Metric Title</label>
              <input
                type="text"
                className="w-full border border-slate-200 p-2.5 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition text-sm"
                placeholder="e.g. Expand API response throughput"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Thrust Area Category</label>
              <input
                type="text"
                className="w-full border border-slate-200 p-2.5 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition text-sm"
                placeholder="e.g. Infrastructure Performance"
                value={thrustArea}
                onChange={e => setThrustArea(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">UoM Strategy</label>
                <select
                  className="w-full border border-slate-200 p-2.5 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition text-sm"
                  value={uom}
                  onChange={e => setUom(e.target.value)}
                >
                  <option>Numeric</option>
                  <option>Percentage</option>
                  <option>Timeline</option>
                  <option>Zero-based</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Target Value</label>
                <input
                  type="number"
                  className="w-full border border-slate-200 p-2.5 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition text-sm"
                  value={target}
                  onChange={e => setTarget(Number(e.target.value))}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Weightage Allocation (%)</label>
              <input
                type="number"
                className="w-full border border-slate-200 p-2.5 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition text-sm"
                value={weightage}
                onChange={e => setWeightage(Number(e.target.value))}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition duration-200 cursor-pointer shadow-md shadow-slate-950/10 flex items-center justify-center gap-2 text-sm"
            >
              <Plus size={16} />
              <span>Append Goal Blueprint</span>
            </button>
          </form>
        </div>

        {/* Dynamic Spectrum Charting Panel */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><Layers size={18} /></div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Metrics Execution Spectrum</h2>
                <p className="text-xs text-slate-400">Visualization of your customized operational objectives progress</p>
              </div>
            </div>
            <Flame className="text-amber-500 w-5 h-5 stroke-[2.5]" />
          </div>

          <div className="w-full h-76">
            {goals.length === 0 ? (
              <div className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-2xl p-6 text-slate-400">
                <HelpCircle size={36} className="mb-2 stroke-[1.5]" />
                <p className="text-sm font-medium">No performance benchmarks created yet.</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={goals} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.95}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.75}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f8fafc" vertical={false} />
                  <XAxis dataKey="title" stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <YAxis stroke="#94a3b8" domain={[0, 100]} fontSize={10} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                  <Bar dataKey="progress" fill="url(#colorProgress)" radius={[8, 8, 0, 0]} maxBarSize={45}>
                    {goals.map((entry, index) => (
                      <Cell key={`cell-${index}`} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Structured Metrics Table Data Overview */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Table Header with Tabs Filter */}
        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="font-bold text-slate-900 text-lg">Active Operational Core Targets</h2>
            <p className="text-xs text-slate-400">Review status, weightage allocation, and progress metrics below.</p>
          </div>

          {/* Filtering Badge Buttons */}
          <div className="flex bg-slate-100 p-1 rounded-xl shrink-0 gap-1 self-start md:self-auto">
            {['All', 'Draft', 'Pending Approval', 'Approved', 'Rejected'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`cursor-pointer px-3.5 py-1.5 rounded-lg text-xs font-semibold transition duration-200 ${
                  activeTab === tab
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-950'
                }`}
              >
                {tab === 'Pending Approval' ? 'Pending' : tab}
              </button>
            ))}
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50/50">
                <th className="p-5">Objective Title</th>
                <th className="p-5">Thrust Category</th>
                <th className="p-5 text-center">Unit strategy</th>
                <th className="p-5 text-center">Weight</th>
                <th className="p-5 text-center">Status</th>
                <th className="p-5 text-right">Progress Complete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {filteredGoals.map(g => (
                <tr key={g._id} className="hover:bg-slate-50/80 transition group">
                  <td className="p-5 font-semibold text-slate-900 group-hover:text-emerald-600 transition duration-150">
                    {g.title}
                  </td>
                  <td className="p-5">
                    <span className="inline-flex items-center gap-1.5 text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg">
                      <Compass size={12} />
                      {g.thrustArea}
                    </span>
                  </td>
                  <td className="p-5 text-center text-xs font-medium text-slate-500">{g.uom}</td>
                  <td className="p-5 text-center font-bold text-slate-800">{g.weightage}%</td>
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
                  <td className="p-5 text-right">
                    <div className="flex items-center justify-end gap-3.5">
                      <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden shrink-0">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full group-hover:brightness-105 transition-all duration-300"
                          style={{ width: `${g.progress}%` }}
                        />
                      </div>
                      <span className="font-bold text-slate-900 w-8">{g.progress}%</span>
                      {g.status === 'Approved' && (
                        <button
                          onClick={() => handleOpenUpdateProgress(g)}
                          className="cursor-pointer p-1 bg-slate-50 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 rounded-lg transition"
                          title="Update Quarterly Progress"
                        >
                          <TrendingUp size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredGoals.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center">
                      <FileText size={40} className="stroke-[1.2] mb-2 text-slate-300" />
                      <p className="text-sm font-medium">No goals found matching current filter state.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quarterly Progress Update Modal */}
      {selectedGoalForProgress && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md flex items-center justify-center z-50 animate-in fade-in duration-300">
          <div className="bg-white/95 backdrop-blur-xl border border-slate-100 rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in scale-in duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                <TrendingUp size={24} />
              </div>
              <div>
                <h3 className="font-heading text-lg font-black text-slate-900">Update Achievement</h3>
                <p className="text-xs text-slate-400">Quarterly progress tracking engine</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-6 space-y-2.5">
              <div className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Goal Description</div>
              <div className="text-sm font-bold text-slate-800">{selectedGoalForProgress.title}</div>
              <div className="grid grid-cols-2 gap-4 pt-2.5 border-t border-slate-200/60">
                <div>
                  <span className="text-[9px] uppercase tracking-widest font-bold text-slate-400 block">UoM Strategy</span>
                  <span className="text-xs font-semibold text-slate-600">{selectedGoalForProgress.uom}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-widest font-bold text-slate-400 block">Target Metric</span>
                  <span className="text-xs font-bold text-slate-800">{selectedGoalForProgress.target}</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleUpdateProgress} className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                  Current Quarterly Achievement Value
                </label>
                <input
                  type="number"
                  className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition text-sm font-bold"
                  placeholder={`Enter value (Current: ${selectedGoalForProgress.achievement || 0})`}
                  value={newAchievement}
                  onChange={e => setNewAchievement(e.target.value)}
                  min="0"
                  required
                />
                <span className="text-[10px] text-slate-400 mt-1.5 block">
                  * The execution spectrum dynamically adjusts based on the registered UoM Strategy: <strong>{selectedGoalForProgress.uom}</strong>.
                </span>
              </div>

              <div className="flex gap-3 justify-end pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedGoalForProgress(null)}
                  className="cursor-pointer bg-slate-50 hover:bg-slate-100 text-slate-600 font-semibold px-5 py-2.5 rounded-xl transition text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={progressModalLoading}
                  className="cursor-pointer bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-2.5 rounded-xl transition text-xs shadow-md shadow-emerald-600/10 flex items-center gap-2"
                >
                  {progressModalLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span>Save Progress</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}