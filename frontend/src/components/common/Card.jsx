import React from 'react';

const Card = ({ children, title, subtitle, action, className = '' }) => {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-sm p-6 ${className}`}>
      {(title || subtitle || action) && (
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <div>
            {title && <h3 className="text-lg font-semibold text-slate-900">{title}</h3>}
            {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
