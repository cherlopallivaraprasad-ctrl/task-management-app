import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner = ({ text = 'Loading...', size = 'md', fullScreen = false }) => {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const content = (
    <div className="flex flex-col items-center justify-center gap-3 p-6 text-slate-500">
      <Loader2 className={`${sizeMap[size] || sizeMap.md} animate-spin text-brand-600`} />
      {text && <p className="text-sm font-medium animate-pulse">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-slate-50/80 backdrop-blur-sm z-50 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};

export const SkeletonCard = () => (
  <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm animate-pulse space-y-4">
    <div className="flex justify-between items-center">
      <div className="h-4 bg-slate-200 rounded w-24"></div>
      <div className="h-5 bg-slate-200 rounded-full w-16"></div>
    </div>
    <div className="h-5 bg-slate-200 rounded w-3/4"></div>
    <div className="h-4 bg-slate-200 rounded w-full"></div>
    <div className="h-4 bg-slate-200 rounded w-1/2"></div>
    <div className="pt-2 flex justify-between items-center border-t border-slate-100">
      <div className="h-4 bg-slate-200 rounded w-20"></div>
      <div className="h-6 bg-slate-200 rounded w-14"></div>
    </div>
  </div>
);

export default LoadingSpinner;
