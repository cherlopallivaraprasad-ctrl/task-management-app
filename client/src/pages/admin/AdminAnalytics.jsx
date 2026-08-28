import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Award,
  CheckCircle2,
  Clock,
  Layers,
  ArrowUpRight,
  PieChart as PieIcon,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  PieChart,
  Pie,
  Legend,
} from 'recharts';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminAnalytics = () => {
  const toast = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await api.get('/admin/stats');
        if (res.data.success) {
          setData(res.data);
        }
      } catch (err) {
        toast.error('Failed to load system analytics.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading || !data) {
    return <LoadingSpinner text="Crunching analytics data..." />;
  }

  const { stats, charts } = data;
  const CATEGORY_COLORS = ['#6366f1', '#ec4899', '#a855f7', '#14b8a6', '#10b981', '#3b82f6', '#f59e0b', '#64748b'];

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <BarChart3 className="w-7 h-7 text-indigo-400" />
          <span>Detailed Task Analytics</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Deep-dive into team throughput, workload distribution, and completion metrics
        </p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
            <span>Overall Efficiency</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-4xl font-black text-white">{stats.completionRate}%</p>
          <p className="text-xs text-slate-500">
            {stats.completedTasks} completed out of {stats.totalTasks} total tasks logged.
          </p>
        </div>

        <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
            <span>Overdue Impact</span>
            <Clock className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-4xl font-black text-rose-400">
            {stats.totalTasks > 0 ? Math.round((stats.overdueTasks / stats.totalTasks) * 100) : 0}%
          </p>
          <p className="text-xs text-slate-500">
            {stats.overdueTasks} tasks require urgent deadline adjustments.
          </p>
        </div>

        <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
            <span>Avg Tasks / User</span>
            <Layers className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-4xl font-black text-indigo-400">
            {stats.totalUsers > 0 ? (stats.totalTasks / stats.totalUsers).toFixed(1) : 0}
          </p>
          <p className="text-xs text-slate-500">
            Average workload distributed across active team members.
          </p>
        </div>
      </div>

      {/* Category Breakdown Bar Chart */}
      <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="font-bold text-white text-base">Tasks by Functional Category</h3>
            <p className="text-xs text-slate-400">Work volume allocated by department/discipline</p>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={charts.tasksByCategory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="category" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
              />
              <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                {charts.tasksByCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Performers Table */}
      <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="font-bold text-white text-base">User Productivity Leaderboard</h3>
            <p className="text-xs text-slate-400">Top contributors by completed objectives</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900 text-xs font-bold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-6 py-3 rounded-l-xl">User</th>
                <th className="px-4 py-3">Total Tasks</th>
                <th className="px-4 py-3">Completed</th>
                <th className="px-4 py-3">Completion Rate</th>
                <th className="px-6 py-3 text-right rounded-r-xl">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {charts.topUsers.map((u) => {
                const rate = u.taskCount > 0 ? Math.round((u.completedCount / u.taskCount) * 100) : 0;
                return (
                  <tr key={u._id} className="hover:bg-slate-900/60 transition">
                    <td className="px-6 py-4 font-bold text-white">
                      {u.name}
                      <span className="block text-xs font-normal text-slate-400">{u.email}</span>
                    </td>
                    <td className="px-4 py-4 font-bold text-slate-200">{u.taskCount}</td>
                    <td className="px-4 py-4 font-bold text-emerald-400">{u.completedCount}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-slate-800 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-emerald-500 h-full rounded-full"
                            style={{ width: `${rate}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-slate-300">{rate}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 uppercase">
                        {u.role}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
