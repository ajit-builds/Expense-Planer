import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { NotificationProvider } from '../../context/NotificationContext';

const Layout = () => {
  // Sidebar collapsed state persisted in localStorage
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('expenseTracker_sidebar_collapsed') === 'true';
  });

  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('expenseTracker_sidebar_collapsed', isCollapsed);
  }, [isCollapsed]);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <NotificationProvider>
      <div className="flex h-screen bg-slate-50/70 overflow-hidden font-sans">
        {/* Collapsible Sidebar */}
        <Sidebar
          isCollapsed={isCollapsed}
          toggleCollapse={toggleCollapse}
          mobileOpen={mobileOpen}
          closeMobile={() => setMobileOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Navbar toggleMobile={() => setMobileOpen(true)} />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </NotificationProvider>
  );
};

export default Layout;
