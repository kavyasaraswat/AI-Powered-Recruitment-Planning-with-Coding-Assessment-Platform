import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import {
  User,
  Lock,
  Bell,
  Moon,
  Sun,
  Shield,
  Save,
  Trash2,
  CheckCircle2,
  Key
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { addToast } = useNotification();

  const [name, setName] = useState(user?.name || 'Aditya Sharma');
  const [email, setEmail] = useState(user?.email || 'aditya@hiregenius.ai');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [interviewInvites, setInterviewInvites] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      updateUser({ name, email });
      addToast('success', 'Settings Saved', 'Profile credentials updated successfully.');
    }, 500);
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      addToast('error', 'Validation Error', 'Please enter your current and new passwords.');
      return;
    }
    setCurrentPassword('');
    setNewPassword('');
    addToast('success', 'Password Updated', 'Your security credentials have been updated.');
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Account & Security Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Manage your personal details, login credentials, and notification preferences.
        </p>
      </div>

      {/* Profile Form */}
      <div className="p-6 sm:p-8 rounded-2xl bg-dark-surface border border-dark-border shadow-card space-y-6">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <User className="w-4 h-4 text-brand-400" />
          Personal Credentials
        </h3>

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-dark-bg border border-dark-border text-xs text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-dark-bg border border-dark-border text-xs text-white focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-brand-600 hover:bg-brand-500 shadow-glow-brand transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save Profile Details'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Security & Password */}
      <div className="p-6 sm:p-8 rounded-2xl bg-dark-surface border border-dark-border shadow-card space-y-6">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Key className="w-4 h-4 text-ai-400" />
          Change Password
        </h3>

        <form onSubmit={handlePasswordUpdate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl bg-dark-bg border border-dark-border text-xs text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl bg-dark-bg border border-dark-border text-xs text-white focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-dark-elevated hover:bg-dark-elevated/80 border border-dark-border transition-colors flex items-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>Update Password</span>
            </button>
          </div>
        </form>
      </div>

      {/* Notification Preferences */}
      <div className="p-6 sm:p-8 rounded-2xl bg-dark-surface border border-dark-border shadow-card space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Bell className="w-4 h-4 text-emerald-400" />
          Notification Preferences
        </h3>

        <div className="space-y-3 pt-2">
          <label className="flex items-center justify-between p-3.5 rounded-xl bg-dark-bg border border-dark-border cursor-pointer">
            <div>
              <span className="font-semibold text-white text-xs block">Email Application Updates</span>
              <span className="text-[11px] text-slate-400">Receive alerts when recruiters change your stage or review your AI score.</span>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 rounded-xl bg-dark-bg border border-dark-border cursor-pointer">
            <div>
              <span className="font-semibold text-white text-xs block">Coding Assessment Invitations</span>
              <span className="text-[11px] text-slate-400">Immediate notifications when recruiters assign you automated coding tests.</span>
            </div>
            <input
              type="checkbox"
              checked={interviewInvites}
              onChange={(e) => setInterviewInvites(e.target.checked)}
              className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
            />
          </label>
        </div>
      </div>
    </div>
  );
};
