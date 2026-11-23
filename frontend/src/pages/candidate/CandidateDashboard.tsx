import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { MetricCard } from '../../components/common/MetricCard';
import { PaywallModal } from '../../components/paywall/PaywallModal';
import { INITIAL_JOBS, INITIAL_APPLICATIONS } from '../../services/mockData';
import {
  FileText,
  Code2,
  Sparkles,
  Briefcase,
  ArrowRight,
  Clock,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Lock,
  Layers
} from 'lucide-react';

export const CandidateDashboard: React.FC = () => {
  const { user } = useAuth();
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [paywallFeature, setPaywallFeature] = useState({ title: '', desc: '' });

  const triggerPaywall = (title: string, desc: string) => {
    setPaywallFeature({ title, desc });
    setPaywallOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-brand-950/70 via-dark-surface to-dark-surface border border-brand-500/20 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30">
              Candidate Workspace
            </span>
            <span className="text-xs text-slate-400">Plan: {user?.currentSubscription?.planCode || 'FREE'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 tracking-tight">
            Welcome back, {user?.name?.split(' ')[0] || 'Aditya'} 👋
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            You have 2 pending technical assessment invites and an AI match score of 92% for CloudScale Technologies.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/candidate/resume"
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-dark-elevated hover:bg-dark-elevated/80 border border-dark-border transition-colors flex items-center gap-2"
          >
            <FileText className="w-4 h-4 text-brand-400" />
            <span>Update Resume</span>
          </Link>

          <Link
            to="/assessment/q-1"
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 shadow-glow-brand transition-colors flex items-center gap-2"
          >
            <Code2 className="w-4 h-4" />
            <span>Start Coding Test</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Active Applications"
          value="4"
          change="+1 this week"
          icon={Briefcase}
          iconColor="text-brand-400"
        />
        <MetricCard
          title="Avg. Assessment Score"
          value="92%"
          change="Top 5% candidate"
          icon={Code2}
          iconColor="text-emerald-400"
        />
        <MetricCard
          title="Profile AI Strength"
          value="88/100"
          subtitle="Strong keywords in React, Node.js"
          icon={Sparkles}
          iconColor="text-ai-400"
        />
        <MetricCard
          title="AI Queries Left"
          value="85/100"
          subtitle="Pro Tier Daily Quota"
          icon={Layers}
          iconColor="text-amber-400"
        />
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Application Pipeline Tracker */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl bg-dark-surface border border-dark-border shadow-card">
            <div className="flex items-center justify-between pb-4 border-b border-dark-border">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-brand-400" />
                Active Job Applications Status
              </h2>
              <Link to="/jobs" className="text-xs text-brand-400 hover:text-brand-300 font-semibold flex items-center gap-1">
                <span>View All Jobs</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="mt-4 divide-y divide-dark-border">
              {INITIAL_APPLICATIONS.map((app) => (
                <div key={app.id} className="py-4 first:pt-0 last:pb-0 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-white text-sm">{app.jobTitle}</h3>
                      <p className="text-xs text-slate-400">{app.companyName} • Applied {app.appliedAt.split('T')[0]}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-brand-500/10 text-brand-300 border border-brand-500/30">
                        {app.aiMatchingScore?.overallScore}% Match
                      </span>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full uppercase bg-dark-elevated text-slate-300">
                        {app.status}
                      </span>
                    </div>
                  </div>

                  {/* Stage Progress Bar */}
                  <div className="grid grid-cols-5 gap-1.5 text-[10px] text-center font-semibold text-slate-400 pt-1">
                    <div className="p-1 rounded bg-brand-600/30 text-brand-300 border border-brand-500/30">Applied</div>
                    <div className={`p-1 rounded ${['screening', 'shortlisted', 'assessment', 'interview', 'selected'].includes(app.status) ? 'bg-brand-600/30 text-brand-300 border border-brand-500/30' : 'bg-dark-elevated'}`}>Screening</div>
                    <div className={`p-1 rounded ${['shortlisted', 'assessment', 'interview', 'selected'].includes(app.status) ? 'bg-brand-600 text-white font-bold' : 'bg-dark-elevated'}`}>Shortlisted</div>
                    <div className={`p-1 rounded ${['assessment', 'interview', 'selected'].includes(app.status) ? 'bg-brand-600/30 text-brand-300 border border-brand-500/30' : 'bg-dark-elevated'}`}>Assessment</div>
                    <div className={`p-1 rounded ${['interview', 'selected'].includes(app.status) ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/30' : 'bg-dark-elevated'}`}>Interview</div>
                  </div>

                  {app.aiMatchingScore && (
                    <div className="text-xs text-slate-300 bg-dark-bg/60 p-3 rounded-xl border border-dark-border/80">
                      <span className="font-semibold text-white">AI Analysis: </span>
                      {app.aiMatchingScore.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Premium Feature Card (Paywall demonstration) */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-ai-950/40 via-dark-surface to-brand-950/40 border border-ai-500/30 shadow-card flex items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-ai-400" />
                <h3 className="font-bold text-white text-sm">Personalized AI Technical Interview Simulator</h3>
              </div>
              <p className="text-xs text-slate-300 max-w-lg">
                Practice simulated 1-on-1 audio/text interviews tailored specifically to CloudScale Technologies' tech stack.
              </p>
            </div>
            <button
              onClick={() => triggerPaywall('AI Technical Interview Simulator', 'Simulate interactive live engineering interviews with real-time feedback on system design and algorithms.')}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-ai-600 hover:bg-ai-500 transition-colors flex items-center gap-2 shrink-0 shadow-glow-ai"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Launch Simulator</span>
            </button>
          </div>
        </div>

        {/* Right Column: AI Recommended Jobs */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-dark-surface border border-dark-border shadow-card">
            <div className="flex items-center justify-between pb-3 border-b border-dark-border">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-ai-400" />
                AI Matched Openings
              </h2>
            </div>

            <div className="mt-4 space-y-4">
              {INITIAL_JOBS.map((job) => (
                <div
                  key={job.id}
                  className="p-3.5 rounded-xl bg-dark-bg/70 border border-dark-border hover:border-brand-500/40 transition-all space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-sm text-white line-clamp-1">{job.title}</h3>
                    <span className="text-xs font-bold text-emerald-400 shrink-0">
                      {job.matchScore}% Match
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{job.companyName} • {job.location}</p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {job.requiredSkills.slice(0, 3).map((skill) => (
                      <span key={skill} className="px-2 py-0.5 rounded text-[10px] font-medium bg-dark-elevated text-slate-300">
                        {skill}
                      </span>
                    ))}
                  </div>
                  <Link
                    to={`/jobs/${job.id}`}
                    className="block text-center mt-2 py-1.5 rounded-lg text-xs font-semibold text-brand-300 bg-brand-500/10 hover:bg-brand-500/20 transition-colors"
                  >
                    View Job & Apply
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Paywall Modal */}
      <PaywallModal
        isOpen={paywallOpen}
        onClose={() => setPaywallOpen(false)}
        featureTitle={paywallFeature.title}
        featureDescription={paywallFeature.desc}
      />
    </div>
  );
};
