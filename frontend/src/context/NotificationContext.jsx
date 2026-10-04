import React, { createContext, useContext, useState, useEffect } from 'react';

const NotificationContext = createContext();

const INITIAL_NOTIFICATIONS = [
  {
    id: 'n1',
    title: 'Welcome to Expense Tracker',
    message: 'Your personal finance dashboard is ready.',
    type: 'info',
    read: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'n2',
    title: 'Monthly Summary Updated',
    message: 'Category spending aggregation is up to date for this month.',
    type: 'success',
    read: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
];

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('expenseTracker_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  useEffect(() => {
    localStorage.setItem('expenseTracker_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = (notif) => {
    const newNotif = {
      id: 'n_' + Date.now(),
      title: notif.title || 'Expense Update',
      message: notif.message,
      type: notif.type || 'info',
      read: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, read: true } : item))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};
