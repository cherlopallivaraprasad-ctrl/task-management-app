import React, { useState } from 'react';
import {
  Sliders,
  Database,
  RotateCcw,
  ShieldCheck,
  Server,
  CheckCircle2,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const AdminSettings = () => {
  const toast = useToast();
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [resetting, setResetting] = useState(false);

  const handleResetSeed = async () => {
    try {
      setResetting(true);
      const res = await api.post('/admin/reset-seed');
      if (res.data.success) {
        toast.success('Database demo data has been freshly re-seeded!');
        setResetModalOpen(false);
      }
    } catch (err) {
      toast.error('Failed to reset demo data.');
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in">
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <Sliders className="w-7 h-7 text-indigo-400" />
          <span>System Settings</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Server configurations, database maintenance, and developer utilities
        </p>
      </div>

      {/* System Health Card */}
      <div className="bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800">
          <Server className="w-5 h-5 text-indigo-400" />
          <h3 className="font-bold text-white text-base">Backend & Engine Status</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-slate-400 font-medium">REST API Gateway</span>
            <p className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Online (Port 5000)</span>
            </p>
          </div>

          <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-slate-400 font-medium">Database Connection</span>
            <p className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>MongoDB Connected</span>
            </p>
          </div>

          <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-slate-400 font-medium">Authentication Protocol</span>
            <p className="text-sm font-bold text-slate-200">
              JWT Bearer + bcryptjs (7-day tokens)
            </p>
          </div>

          <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-slate-400 font-medium">Frontend Client</span>
            <p className="text-sm font-bold text-slate-200">
              React 18 + Vite + Tailwind CSS
            </p>
          </div>
        </div>
      </div>

      {/* Database Reset Tool */}
      <div className="bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800">
          <Database className="w-5 h-5 text-amber-400" />
          <h3 className="font-bold text-white text-base">Development Seed Tools</h3>
        </div>

        <div className="p-5 rounded-2xl bg-amber-400/5 border border-amber-400/20 space-y-3">
          <h4 className="font-bold text-sm text-amber-300 flex items-center gap-2">
            <RotateCcw className="w-4 h-4" />
            <span>Reset Demo Database</span>
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Replaces existing data with the default sample suite (Admin, Demo User, team members, and 13 sample tasks with varied categories and deadlines).
          </p>

          <button
            onClick={() => setResetModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition shadow-sm"
          >
            Reset to Sample Seed Data
          </button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        onConfirm={handleResetSeed}
        loading={resetting}
        title="Reset Demo Data"
        message="This will overwrite current users and tasks with default demo accounts and sample tasks. Are you sure you want to proceed?"
        confirmText="Confirm Reset"
        type="warning"
      />
    </div>
  );
};

export default AdminSettings;
