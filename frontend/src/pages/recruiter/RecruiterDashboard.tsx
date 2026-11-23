import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { MetricCard } from '../../components/common/MetricCard';
import { PaywallModal } from '../../components/paywall/PaywallModal';
import { INITIAL_JOBS, INITIAL_APPLICATIONS } from '../../services/mockData';
import { Application } from '../../types';
import {
  Briefcase,
  Users,
  Code2,
  TrendingUp,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Search,
  Filter,
  Lock,
  Layers
} from 'lucide-react';

export const RecruiterDashboard: React.FC = () => {
  const { user } = useAuth();
  const { addToast } = useNotification();
  const [applications, setApplications] = useState<Application[]>(INITIAL_APPLICATIONS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [paywallOpen, setPaywallOpen] = useState(false);
  const [paywallFeature, setPaywallFeature] = useState({ title: '', desc: '', plan: 'Recruiter Pro', price: '₹999/mo', code: 'RECRUITER_PRO' });

  const triggerPaywall = (title: string, desc: string) => {
    setPaywallFeature({ title, desc, plan: 'Recruiter Pro', price: '₹999/mo', code: 'RECRUITER_PRO' });
    setPaywallOpen(true);
  };

  const handleUpdateStatus = (appId: string, newStatus: Application['status']) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, status: newStatus } : app))
    );
    addToast('success', 'Candidate Stage Updated', `Candidate marked as ${newStatus.toUpperCase()}`);
  };

  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Recruiter Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-dark-surface via-brand-950/40 to-dark-surface border border-dark-border shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30">
              Recruiter Enterprise Workspace
            </span>
            <span className="text-xs text-slate-400">Company: CloudScale Technologies</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 tracking-tight">
            Hiring Pipeline Overview
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            You have 89 total applicants across 3 active job requisitions. AI resume matcher ranked 14 candidates above 85% relevance.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => triggerPaywall('Bulk Resume AI Screener', 'Upload 50+ resumes simultaneously and let the AI rank candidates in seconds.')}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-200 bg-dark-elevated hover:bg-dark-elevated/80 border border-dark-border transition-colors flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-ai-400" />
            <span>Bulk Resume Screen</span>
          </button>

          <Link
            to="/jobs"
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 shadow-glow-brand transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Publish New Job</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Active Job Openings"
          value="3"
          subtitle="1 draft requisition"
          icon={Briefcase}
          iconColor="text-brand-400"
        />
        <MetricCard
          title="Total Candidates"
          value="89"
          change="+18 this week"
          icon={Users}
          iconColor="text-ai-400"
        />
        <MetricCard
          title="Assessment Pass Rate"
          value="64%"
          change="Monaco verified"
          icon={Code2}
          iconColor="text-emerald-400"
        />
        <MetricCard
          title="Time to Shortlist"
          value="1.8 Days"
          change="4.2x faster with AI"
          icon={TrendingUp}
          iconColor="text-amber-400"
        />
      </div>

      {/* Candidate Pipeline Table & Filters */}
      <div className="p-6 rounded-2xl bg-dark-surface border border-dark-border shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-dark-border">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-brand-400" />
              Applicant Review & AI Match Matrix
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Review candidates, examine explainable AI match reports, and trigger assessment invites.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search candidate or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-1.5 rounded-xl bg-dark-bg border border-dark-border text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
            </div>

            {/* Stage filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-1.5 px-3 rounded-xl bg-dark-bg border border-dark-border text-xs text-slate-200 focus:outline-none focus:border-brand-500 cursor-pointer"
            >
              <option value="all">All Stages</option>
              <option value="applied">Applied</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="assessment">Assessment</option>
              <option value="interview">Interview</option>
              <option value="selected">Selected</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] font-semibold text-slate-400 uppercase bg-dark-bg/60 border-b border-dark-border">
              <tr>
                <th className="py-3 px-4">Candidate</th>
                <th className="py-3 px-4">Role Applied</th>
                <th className="py-3 px-4">AI Relevance Score</th>
                <th className="py-3 px-4">Coding Score</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {filteredApps.map((app) => (
                <tr key={app.id} className="hover:bg-dark-elevated/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-white">{app.candidateName}</div>
                    <div className="text-[11px] text-slate-400">{app.candidateHeadline}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">
                    {app.jobTitle}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-brand-400">
                        {app.aiMatchingScore?.overallScore}%
                      </span>
                      <div className="w-16 h-1.5 rounded-full bg-dark-bg overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-brand-500 to-emerald-400 rounded-full"
                          style={{ width: `${app.aiMatchingScore?.overallScore}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    {app.assessmentScore ? (
                      <span className="font-semibold text-emerald-400">{app.assessmentScore}% Passed</span>
                    ) : (
                      <span className="text-slate-500">Not Attempted</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                      app.status === 'shortlisted' ? 'bg-brand-500/20 text-brand-300' :
                      app.status === 'assessment' ? 'bg-amber-500/20 text-amber-300' :
                      app.status === 'interview' ? 'bg-emerald-500/20 text-emerald-300' :
                      app.status === 'rejected' ? 'bg-rose-500/20 text-rose-300' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleUpdateStatus(app.id, 'shortlisted')}
                        className="px-2.5 py-1 rounded-lg bg-brand-600/20 text-brand-300 hover:bg-brand-600 hover:text-white transition-colors text-[11px] font-semibold"
                        title="Shortlist Candidate"
                      >
                        Shortlist
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(app.id, 'interview')}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600 hover:text-white transition-colors text-[11px] font-semibold"
                        title="Schedule Interview"
                      >
                        Interview
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(app.id, 'rejected')}
                        className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Reject Application"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Paywall modal for premium recruiter tools */}
      <PaywallModal
        isOpen={paywallOpen}
        onClose={() => setPaywallOpen(false)}
        featureTitle={paywallFeature.title}
        featureDescription={paywallFeature.desc}
        requiredPlanName={paywallFeature.plan}
        requiredPlanPrice={paywallFeature.price}
        targetPlanCode={paywallFeature.code}
      />
    </div>
  );
};
