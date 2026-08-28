import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, LayoutDashboard } from 'lucide-react';

const AccessDeniedPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="text-center max-w-md bg-slate-950 p-8 sm:p-10 rounded-3xl border border-slate-800 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-6 ring-8 ring-rose-500/10">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Access Denied</h1>
        <p className="text-sm text-slate-400 mb-8 leading-relaxed">
          You do not have administrative privileges to access this control panel. Your attempt has been logged.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-600 text-white font-bold text-sm hover:bg-brand-700 transition"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Return to User Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AccessDeniedPage;
