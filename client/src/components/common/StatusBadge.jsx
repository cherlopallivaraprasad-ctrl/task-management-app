import React from 'react';
import { Clock, Loader2, CheckCircle2 } from 'lucide-react';

const StatusBadge = ({ status, size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-semibold';

  switch (status) {
    case 'Completed':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 ${sizeClasses}`}>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          <span>Completed</span>
        </span>
      );
    case 'In Progress':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/80 ${sizeClasses}`}>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          <span>In Progress</span>
        </span>
      );
    case 'Pending':
    default:
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/80 ${sizeClasses}`}>
          <Clock className="w-3.5 h-3.5 text-amber-500" />
          <span>Pending</span>
        </span>
      );
  }
};

export default StatusBadge;
