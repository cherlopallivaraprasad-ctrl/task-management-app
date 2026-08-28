import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Layers,
  Clock,
  Flame,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  ShieldCheck,
  Activity,
  ArrowRight,
  UserCheck,
  UserX,
  RotateCcw,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminDashboard = () => {
  const toast = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/stats');
      if (res.data.success) {
        setData(res.data);
      }
    } catch (err) {
      toast.error('Failed to load administrative analytics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading || !data) {
    return <LoadingSpinner text="Aggregating system statistics & analytics..." />;
  }

  const { stats, charts } = data;

  const STATUS_COLORS = ['#f59e0b', '#3b82f6', '#10b981'];

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Admin Hero Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>Administrator Control Center</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            System Analytics & Overview
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time aggregate performance metrics across all users and projects
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/users"
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-sm flex items-center gap-1.5"
          >
            <Users className="w-4 h-4" />
            <span>Manage Users ({stats.totalUsers})</span>
          </Link>
          <Link
            to="/admin/tasks"
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition flex items-center gap-1.5"
          >
            <Layers className="w-4 h-4" />
            <span>All Tasks ({stats.totalTasks})</span>
          </Link>
        </div>
      </div>

      {/* Primary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Total Users</p>
            <h3 className="text-3xl font-black text-white">{stats.totalUsers}</h3>
            <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5" />
              <span>{stats.activeUsers} active / {stats.inactiveUsers} inactive</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Total Tasks */}
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Total Tasks</p>
            <h3 className="text-3xl font-black text-white">{stats.totalTasks}</h3>
            <p className="text-[11px] text-indigo-400 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{stats.completionRate}% completion rate</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        {/* Active Tasks (Pending + In Progress) */}
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Active Pipeline</p>
            <h3 className="text-3xl font-black text-white">{stats.pendingTasks + stats.inProgressTasks}</h3>
            <p className="text-[11px] text-amber-400 mt-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{stats.pendingTasks} pending, {stats.inProgressTasks} in progress</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
            <Flame className="w-6 h-6" />
          </div>
        </div>

        {/* Overdue Tasks */}
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Overdue Items</p>
            <h3 className="text-3xl font-black text-white">{stats.overdueTasks}</h3>
            <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Requires immediate follow-up</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-600/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Charts Grid Row 1: Status Donut & Priority Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tasks by Status Chart */}
        <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-white text-base">Tasks by Status</h3>
              <p className="text-xs text-slate-400">Distribution across task workflows</p>
            </div>
            <span className="text-xs font-mono text-slate-400">Total: {stats.totalTasks}</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts.tasksByStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {charts.tasksByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend formatter={(value) => <span className="text-slate-300 text-xs">{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tasks by Priority Bar Chart */}
        <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-white text-base">Tasks by Priority</h3>
              <p className="text-xs text-slate-400">Urgency level breakdown</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.tasksByPriority} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {charts.tasksByPriority.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Grid Row 2: 7-Day Velocity Area Chart & Top Contributors */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeline Area Chart (2 cols on lg) */}
        <div className="lg:col-span-2 bg-slate-950 p-6 rounded-3xl border border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-white text-base">Weekly Task Activity</h3>
              <p className="text-xs text-slate-400">Created vs. Completed velocity (last 7 days)</p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="createdGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="completedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                />
                <Legend formatter={(value) => <span className="text-slate-300 text-xs">{value}</span>} />
                <Area type="monotone" dataKey="created" name="Tasks Created" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#createdGrad)" />
                <Area type="monotone" dataKey="completed" name="Tasks Completed" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#completedGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Active Users */}
        <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div>
                <h3 className="font-bold text-white text-base">Top Users</h3>
                <p className="text-xs text-slate-400">By total task involvement</p>
              </div>
              <Link to="/admin/users" className="text-xs font-bold text-indigo-400 hover:text-indigo-300">
                All Users →
              </Link>
            </div>

            <div className="space-y-3">
              {charts.topUsers.map((u, i) => (
                <div
                  key={u._id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-900 border border-slate-800"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-indigo-900 text-indigo-200 flex items-center justify-center font-bold text-xs">
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">{u.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{u.email}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-xs font-black text-indigo-400">{u.taskCount} tasks</span>
                    <p className="text-[10px] text-emerald-400">{u.completedCount} done</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800">
            <Link
              to="/admin/analytics"
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 transition"
            >
              <span>View Full Analytics Report</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
