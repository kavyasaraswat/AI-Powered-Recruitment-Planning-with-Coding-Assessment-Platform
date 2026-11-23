import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { MetricCard } from '../../components/common/MetricCard';
import {
  ShieldCheck,
  Users,
  DollarSign,
  Activity,
  Cpu,
  UserCheck,
  UserX,
  AlertTriangle,
  Search,
  Filter
} from 'lucide-react';

interface MockUserRow {
  id: string;
  name: string;
  email: string;
  role: 'candidate' | 'recruiter';
  plan: string;
  status: 'active' | 'suspended';
  registeredAt: string;
}

const INITIAL_USERS: MockUserRow[] = [
  { id: 'u-1', name: 'Aditya Sharma', email: 'aditya@hiregenius.ai', role: 'candidate', plan: 'CANDIDATE_PRO', status: 'active', registeredAt: '2026-01-15' },
  { id: 'u-2', name: 'Rohit Deshmukh', email: 'rohit@cloudscale.io', role: 'recruiter', plan: 'RECRUITER_PRO', status: 'active', registeredAt: '2026-02-10' },
  { id: 'u-3', name: 'Priya Patel', email: 'priya.patel@example.com', role: 'candidate', plan: 'FREE', status: 'active', registeredAt: '2026-03-01' },
  { id: 'u-4', name: 'NeuroSync Tech HR', email: 'talent@neurosync.ai', role: 'recruiter', plan: 'ENTERPRISE', status: 'active', registeredAt: '2026-02-28' },
  { id: 'u-5', name: 'Suspicious Bot Account', email: 'spam123@disposable.org', role: 'candidate', plan: 'FREE', status: 'suspended', registeredAt: '2026-03-04' },
];

export const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<MockUserRow[]>(INITIAL_USERS);
  const [searchTerm, setSearchTerm] = useState('');
  const { addToast } = useNotification();

  const handleToggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const newStatus = u.status === 'active' ? 'suspended' : 'active';
          addToast(
            newStatus === 'active' ? 'success' : 'warning',
            `User Account ${newStatus === 'active' ? 'Reactivated' : 'Suspended'}`,
            `${u.name} is now ${newStatus}.`
          );
          return { ...u, status: newStatus };
        }
        return u;
      })
    );
  };

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Admin Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-dark-surface via-rose-950/20 to-dark-surface border border-dark-border shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
              Administrator Surveillance
            </span>
            <span className="text-xs text-slate-400">Environment: Production Master</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 tracking-tight">
            Platform Telemetry & Governance
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            Live governance metrics, subscription revenue ledger, AI usage monitors, and user account management.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-dark-bg/80 border border-dark-border text-xs text-slate-300 space-y-1">
          <div className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>Core API Gateway: <strong className="text-emerald-400">Healthy (99.98%)</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5 text-brand-400" />
            <span>Code Sandbox Cluster: <strong className="text-white">Active</strong></span>
          </div>
        </div>
      </div>

      {/* Admin Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Monthly Recurring Revenue"
          value="₹4,28,400"
          change="+18.5% MoM"
          icon={DollarSign}
          iconColor="text-emerald-400"
        />
        <MetricCard
          title="Total Registered Users"
          value="1,420"
          subtitle="980 Candidates • 440 Recruiters"
          icon={Users}
          iconColor="text-brand-400"
        />
        <MetricCard
          title="AI Token Consumption"
          value="4.8M"
          subtitle="78% of monthly quota"
          icon={Cpu}
          iconColor="text-ai-400"
        />
        <MetricCard
          title="Flagged / Suspended"
          value="3"
          subtitle="Fraud & anti-abuse trigger"
          icon={AlertTriangle}
          iconColor="text-rose-400"
        />
      </div>

      {/* User Governance Management Table */}
      <div className="p-6 rounded-2xl bg-dark-surface border border-dark-border shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-dark-border">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-rose-400" />
              Global User Directory & Account Governance
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Manage platform users, inspect subscription tiers, and enforce access controls.
            </p>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by name, email or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-1.5 rounded-xl bg-dark-bg border border-dark-border text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] font-semibold text-slate-400 uppercase bg-dark-bg/60 border-b border-dark-border">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Platform Role</th>
                <th className="py-3 px-4">Active Plan</th>
                <th className="py-3 px-4">Joined Date</th>
                <th className="py-3 px-4">Account Status</th>
                <th className="py-3 px-4 text-right">Administrative Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-dark-elevated/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-white">{u.name}</div>
                    <div className="text-[11px] text-slate-400">{u.email}</div>
                  </td>
                  <td className="py-3.5 px-4 uppercase text-[11px] font-bold text-slate-300">
                    {u.role}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-dark-elevated text-brand-300 border border-brand-500/20">
                      {u.plan}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">{u.registeredAt}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      u.status === 'active' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                    }`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleToggleUserStatus(u.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors inline-flex items-center gap-1.5 ${
                        u.status === 'active'
                          ? 'bg-rose-600/20 text-rose-300 hover:bg-rose-600 hover:text-white'
                          : 'bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600 hover:text-white'
                      }`}
                    >
                      {u.status === 'active' ? (
                        <>
                          <UserX className="w-3.5 h-3.5" />
                          <span>Suspend</span>
                        </>
                      ) : (
                        <>
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Reactivate</span>
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
