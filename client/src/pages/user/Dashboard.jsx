import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CheckSquare,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Plus,
  ArrowRight,
  Calendar,
  Layers,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import DashboardCard from '../../components/common/DashboardCard';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import CategoryBadge from '../../components/common/CategoryBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

const Dashboard = () => {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
    completedTasks: 0,
    overdueTasks: 0,
    completionRate: 0,
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/tasks/stats/summary');
      if (res.data.success) {
        setStats(res.data.stats);
        setRecentTasks(res.data.recentTasks || []);
        setUpcomingDeadlines(res.data.upcomingDeadlines || []);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      toast.error('Failed to load dashboard statistics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleQuickStatusChange = async (taskId, currentStatus) => {
    const nextStatus =
      currentStatus === 'Completed'
        ? 'Pending'
        : currentStatus === 'Pending'
        ? 'In Progress'
        : 'Completed';

    try {
      const res = await api.patch(`/tasks/${taskId}/status`, { status: nextStatus });
      if (res.data.success) {
        toast.success(`Task moved to ${nextStatus}`);
        fetchDashboardData();
      }
    } catch (error) {
      toast.error('Failed to update task status.');
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading dashboard metrics..." />;
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-brand-700 via-brand-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur border border-white/20 text-xs font-semibold text-brand-100 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{getGreeting()}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Welcome back, {user?.name}! 👋
            </h2>
            <p className="text-brand-100 text-sm mt-1 max-w-xl">
              You have <strong className="text-white font-bold">{stats.pendingTasks + stats.inProgressTasks}</strong> active tasks requiring your attention today.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/tasks/create"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-brand-700 font-bold text-sm hover:bg-brand-50 active:scale-95 transition shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>Create Task</span>
            </Link>
          </div>
        </div>

        {/* Decorative circle */}
        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* 5 Statistics Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <DashboardCard
          title="Total Tasks"
          value={stats.totalTasks}
          icon={Layers}
          color="indigo"
          subtitle="All assigned tasks"
          onClick={() => navigate('/tasks')}
        />
        <DashboardCard
          title="Pending"
          value={stats.pendingTasks}
          icon={Clock}
          color="amber"
          subtitle="Not yet started"
          onClick={() => navigate('/tasks?status=Pending')}
        />
        <DashboardCard
          title="In Progress"
          value={stats.inProgressTasks}
          icon={Flame}
          color="blue"
          subtitle="Currently working"
          onClick={() => navigate('/tasks?status=In Progress')}
        />
        <DashboardCard
          title="Completed"
          value={stats.completedTasks}
          icon={CheckCircle2}
          color="emerald"
          subtitle="Finished tasks"
          onClick={() => navigate('/tasks?status=Completed')}
        />
        <DashboardCard
          title="Overdue"
          value={stats.overdueTasks}
          icon={AlertTriangle}
          color="rose"
          subtitle="Past due deadline"
          onClick={() => navigate('/tasks?dueDateFilter=overdue')}
        />
      </div>

      {/* Progress & Deadlines Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Progress Bar Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-base">Overall Completion</h3>
              <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full">
                {stats.completionRate}%
              </span>
            </div>

            <p className="text-xs text-slate-500 mb-6">
              Track your task completion progress toward monthly sprint objectives.
            </p>

            {/* Custom Circular / Linear progress indicator */}
            <div className="space-y-4">
              <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden p-0.5 border border-slate-200">
                <div
                  className="bg-gradient-to-r from-brand-500 to-emerald-500 h-full rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${Math.max(stats.completionRate, 4)}%` }}
                />
              </div>

              <div className="grid grid-cols-3 gap-2 text-center pt-2">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-xs text-slate-400 font-medium">Done</p>
                  <p className="text-base font-bold text-emerald-600">{stats.completedTasks}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-xs text-slate-400 font-medium">Active</p>
                  <p className="text-base font-bold text-blue-600">{stats.pendingTasks + stats.inProgressTasks}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-xs text-slate-400 font-medium">Overdue</p>
                  <p className="text-base font-bold text-rose-600">{stats.overdueTasks}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <Link
              to="/tasks"
              className="w-full inline-flex items-center justify-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700"
            >
              <span>Manage all tasks</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Upcoming Deadlines Widget */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-brand-600" />
                <h3 className="font-bold text-slate-900 text-base">Upcoming Deadlines</h3>
              </div>
              <Link to="/calendar" className="text-xs font-bold text-brand-600 hover:text-brand-700">
                View Calendar →
              </Link>
            </div>

            {upcomingDeadlines.length === 0 ? (
              <p className="text-xs text-slate-500 py-8 text-center">No upcoming deadlines within the immediate horizon. Good job!</p>
            ) : (
              <div className="space-y-3">
                {upcomingDeadlines.map((task) => {
                  const dueDate = new Date(task.dueDate);
                  const isToday = new Date().toDateString() === dueDate.toDateString();

                  return (
                    <div
                      key={task._id}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50/80 border border-slate-100 hover:border-slate-200 transition"
                    >
                      <div className="min-w-0 flex-1 pr-3">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/tasks/${task._id}`}
                            className="text-sm font-semibold text-slate-800 hover:text-brand-600 truncate"
                          >
                            {task.title}
                          </Link>
                          <CategoryBadge category={task.category} showIcon={false} />
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {isToday ? (
                            <span className="font-bold text-amber-600">Due Today</span>
                          ) : (
                            `Due ${dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                          )}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <PriorityBadge priority={task.priority} size="sm" />
                        <button
                          onClick={() => handleQuickStatusChange(task._id, task.status)}
                          title="Click to advance status"
                          className="text-xs px-2 py-1 rounded-lg bg-white border border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition font-medium"
                        >
                          {task.status}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Showing top upcoming tasks</span>
            <Link to="/tasks/create" className="font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1">
              <Plus className="w-3.5 h-3.5" />
              <span>Add task</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Tasks Section */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Recent Tasks</h3>
            <p className="text-xs text-slate-500">Recently created or modified items</p>
          </div>
          <Link
            to="/tasks"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700"
          >
            <span>View All ({stats.totalTasks})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentTasks.length === 0 ? (
          <EmptyState
            title="You don't have any tasks yet"
            description="Get started by creating your first task to track deadlines and priorities."
            actionLabel="Create Your First Task"
            actionTo="/tasks/create"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                <tr>
                  <th className="px-4 py-3 rounded-l-xl">Task</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Priority</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Due Date</th>
                  <th className="px-4 py-3 text-right rounded-r-xl">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentTasks.map((t) => (
                  <tr key={t._id} className="hover:bg-slate-50/80 transition group">
                    <td className="px-4 py-3.5">
                      <Link
                        to={`/tasks/${t._id}`}
                        className="font-semibold text-slate-800 hover:text-brand-600 block truncate max-w-xs sm:max-w-md"
                      >
                        {t.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3.5">
                      <CategoryBadge category={t.category} />
                    </td>
                    <td className="px-4 py-3.5">
                      <PriorityBadge priority={t.priority} size="sm" />
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={t.status} size="sm" />
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-500 whitespace-nowrap">
                      {new Date(t.dueDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleQuickStatusChange(t._id, t.status)}
                          title="Toggle Status"
                          className="px-2 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-brand-50 hover:text-brand-700 transition"
                        >
                          {t.status === 'Completed' ? 'Reopen' : 'Complete'}
                        </button>
                        <Link
                          to={`/tasks/${t._id}`}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-slate-100 transition"
                          title="View Details"
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
