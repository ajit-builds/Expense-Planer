import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Menu, Bell, User, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import NotificationPanel from '../Notifications/NotificationPanel';

const PAGE_TITLES = {
  '/dashboard': 'Dashboard Overview',
  '/expenses': 'Expense History',
  '/expenses/new': 'Add New Expense',
  '/summary': 'Monthly Summary',
  '/profile': 'User Profile',
};

const Navbar = ({ toggleMobile }) => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const location = useLocation();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Dynamic page title based on current path
  const currentPath = location.pathname;
  let pageTitle = PAGE_TITLES[currentPath];
  if (!pageTitle) {
    if (currentPath.startsWith('/expenses/edit')) pageTitle = 'Edit Expense';
    else if (currentPath.startsWith('/expenses/')) pageTitle = 'Expense Details';
    else pageTitle = 'Expense Tracker';
  }

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-3.5 flex items-center justify-between h-16">
      {/* Left: Mobile hamburger & Page Title */}
      <div className="flex items-center space-x-3">
        <button
          onClick={toggleMobile}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 focus:outline-none"
          aria-label="Toggle Mobile Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-tight">
            {pageTitle}
          </h2>
          <span className="hidden sm:block text-[11px] font-medium text-slate-400 leading-none mt-0.5">
            Personal Finance Workspace
          </span>
        </div>
      </div>

      {/* Right: Notifications & User Profile */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* Notification Bell with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl relative transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-indigo-600 rounded-full ring-2 ring-white animate-pulse"></span>
            )}
          </button>

          <NotificationPanel
            isOpen={isNotifOpen}
            onClose={() => setIsNotifOpen(false)}
          />
        </div>

        <div className="h-5 w-px bg-slate-200"></div>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center space-x-2.5 p-1 sm:px-2 sm:py-1 rounded-xl hover:bg-slate-100 transition-colors text-left"
          >
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-xs border border-slate-700">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="hidden md:block">
              <div className="text-xs font-bold text-slate-900 leading-tight">
                {user?.name || 'User'}
              </div>
              <div className="text-[10px] text-slate-400 font-medium leading-tight">
                {user?.email || ''}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {/* User Menu Popover */}
          {isUserMenuOpen && (
            <div className="absolute right-0 top-12 w-48 bg-white rounded-xl border border-slate-200 shadow-xl py-1 z-50 animate-popover">
              <div className="px-4 py-2.5 border-b border-slate-100 md:hidden">
                <p className="text-xs font-bold text-slate-900">{user?.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
              </div>
              <Link
                to="/profile"
                onClick={() => setIsUserMenuOpen(false)}
                className="flex items-center space-x-2 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <User className="w-4 h-4 text-slate-400" />
                <span>My Profile</span>
              </Link>
              <button
                onClick={() => {
                  setIsUserMenuOpen(false);
                  logout();
                }}
                className="w-full flex items-center space-x-2 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 border-t border-slate-100"
              >
                <LogOut className="w-4 h-4 text-rose-500" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
