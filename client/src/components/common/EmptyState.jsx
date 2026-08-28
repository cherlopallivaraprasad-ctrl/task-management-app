import React from 'react';
import { ClipboardList } from 'lucide-react';
import { Link } from 'react-router-dom';

const EmptyState = ({
  icon: Icon = ClipboardList,
  title = 'No tasks found',
  description = 'You have no tasks matching your current criteria.',
  actionLabel,
  actionTo,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-sm max-w-lg mx-auto my-8">
      <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4 ring-8 ring-brand-50/50">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">{description}</p>
      
      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl font-semibold text-sm bg-brand-600 text-white hover:bg-brand-700 active:scale-95 transition shadow-sm"
        >
          {actionLabel}
        </Link>
      )}

      {actionLabel && onAction && !actionTo && (
        <button
          onClick={onAction}
          className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl font-semibold text-sm bg-brand-600 text-white hover:bg-brand-700 active:scale-95 transition shadow-sm"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
