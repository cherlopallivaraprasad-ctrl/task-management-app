import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  Plus,
  Grid,
  List,
  Calendar,
  Trash2,
  Edit,
  Eye,
  CheckCircle2,
  Clock,
  ArrowUpDown,
  RotateCcw,
  Tag,
} from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import CategoryBadge from '../../components/common/CategoryBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const categoriesList = ['All', 'Work', 'Personal', 'Development', 'Design', 'Marketing', 'Operations', 'Finance', 'General'];
const prioritiesList = ['All', 'Low', 'Medium', 'High', 'Urgent'];
const statusesList = ['All', 'Pending', 'In Progress', 'Completed'];
const dueDateFilters = [
  { label: 'All Dates', value: 'all' },
  { label: 'Due Today', value: 'today' },
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'Overdue', value: 'overdue' },
];

const MyTasks = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const toast = useToast();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'

  // Filters State
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [status, setStatus] = useState(searchParams.get('status') || 'all');
  const [priority, setPriority] = useState(searchParams.get('priority') || 'all');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [dueDateFilter, setDueDateFilter] = useState(searchParams.get('dueDateFilter') || 'all');
  const [sortBy, setSortBy] = useState('newest');

  // Deletion modal state
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (status !== 'all') params.status = status;
      if (priority !== 'all') params.priority = priority;
      if (category !== 'all') params.category = category;
      if (dueDateFilter !== 'all') params.dueDateFilter = dueDateFilter;
      if (sortBy) params.sortBy = sortBy;

      const res = await api.get('/tasks', { params });
      if (res.data.success) {
        setTasks(res.data.tasks);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to load tasks.');
    } finally {
      setLoading(false);
    }
  }, [search, status, priority, category, dueDateFilter, sortBy, toast]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleResetFilters = () => {
    setSearch('');
    setStatus('all');
    setPriority('all');
    setCategory('all');
    setDueDateFilter('all');
    setSortBy('newest');
    setSearchParams({});
  };

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
    } catch (error) {
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
    } catch (error) {
      toast.error('Failed to delete task.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header & New Task Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Tasks
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Organize, filter, and track all your personal task items
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View mode toggle */}
          <div className="bg-slate-200/70 p-1 rounded-xl flex items-center gap-1 border border-slate-300/60">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg text-xs font-semibold transition ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg text-xs font-semibold transition ${
                viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Card Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>

          <Link
            to="/tasks/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-sm hover:bg-brand-700 active:scale-95 transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Create Task</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Panel */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
        {/* Top Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks by title, description or category..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2 border-t border-slate-100">
          {/* Status filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
            >
              {statusesList.map((st) => (
                <option key={st} value={st === 'All' ? 'all' : st}>
                  {st === 'All' ? 'All Statuses' : st}
                </option>
              ))}
            </select>
          </div>

          {/* Priority filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
            >
              {prioritiesList.map((pr) => (
                <option key={pr} value={pr === 'All' ? 'all' : pr}>
                  {pr === 'All' ? 'All Priorities' : pr}
                </option>
              ))}
            </select>
          </div>

          {/* Category filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
            >
              {categoriesList.map((cat) => (
                <option key={cat} value={cat === 'All' ? 'all' : cat}>
                  {cat === 'All' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Due Date Filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Deadline
            </label>
            <select
              value={dueDateFilter}
              onChange={(e) => setDueDateFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
            >
              {dueDateFilters.map((df) => (
                <option key={df.value} value={df.value}>
                  {df.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Option */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="dueDateAsc">Due Date (Soonest)</option>
              <option value="dueDateDesc">Due Date (Latest)</option>
            </select>
          </div>
        </div>

        {/* Filter tags & Reset Action */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
          <span>
            Found <strong className="text-slate-800 font-bold">{tasks.length}</strong> tasks
          </span>
          <button
            onClick={handleResetFilters}
            className="flex items-center gap-1 text-slate-500 hover:text-brand-600 font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset filters</span>
          </button>
        </div>
      </div>

      {/* Task List / Content View */}
      {loading ? (
        <LoadingSpinner text="Fetching tasks..." />
      ) : tasks.length === 0 ? (
        <EmptyState
          title="No tasks match your filters"
          description="Try modifying or resetting your search keywords or filter criteria."
          actionLabel="Reset Filters"
          onAction={handleResetFilters}
        />
      ) : viewMode === 'table' ? (
        /* TABLE VIEW */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Title & Description</th>
                  <th className="px-4 py-4">Category</th>
                  <th className="px-4 py-4">Priority</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4">Due Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tasks.map((task) => (
                  <tr key={task._id} className="hover:bg-slate-50/80 transition group">
                    <td className="px-6 py-4">
                      <Link
                        to={`/tasks/${task._id}`}
                        className="font-bold text-slate-900 hover:text-brand-600 block text-base leading-snug"
                      >
                        {task.title}
                      </Link>
                      {task.description && (
                        <p className="text-xs text-slate-500 line-clamp-1 mt-0.5 max-w-md">
                          {task.description}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <CategoryBadge category={task.category} />
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <PriorityBadge priority={task.priority} />
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleQuickStatusChange(task._id, task.status)}
                        title="Click to change status"
                        className="transition hover:scale-105"
                      >
                        <StatusBadge status={task.status} />
                      </button>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-xs text-slate-500 font-medium">
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
                          className="p-2 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-slate-100 transition"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/tasks/edit/${task._id}`}
                          className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition"
                          title="Edit Task"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setTaskToDelete(task)}
                          className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 transition"
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
      ) : (
        /* CARD GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <CategoryBadge category={task.category} />
                  <PriorityBadge priority={task.priority} size="sm" />
                </div>

                <Link
                  to={`/tasks/${task._id}`}
                  className="font-bold text-lg text-slate-900 hover:text-brand-600 block line-clamp-2 mb-2 leading-snug"
                >
                  {task.title}
                </Link>

                <p className="text-xs text-slate-500 line-clamp-3 mb-4 leading-relaxed">
                  {task.description || 'No description provided.'}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <button
                    onClick={() => handleQuickStatusChange(task._id, task.status)}
                    title="Click to toggle status"
                  >
                    <StatusBadge status={task.status} size="sm" />
                  </button>
                </div>

                <div className="flex items-center justify-end gap-1 pt-2">
                  <Link
                    to={`/tasks/${task._id}`}
                    className="p-2 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-slate-100 transition"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                  <Link
                    to={`/tasks/edit/${task._id}`}
                    className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition"
                    title="Edit Task"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => setTaskToDelete(task)}
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 transition"
                    title="Delete Task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={!!taskToDelete}
        onClose={() => setTaskToDelete(null)}
        onConfirm={handleDeleteConfirm}
        loading={deleting}
        title="Delete Task"
        message={`Are you sure you want to permanently delete "${taskToDelete?.title}"? This action cannot be reverted.`}
        confirmText="Delete Task"
        type="danger"
      />
    </div>
  );
};

export default MyTasks;
