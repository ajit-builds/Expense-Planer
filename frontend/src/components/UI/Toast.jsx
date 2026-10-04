import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose, duration = 3500 }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const styles = {
    success: 'bg-slate-900 text-white border-slate-700 text-emerald-400',
    warning: 'bg-amber-950 text-amber-100 border-amber-800 text-amber-400',
    error: 'bg-rose-950 text-rose-100 border-rose-800 text-rose-400',
  };

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
    warning: <AlertTriangle className="w-4 h-4 text-amber-400" />,
    error: <XCircle className="w-4 h-4 text-rose-400" />,
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full sm:w-auto">
      <div
        className={`flex items-center space-x-3 px-4 py-3 rounded-xl shadow-xl border text-xs font-semibold animate-popover ${
          styles[type] || styles.success
        }`}
      >
        {icons[type] || icons.success}
        <span className="flex-1 text-slate-100 font-medium">{message}</span>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-0.5 rounded-md"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
