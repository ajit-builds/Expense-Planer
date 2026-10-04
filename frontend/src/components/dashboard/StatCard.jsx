import React from 'react';

const StatCard = ({ title, value, subtitle, icon: Icon, variant = 'default', badge }) => {
  if (variant === 'primary') {
    return (
      <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-lg border border-slate-800 flex flex-col justify-between relative overflow-hidden">
        <div className="flex items-center justify-between z-10">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            {title}
          </span>
          {Icon && (
            <div className="p-2 rounded-xl bg-slate-800 text-indigo-400">
              <Icon className="w-5 h-5" />
            </div>
          )}
        </div>
        <div className="mt-4 z-10">
          <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {value}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-400 mt-1 font-medium">{subtitle}</p>
          )}
        </div>
        {/* Background ambient glow */}
        <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-indigo-600/20 rounded-full blur-xl pointer-events-none"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          {title}
        </span>
        {Icon && (
          <div className="p-2 rounded-xl bg-slate-100 text-slate-600">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>
      <div className="mt-3">
        <div className="flex items-baseline justify-between">
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {value}
          </div>
          {badge && (
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
              {badge}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-xs text-slate-500 mt-1 font-medium">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

export default StatCard;
