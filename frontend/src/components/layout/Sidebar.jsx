import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Receipt,
  CirclePlus,
  ChartPie,
  UserRound,
  LogOut,
  PanelLeft,
  PanelRight,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Tooltip from '../UI/Tooltip';

const Sidebar = ({ isCollapsed, toggleCollapse, mobileOpen, closeMobile }) => {
  const { logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Expenses', path: '/expenses', icon: Receipt },
    { name: 'Add Expense', path: '/expenses/new', icon: CirclePlus },
    { name: 'Summary', path: '/summary', icon: ChartPie },
    { name: 'Profile', path: '/profile', icon: UserRound },
  ];

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          onClick={closeMobile}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
        ></div>
      )}

      {/* Main Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 bg-slate-900 text-slate-200 flex flex-col transition-all duration-300 ease-in-out lg:static border-r border-slate-800 ${
          mobileOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'lg:w-[76px]' : 'lg:w-64'}`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-4 py-4.5 border-b border-slate-800/80 h-16">
          <div className="flex items-center space-x-3 overflow-hidden">
            {/* Logo Mark */}
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white text-lg shadow-md flex-shrink-0">
              ₹
            </div>
            {/* Brand Text (Hidden when collapsed on desktop) */}
            {(!isCollapsed || mobileOpen) && (
              <div className="transition-opacity duration-200 whitespace-nowrap">
                <span className="font-bold text-base tracking-tight text-white block leading-tight">
                  Expense Tracker
                </span>
                <span className="text-[9px] text-indigo-400 font-bold tracking-widest uppercase block leading-tight">
                  PERSONAL FINANCE
                </span>
              </div>
            )}
          </div>

          {/* Mobile Close Button */}
          <button
            onClick={closeMobile}
            className="lg:hidden text-slate-400 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Tooltip
                key={item.path}
                text={item.name}
                enabled={isCollapsed && !mobileOpen}
              >
                <NavLink
                  to={item.path}
                  onClick={closeMobile}
                  className={({ isActive }) =>
                    `w-full flex items-center space-x-3.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-400 hover:bg-slate-800/70 hover:text-slate-100'
                    } ${isCollapsed && !mobileOpen ? 'justify-center px-0' : ''}`
                  }
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {(!isCollapsed || mobileOpen) && (
                    <span className="whitespace-nowrap">{item.name}</span>
                  )}
                </NavLink>
              </Tooltip>
            );
          })}
        </nav>

        {/* Sidebar Footer: Toggle & Logout */}
        <div className="p-3 border-t border-slate-800/80 space-y-2">
          {/* Desktop Toggle Button */}
          <button
            onClick={toggleCollapse}
            className="hidden lg:flex w-full items-center justify-between px-3 py-2 text-xs font-semibold text-slate-400 hover:bg-slate-800/70 hover:text-slate-100 rounded-xl transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <PanelRight className="w-5 h-5 mx-auto text-indigo-400" />
            ) : (
              <>
                <span className="text-slate-400">Collapse sidebar</span>
                <PanelLeft className="w-4 h-4 text-slate-400" />
              </>
            )}
          </button>

          {/* Logout Button */}
          <Tooltip text="Logout" enabled={isCollapsed && !mobileOpen}>
            <button
              onClick={() => {
                closeMobile();
                logout();
              }}
              className={`w-full flex items-center space-x-3.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors ${
                isCollapsed && !mobileOpen ? 'justify-center px-0' : ''
              }`}
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {(!isCollapsed || mobileOpen) && (
                <span className="whitespace-nowrap">Logout</span>
              )}
            </button>
          </Tooltip>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
