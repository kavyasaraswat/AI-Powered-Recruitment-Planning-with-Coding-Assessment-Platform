import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Code2,
  MessageSquare,
  CreditCard,
  Settings,
  Users,
  Building,
  BarChart3,
  ShieldCheck,
  Award
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { role } = useAuth();

  const getLinks = () => {
    if (role === 'recruiter') {
      return [
        { to: '/recruiter/dashboard', label: 'Recruiter Overview', icon: LayoutDashboard },
        { to: '/jobs', label: 'Manage Job Openings', icon: Briefcase },
        { to: '/recruiter/analytics', label: 'Recruitment Analytics', icon: BarChart3 },
        { to: '/assessment/q-1', label: 'Assessment Creator', icon: Code2 },
        { to: '/chat', label: 'AI Recruiter Assistant', icon: MessageSquare },
        { to: '/billing', label: 'Company Billing', icon: CreditCard },
        { to: '/settings', label: 'Account Settings', icon: Settings },
      ];
    }

    if (role === 'admin') {
      return [
        { to: '/admin/dashboard', label: 'Admin Governance', icon: ShieldCheck },
        { to: '/jobs', label: 'All Platform Jobs', icon: Briefcase },
        { to: '/pricing', label: 'Subscription Tiers', icon: CreditCard },
        { to: '/billing', label: 'Revenue Ledger', icon: BarChart3 },
        { to: '/settings', label: 'System Configuration', icon: Settings },
      ];
    }

    // Default to candidate navigation
    return [
      { to: '/candidate/dashboard', label: 'Candidate Dashboard', icon: LayoutDashboard },
      { to: '/candidate/profile', label: 'My Profile & Skills', icon: Users },
      { to: '/candidate/resume', label: 'Resume AI Analyzer', icon: FileText },
      { to: '/jobs', label: 'Browse Jobs & Matches', icon: Briefcase },
      { to: '/assessment/q-1', label: 'Coding Practice Hub', icon: Code2 },
      { to: '/chat', label: 'AI Career Mentor', icon: MessageSquare },
      { to: '/billing', label: 'Subscription & Quotas', icon: CreditCard },
      { to: '/settings', label: 'Settings', icon: Settings },
    ];
  };

  const links = getLinks();

  return (
    <aside className="w-64 shrink-0 hidden md:block border-r border-dark-border bg-dark-bg/50 p-4">
      <div className="space-y-1">
        <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
          {role?.toUpperCase()} WORKSPACE
        </p>
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-brand-600/15 text-brand-300 font-semibold border border-brand-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-dark-surface'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Pro Badge Card */}
      <div className="mt-8 p-3.5 rounded-xl bg-gradient-to-br from-brand-950/60 to-ai-950/40 border border-brand-500/20 text-xs">
        <div className="flex items-center gap-1.5 text-brand-300 font-semibold mb-1">
          <Award className="w-4 h-4 text-brand-400" />
          <span>HireGenius Pro</span>
        </div>
        <p className="text-slate-400 text-[11px] leading-relaxed">
          AI Resume Scoring, Monaco Code Sandbox, and Razorpay/Stripe active.
        </p>
      </div>
    </aside>
  );
};
