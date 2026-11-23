import React, { createContext, useContext, useState } from 'react';
import { NotificationItem } from '../types';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
}

interface NotificationContextType {
  toasts: Toast[];
  notifications: NotificationItem[];
  addToast: (type: Toast['type'], title: string, message?: string) => void;
  removeToast: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  unreadCount: number;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Shortlisted for Senior Full Stack Engineer',
    message: 'CloudScale Technologies reviewed your AI match score (92%) and moved you to the Shortlisted stage!',
    type: 'application',
    linkUrl: '/candidate/dashboard',
    isRead: false,
    createdAt: '10 minutes ago',
  },
  {
    id: 'notif-2',
    title: 'Coding Assessment Invitation',
    message: 'You have been invited to complete the 60-minute Full Stack Technical Assessment.',
    type: 'assessment',
    linkUrl: '/assessment/q-1',
    isRead: false,
    createdAt: '1 hour ago',
  },
  {
    id: 'notif-3',
    title: 'Subscription Active: Candidate Pro',
    message: 'Your monthly Pro plan has been activated. Enjoy unlimited resume gap analyses and 100 AI queries/day.',
    type: 'billing',
    linkUrl: '/billing',
    isRead: true,
    createdAt: '2 days ago',
  },
];

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const addToast = (type: Toast['type'], title: string, message?: string) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    const newToast: Toast = { id, type, title, message };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <NotificationContext.Provider
      value={{
        toasts,
        notifications,
        addToast,
        removeToast,
        markAsRead,
        markAllAsRead,
        unreadCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};
