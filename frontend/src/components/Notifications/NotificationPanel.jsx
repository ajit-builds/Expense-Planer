import React, { useRef, useEffect } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { Bell, CheckCheck, Inbox, X, Info, CheckCircle2, AlertTriangle } from 'lucide-react';

const formatTimeAgo = (dateString) => {
  if (!dateString) return 'Just now';
  const diffSec = Math.floor((new Date() - new Date(dateString)) / 1000);
  if (diffSec < 60) return 'Just now';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  return `${Math.floor(diffSec / 86400)}d ago`;
};

const NotificationPanel = ({ isOpen, onClose }) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const panelRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={panelRef}
      className="absolute right-0 top-12 z-50 w-80 sm:w-96 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-popover"
    >
      {/* Header */}
      <div className="px-4 py-3.5 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bell className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-indigo-600 text-[10px] font-bold text-white">
              {unreadCount} new
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-[11px] font-medium text-slate-300 hover:text-white flex items-center space-x-1"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark all read</span>
            </button>
          )}
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
        {notifications.length === 0 ? (
          <div className="py-10 px-4 text-center text-slate-400 flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-2">
              <Inbox className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-sm font-semibold text-slate-700">You're all caught up.</p>
            <p className="text-xs text-slate-400 mt-0.5">No recent notifications</p>
          </div>
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
              onClick={() => markAsRead(item.id)}
              className={`p-3.5 flex items-start space-x-3 transition-colors cursor-pointer ${
                item.read ? 'bg-white hover:bg-slate-50/70' : 'bg-indigo-50/40 hover:bg-indigo-50/70'
              }`}
            >
              <div className="mt-0.5 flex-shrink-0">
                {item.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : item.type === 'warning' ? (
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                ) : (
                  <Info className="w-4 h-4 text-indigo-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className={`text-xs font-semibold ${item.read ? 'text-slate-700' : 'text-slate-900'}`}>
                    {item.title}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {formatTimeAgo(item.createdAt)}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                  {item.message}
                </p>
              </div>
              {!item.read && (
                <span className="w-2 h-2 rounded-full bg-indigo-600 flex-shrink-0 mt-1.5"></span>
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 text-center">
        <span className="text-[11px] text-slate-400 font-medium">
          Personal Expense Tracker • System Alerts
        </span>
      </div>
    </div>
  );
};

export default NotificationPanel;
