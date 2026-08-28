import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Calendar,
  Clock,
  CheckCircle2,
  Tag,
  AlertTriangle,
  User,
  Share2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import CategoryBadge from '../../components/common/CategoryBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchTask = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/tasks/${id}`);
      if (res.data.success) {
        setTask(res.data.task);
      }
    } catch (err) {
      toast.error('Task not found.');
      navigate('/tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTask();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    try {
      const res = await api.patch(`/tasks/${id}/status`, { status: newStatus });
      if (res.data.success) {
        setTask((prev) => ({ ...prev, status: newStatus }));
        toast.success(`Task marked as ${newStatus}`);

        if (newStatus === 'Completed') {
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.6 },
          });
        }
      }
    } catch (err) {
      toast.error('Failed to change status.');
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      const res = await api.delete(`/tasks/${id}`);
      if (res.data.success) {
        toast.success('Task deleted successfully.');
        navigate('/tasks');
      }
    } catch (err) {
      toast.error('Failed to delete task.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading task details..." />;
  }

  if (!task) return null;

  const dueDate = new Date(task.dueDate);
  const now = new Date();
  const diffTime = dueDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const isOverdue = diffDays < 0 && task.status !== 'Completed';

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in">
      {/* Top action navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/tasks"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Tasks</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            to={`/tasks/edit/${task._id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition shadow-xs"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Edit</span>
          </Link>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 border border-rose-100 hover:bg-rose-100 transition shadow-xs"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Main Task Detail Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8">
        {/* Header with Title & Badges */}
        <div>
          <div className="flex flex-wrap items-center gap-2.5 mb-4">
            <CategoryBadge category={task.category} />
            <PriorityBadge priority={task.priority} />
            <StatusBadge status={task.status} />

            {isOverdue && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                <AlertTriangle className="w-3 h-3" />
                <span>Overdue by {Math.abs(diffDays)} day{Math.abs(diffDays) > 1 ? 's' : ''}</span>
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
            {task.title}
          </h1>
        </div>

        {/* Status Action Switcher */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Current Task Status</p>
            <p className="text-sm font-semibold text-slate-800 mt-0.5">
              {task.status === 'Completed'
                ? 'Task is marked as completed 🎉'
                : 'Click below to advance status:'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleStatusChange('Pending')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                task.status === 'Pending'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => handleStatusChange('In Progress')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                task.status === 'In Progress'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              In Progress
            </button>
            <button
              onClick={() => handleStatusChange('Completed')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                task.status === 'Completed'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              Mark Completed
            </button>
          </div>
        </div>

        {/* Task Description */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Description & Details
          </h3>
          <div className="prose prose-slate max-w-none text-slate-700 text-sm leading-relaxed bg-slate-50/50 p-5 rounded-2xl border border-slate-100 whitespace-pre-wrap">
            {task.description || 'No additional description provided for this task.'}
          </div>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-slate-100">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <Calendar className="w-4 h-4" />
              <span className="text-[11px] font-bold uppercase tracking-wider">Due Date</span>
            </div>
            <p className="text-sm font-bold text-slate-800">
              {dueDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-[11px] font-bold uppercase tracking-wider">Created</span>
            </div>
            <p className="text-sm font-bold text-slate-800">
              {new Date(task.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-[11px] font-bold uppercase tracking-wider">Last Updated</span>
            </div>
            <p className="text-sm font-bold text-slate-800">
              {new Date(task.updatedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <User className="w-4 h-4" />
              <span className="text-[11px] font-bold uppercase tracking-wider">Assignee</span>
            </div>
            <p className="text-sm font-bold text-slate-800 truncate">
              {task.userId?.name || 'Current User'}
            </p>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Task"
        message={`Are you sure you want to delete "${task.title}"?`}
        confirmText="Delete Task"
        type="danger"
      />
    </div>
  );
};

export default TaskDetails;
