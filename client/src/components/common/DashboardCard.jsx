import React from 'react';

const colorThemes = {
  indigo: {
    bg: 'bg-indigo-50/60',
    iconBg: 'bg-indigo-500 text-white',
    text: 'text-indigo-600',
    border: 'hover:border-indigo-200',
  },
  emerald: {
    bg: 'bg-emerald-50/60',
    iconBg: 'bg-emerald-500 text-white',
    text: 'text-emerald-600',
    border: 'hover:border-emerald-200',
  },
  blue: {
    bg: 'bg-blue-50/60',
    iconBg: 'bg-blue-500 text-white',
    text: 'text-blue-600',
    border: 'hover:border-blue-200',
  },
  amber: {
    bg: 'bg-amber-50/60',
    iconBg: 'bg-amber-500 text-white',
    text: 'text-amber-600',
    border: 'hover:border-amber-200',
  },
  rose: {
    bg: 'bg-rose-50/60',
    iconBg: 'bg-rose-500 text-white',
    text: 'text-rose-600',
    border: 'hover:border-rose-200',
  },
};

const DashboardCard = ({
  title,
  value,
  icon: Icon,
  subtitle,
  color = 'indigo',
  badge,
  onClick,
}) => {
  const theme = colorThemes[color] || colorThemes.indigo;

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden bg-white rounded-2xl p-6 border border-slate-200 shadow-sm transition-all duration-200 hover:shadow-md ${
        theme.border
      } ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">{title}</p>
          <h4 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{value}</h4>
        </div>
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${theme.iconBg}`}>
          {Icon && <Icon className="w-6 h-6" />}
        </div>
      </div>

      {(subtitle || badge) && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>{subtitle}</span>
          {badge && (
            <span className="font-semibold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">
              {badge}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardCard;
