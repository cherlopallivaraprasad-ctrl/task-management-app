import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Shield,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  AlertTriangle,
  RotateCcw,
  Loader2,
  Calendar,
  Layers,
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const UserManagement = () => {
  const { user: currentUser } = useAuth();
  const toast = useToast();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals state
  const [viewingUser, setViewingUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Edit Form State
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    role: 'user',
    isActive: true,
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (roleFilter !== 'all') params.role = roleFilter;
      if (statusFilter !== 'all') params.status = statusFilter;

      const res = await api.get('/users', { params });
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (err) {
      toast.error('Failed to load user records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleOpenEdit = (u) => {
    setEditingUser(u);
    setEditFormData({
      name: u.name,
      email: u.email,
      role: u.role,
      isActive: u.isActive,
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      setActionLoading(true);
      const res = await api.put(`/users/${editingUser._id}`, editFormData);
      if (res.data.success) {
        toast.success('User updated successfully!');
        setEditingUser(null);
        fetchUsers();
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update user.';
      toast.error(msg);
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async (u) => {
    if (u._id === currentUser.id) {
      toast.warning('You cannot deactivate your own admin account.');
      return;
    }

    try {
      const newStatus = !u.isActive;
      const res = await api.put(`/users/${u._id}`, { isActive: newStatus });
      if (res.data.success) {
        toast.success(`User ${newStatus ? 'activated' : 'deactivated'} successfully.`);
        setUsers((prev) =>
          prev.map((item) => (item._id === u._id ? { ...item, isActive: newStatus } : item))
        );
      }
    } catch (err) {
      toast.error('Failed to update status.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingUser) return;

    try {
      setActionLoading(true);
      const res = await api.delete(`/users/${deletingUser._id}`);
      if (res.data.success) {
        toast.success('User and associated tasks deleted successfully.');
        setUsers((prev) => prev.filter((u) => u._id !== deletingUser._id));
        setDeletingUser(null);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete user.';
      toast.error(msg);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Users className="w-7 h-7 text-indigo-400" />
            <span>User Management</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage user accounts, roles, access permissions, and activity status
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-slate-950 p-5 rounded-3xl border border-slate-800 shadow-sm flex flex-col sm:flex-row items-center gap-4">
        <form onSubmit={handleSearchSubmit} className="flex-1 w-full relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
          />
        </form>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 focus:outline-none"
          >
            <option value="all">All Roles</option>
            <option value="user">Users Only</option>
            <option value="admin">Admins Only</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>

          <button
            onClick={() => {
              setSearch('');
              setRoleFilter('all');
              setStatusFilter('all');
              fetchUsers();
            }}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            title="Reset filters"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <LoadingSpinner text="Fetching user directory..." />
      ) : (
        <div className="bg-slate-950 rounded-3xl border border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-4 py-4">Role</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4">Tasks</th>
                  <th className="px-4 py-4">Joined Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {users.map((u) => {
                  const isSelf = u._id === currentUser.id;

                  return (
                    <tr key={u._id} className="hover:bg-slate-900/60 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 text-slate-200 flex items-center justify-center font-bold text-xs overflow-hidden flex-shrink-0">
                            {u.avatar ? (
                              <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" />
                            ) : (
                              u.name.charAt(0).toUpperCase()
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-white truncate flex items-center gap-1.5">
                              <span>{u.name}</span>
                              {isSelf && (
                                <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-1.5 py-0.2 rounded border border-indigo-500/30">
                                  You
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-slate-400 truncate">{u.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            u.role === 'admin'
                              ? 'bg-amber-400/10 text-amber-400 border border-amber-400/20'
                              : 'bg-indigo-400/10 text-indigo-400 border border-indigo-400/20'
                          }`}
                        >
                          <Shield className="w-3 h-3" />
                          <span className="capitalize">{u.role}</span>
                        </span>
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleStatus(u)}
                          disabled={isSelf}
                          title={isSelf ? 'Cannot toggle self' : 'Click to toggle active state'}
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold transition ${
                            u.isActive
                              ? 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 hover:bg-emerald-400/20'
                              : 'bg-rose-400/10 text-rose-400 border border-rose-400/20 hover:bg-rose-400/20'
                          } ${isSelf ? 'cursor-default opacity-80' : 'cursor-pointer'}`}
                        >
                          {u.isActive ? (
                            <>
                              <UserCheck className="w-3 h-3" />
                              <span>Active</span>
                            </>
                          ) : (
                            <>
                              <UserX className="w-3 h-3" />
                              <span>Inactive</span>
                            </>
                          )}
                        </button>
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="font-bold text-white text-xs">{u.taskCount}</span>
                        <span className="text-slate-500 text-xs ml-1">tasks</span>
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap text-xs text-slate-400">
                        {new Date(u.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>

                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setViewingUser(u)}
                            className="p-2 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-900 transition"
                            title="View User Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(u)}
                            className="p-2 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-slate-900 transition"
                            title="Edit User"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          {!isSelf && (
                            <button
                              onClick={() => setDeletingUser(u)}
                              className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-900 transition"
                              title="Delete User"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW USER MODAL */}
      <Modal
        isOpen={!!viewingUser}
        onClose={() => setViewingUser(null)}
        title="User Account Details"
      >
        {viewingUser && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
              <div className="w-14 h-14 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-lg overflow-hidden border">
                {viewingUser.avatar ? (
                  <img src={viewingUser.avatar} alt={viewingUser.name} className="w-full h-full object-cover" />
                ) : (
                  viewingUser.name.charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900">{viewingUser.name}</h4>
                <p className="text-xs text-slate-500">{viewingUser.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-brand-50 text-brand-700 uppercase">
                    {viewingUser.role}
                  </span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded ${
                      viewingUser.isActive
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-rose-50 text-rose-700'
                    }`}
                  >
                    {viewingUser.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block mb-0.5">Created Date</span>
                <strong className="text-slate-800">
                  {new Date(viewingUser.createdAt).toLocaleDateString()}
                </strong>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block mb-0.5">Total Tasks</span>
                <strong className="text-slate-800">{viewingUser.taskCount} tasks</strong>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setViewingUser(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* EDIT USER MODAL */}
      <Modal
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
        title={`Edit User: ${editingUser?.name}`}
      >
        <form onSubmit={handleSaveEdit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={editFormData.name}
              onChange={(e) => setEditFormData((prev) => ({ ...prev, name: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={editFormData.email}
              onChange={(e) => setEditFormData((prev) => ({ ...prev, email: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Role
              </label>
              <select
                value={editFormData.role}
                onChange={(e) => setEditFormData((prev) => ({ ...prev, role: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Account Status
              </label>
              <select
                value={editFormData.isActive ? 'true' : 'false'}
                onChange={(e) =>
                  setEditFormData((prev) => ({ ...prev, isActive: e.target.value === 'true' }))
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
              >
                <option value="true">Active</option>
                <option value="false">Deactivated</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setEditingUser(null)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="px-5 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-700 flex items-center gap-2"
            >
              {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>

      {/* DELETE CONFIRMATION DIALOG */}
      <ConfirmDialog
        isOpen={!!deletingUser}
        onClose={() => setDeletingUser(null)}
        onConfirm={handleDeleteConfirm}
        loading={actionLoading}
        title="Delete User Account"
        message={`Are you sure you want to delete ${deletingUser?.name} (${deletingUser?.email})? All associated tasks belonging to this user will also be permanently removed.`}
        confirmText="Delete User & Tasks"
        type="danger"
      />
    </div>
  );
};

export default UserManagement;
