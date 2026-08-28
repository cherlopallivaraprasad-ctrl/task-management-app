import React from 'react';
import { Tag } from 'lucide-react';

const categoryColors = {
  Development: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  Design: 'bg-pink-50 text-pink-700 border-pink-200',
  Marketing: 'bg-purple-50 text-purple-700 border-purple-200',
  Operations: 'bg-teal-50 text-teal-700 border-teal-200',
  Finance: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Work: 'bg-blue-50 text-blue-700 border-blue-200',
  Personal: 'bg-amber-50 text-amber-700 border-amber-200',
  General: 'bg-slate-100 text-slate-700 border-slate-200',
};

const CategoryBadge = ({ category = 'General', showIcon = true }) => {
  const colorClass = categoryColors[category] || categoryColors.General;

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium border ${colorClass}`}>
      {showIcon && <Tag className="w-3 h-3 opacity-70" />}
      <span>{category}</span>
    </span>
  );
};

export default CategoryBadge;
