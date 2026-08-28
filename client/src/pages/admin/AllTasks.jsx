import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  Search,
  Filter,
  Plus,
  Trash2,
  Edit,
  Eye,
  Calendar,
  User,
  RotateCcw,
  Clock,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import CategoryBadge from '../../components/common/CategoryBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const AllTasks = () => {
  const toast = useToast();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [priority, setPriority] = useState('all');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Deletion modal
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const params = { all: 'true' };
      if (search.trim()) params.search = search.trim();
      if (status !== 'all') params.status = status;
      if (priority !== 'all') params.priority = priority;
      if (category !== 'all') params.category = category;
      if (sortBy) params.sortBy = sortBy;

      const res = await api.get('/tasks', { params });
      if (res.data.success) {
        setTasks(res.data.tasks);
      }
    } catch (err) {
      toast.error('Failed to load global tasks.');
    } finally {
      setLoading(false);
    }
  }, [search, status, priority, category, sortBy, toast]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

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
        toast.success(`Task status updated to ${nextStatus}`);
        setTasks((prev) =>
          prev.map((t) => (t._id === taskId ? { ...t, status: nextStatus } : t))
        );
      }
    } catch (err) {
      toast.error('Failed to update status.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!taskToDelete) return;
    try {
      setDeleting(true);
      const res = await api.delete(`/tasks/${taskToDelete._id}`);
      if (res.data.success) {
        toast.success('Task deleted successfully.');
        setTasks((prev) => prev.filter((t) => t._id !== taskToDelete._id));
        setTaskToDelete(null);
      }
    } catch (err) {
      toast.error('Failed to delete task.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Layers className="w-7 h-7 text-indigo-400" />
            <span>All System Tasks</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Global view and management of all tasks created across every user account
          </p>
        </div>

        <Link
          to="/tasks/create"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="bg-slate-950 p-5 rounded-3xl border border-slate-800 shadow-sm space-y-3">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search across all tasks by title, description or category..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-slate-800">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 focus:outline-none"
            >
              <option value="all">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 focus:outline-none"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="dueDateAsc">Due Date (Soonest)</option>
              <option value="dueDateDesc">Due Date (Latest)</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearch('');
                setStatus('all');
                setPriority('all');
                setCategory('all');
                setSortBy('newest');
              }}
              className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Universal Tasks Table */}
      {loading ? (
        <LoadingSpinner text="Fetching all system tasks..." />
      ) : (
        <div className="bg-slate-950 rounded-3xl border border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Task Details</th>
                  <th className="px-4 py-4">Assignee / Owner</th>
                  <th className="px-4 py-4">Category</th>
                  <th className="px-4 py-4">Priority</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4">Due Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {tasks.map((task) => (
                  <tr key={task._id} className="hover:bg-slate-900/60 transition">
                    <td className="px-6 py-4">
                      <Link
                        to={`/tasks/${task._id}`}
                        className="font-bold text-white hover:text-indigo-400 block text-base truncate max-w-xs"
                      >
                        {task.title}
                      </Link>
                      {task.description && (
                        <p className="text-xs text-slate-400 line-clamp-1 max-w-xs mt-0.5">
                          {task.description}
                        </p>
                      )}
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-[10px] font-bold">
                          {task.userId?.name ? task.userId.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <span className="text-xs text-slate-300 font-medium">
                          {task.userId?.name || 'Unknown User'}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap">
                      <CategoryBadge category={task.category} />
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap">
                      <PriorityBadge priority={task.priority} size="sm" />
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleQuickStatusChange(task._id, task.status)}
                        title="Click to toggle status"
                        className="transition hover:scale-105"
                      >
                        <StatusBadge status={task.status} size="sm" />
                      </button>
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap text-xs text-slate-400">
                      {new Date(task.dueDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>

                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          to={`/tasks/${task._id}`}
                          className="p-2 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-900 transition"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/tasks/edit/${task._id}`}
                          className="p-2 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-slate-900 transition"
                          title="Edit Task"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setTaskToDelete(task)}
                          className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-900 transition"
                          title="Delete Task"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={!!taskToDelete}
        onClose={() => setTaskToDelete(null)}
        onConfirm={handleDeleteConfirm}
        loading={deleting}
        title="Delete Task as Admin"
        message={`Are you sure you want to delete "${taskToDelete?.title}"? This task will be removed from the user's workspace permanently.`}
        confirmText="Delete Task"
        type="danger"
      />
    </div>
  );
};

export default AllTasks;
