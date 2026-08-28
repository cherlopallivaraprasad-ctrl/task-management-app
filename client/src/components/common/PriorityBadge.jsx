import React from 'react';
import { ArrowDown, ArrowRight, ArrowUp, Flame } from 'lucide-react';

const PriorityBadge = ({ priority, size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-semibold';

  switch (priority) {
    case 'Urgent':
      return (
        <span className={`inline-flex items-center gap-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 ${sizeClasses}`}>
          <Flame className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
          <span>Urgent</span>
        </span>
      );
    case 'High':
      return (
        <span className={`inline-flex items-center gap-1 rounded-full bg-orange-50 text-orange-700 border border-orange-200 ${sizeClasses}`}>
          <ArrowUp className="w-3.5 h-3.5 text-orange-600" />
          <span>High</span>
        </span>
      );
    case 'Medium':
      return (
        <span className={`inline-flex items-center gap-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200 ${sizeClasses}`}>
          <ArrowRight className="w-3.5 h-3.5 text-sky-600" />
          <span>Medium</span>
        </span>
      );
    case 'Low':
    default:
      return (
        <span className={`inline-flex items-center gap-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 ${sizeClasses}`}>
          <ArrowDown className="w-3.5 h-3.5 text-slate-500" />
          <span>Low</span>
        </span>
      );
  }
};

export default PriorityBadge;
