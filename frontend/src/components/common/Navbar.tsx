import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import {
  Sparkles,
  Briefcase,
  Code2,
  CreditCard,
  MessageSquareCode,
  Bell,
  LogOut,
  User,
  Shield,
  Layers,
  CheckCircle,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, role, logout, switchDemoRole, isAuthenticated } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotification();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value as 'candidate' | 'recruiter' | 'admin';
    switchDemoRole(newRole);
    if (newRole === 'candidate') navigate('/candidate/dashboard');
    else if (newRole === 'recruiter') navigate('/recruiter/dashboard');
    else if (newRole === 'admin') navigate('/admin/dashboard');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-dark-border/80 bg-dark-bg/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-ai-600 flex items-center justify-center shadow-glow-brand group-hover:scale-105 transition-transform duration-300">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                HireGenius<span className="text-brand-400">.ai</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-brand-500/10 text-brand-400 border border-brand-500/20">
                SaaS v2.0
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <Link
              to="/jobs"
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                isActive('/jobs')
                  ? 'text-white bg-dark-surface border border-brand-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-dark-surface/50'
              }`}
            >
              <Briefcase className="w-4 h-4 text-brand-400" />
              Jobs
            </Link>
            <Link
              to="/assessment/q-1"
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                isActive('/assessment/q-1')
                  ? 'text-white bg-dark-surface border border-brand-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-dark-surface/50'
              }`}
            >
              <Code2 className="w-4 h-4 text-emerald-400" />
              Coding Hub
            </Link>
            <Link
              to="/chat"
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                isActive('/chat')
                  ? 'text-white bg-dark-surface border border-ai-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-dark-surface/50'
              }`}
            >
              <MessageSquareCode className="w-4 h-4 text-ai-400" />
              AI Assistant
            </Link>
            <Link
              to="/pricing"
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                isActive('/pricing')
                  ? 'text-white bg-dark-surface border border-brand-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-dark-surface/50'
              }`}
            >
              <CreditCard className="w-4 h-4 text-amber-400" />
              Pricing
            </Link>
          </nav>
        </div>

        {/* Right Section: Role Simulator, Notifications, User Profile */}
        <div className="flex items-center gap-3">
          {/* Demo Role Fast-Switcher Pill */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-dark-surface border border-dark-border text-xs">
            <Shield className="w-3.5 h-3.5 text-brand-400" />
            <span className="text-slate-400">Role View:</span>
            <select
              value={role || 'candidate'}
              onChange={handleRoleChange}
              className="bg-transparent text-brand-300 font-semibold focus:outline-none cursor-pointer"
              title="Fast role switcher for testing candidate, recruiter, and administrator flows"
            >
              <option value="candidate" className="bg-dark-surface text-slate-100">Candidate (Aditya)</option>
              <option value="recruiter" className="bg-dark-surface text-slate-100">Recruiter (CloudScale)</option>
              <option value="admin" className="bg-dark-surface text-slate-100">Administrator</option>
            </select>
          </div>

          {/* Quick Dashboard Link based on active role */}
          {isAuthenticated && (
            <Link
              to={
                role === 'recruiter'
                  ? '/recruiter/dashboard'
                  : role === 'admin'
                  ? '/admin/dashboard'
                  : '/candidate/dashboard'
              }
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-brand-600/20 text-brand-300 hover:bg-brand-600/30 border border-brand-500/30 transition-colors"
            >
              <Layers className="w-3.5 h-3.5" />
              Dashboard
            </Link>
          )}

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-dark-surface transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-dark-bg animate-pulse" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-dark-surface border border-dark-border shadow-2xl p-4 text-sm z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-dark-border">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-100">Notifications</h3>
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-brand-600 text-white">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-brand-400 hover:text-brand-300"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="mt-2 divide-y divide-dark-border max-h-72 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => markAsRead(notif.id)}
                      className={`p-2.5 rounded-lg transition-colors cursor-pointer ${
                        notif.isRead ? 'hover:bg-dark-elevated/40' : 'bg-brand-500/5 hover:bg-brand-500/10'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className={`font-medium text-xs ${notif.isRead ? 'text-slate-300' : 'text-white'}`}>
                          {notif.title}
                        </p>
                        <span className="text-[10px] text-slate-500 whitespace-nowrap">{notif.createdAt}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">{notif.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile or Login/Register */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-dark-surface transition-colors border border-transparent hover:border-dark-border"
              >
                <img
                  src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop'}
                  alt={user?.name || 'User'}
                  className="w-8 h-8 rounded-lg object-cover ring-1 ring-brand-500/40"
                />
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-dark-surface border border-dark-border shadow-2xl p-2 text-sm z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-3 py-2 border-b border-dark-border">
                    <p className="font-semibold text-slate-100 truncate">{user?.name}</p>
                    <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 uppercase">
                      {user?.role} • {user?.currentSubscription?.planCode || 'FREE'}
                    </span>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/candidate/profile"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-dark-elevated transition-colors"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      Candidate Profile
                    </Link>
                    <Link
                      to="/billing"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-dark-elevated transition-colors"
                    >
                      <CreditCard className="w-4 h-4 text-slate-400" />
                      Subscription & Billing
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-dark-elevated transition-colors"
                    >
                      <Layers className="w-4 h-4 text-slate-400" />
                      Account Settings
                    </Link>
                  </div>

                  <div className="pt-1 border-t border-dark-border">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        logout();
                        navigate('/login');
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-sm font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-dark-surface transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="text-sm font-semibold text-white bg-brand-600 hover:bg-brand-500 px-3.5 py-1.5 rounded-lg shadow-glow-brand transition-all duration-200"
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-dark-border bg-dark-surface px-4 py-3 space-y-2">
          <Link
            to="/jobs"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-slate-200 hover:bg-dark-elevated"
          >
            Jobs Directory
          </Link>
          <Link
            to="/assessment/q-1"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-slate-200 hover:bg-dark-elevated"
          >
            Coding Hub
          </Link>
          <Link
            to="/chat"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-slate-200 hover:bg-dark-elevated"
          >
            AI Assistant
          </Link>
          <Link
            to="/pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-slate-200 hover:bg-dark-elevated"
          >
            Pricing Plans
          </Link>
        </div>
      )}
    </header>
  );
};
