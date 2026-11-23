import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { INITIAL_JOBS } from '../../services/mockData';
import { useNotification } from '../../context/NotificationContext';
import {
  Briefcase,
  MapPin,
  Building,
  DollarSign,
  Sparkles,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Share2,
  Clock,
  ShieldCheck,
  Send
} from 'lucide-react';

export const JobDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToast } = useNotification();
  const [isApplying, setIsApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  const job = INITIAL_JOBS.find((j) => j.id === id) || INITIAL_JOBS[0];

  const candidateSkills = ['React', 'TypeScript', 'Node.js', 'MongoDB', 'Docker', 'Python', 'Tailwind CSS'];
  const matchedSkills = job.requiredSkills.filter((s) => candidateSkills.includes(s));
  const missingSkills = job.requiredSkills.filter((s) => !candidateSkills.includes(s));

  const handleApply = () => {
    setIsApplying(true);
    setTimeout(() => {
      setIsApplying(false);
      setHasApplied(true);
      addToast(
        'success',
        'Application Submitted!',
        `Your application for ${job.title} at ${job.companyName} has been received. AI Match Score: ${job.matchScore || 90}%`
      );
    }, 800);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Back button */}
      <Link
        to="/jobs"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Openings</span>
      </Link>

      {/* Main Job Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-dark-surface border border-dark-border shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-dark-border">
          <div className="flex items-start gap-4">
            <img
              src={job.companyLogo}
              alt={job.companyName}
              className="w-16 h-16 rounded-2xl object-cover ring-1 ring-dark-border shrink-0"
            />
            <div>
              <div className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold bg-brand-500/10 text-brand-300 border border-brand-500/20 mb-2">
                {job.department} Team
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {job.title}
              </h1>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-400">
                <span className="font-semibold text-white">{job.companyName}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {job.location}
                </span>
                <span>•</span>
                <span className="px-2 py-0.5 rounded bg-dark-elevated text-slate-300">
                  {job.workplaceType} ({job.jobType})
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:items-end gap-3 shrink-0">
            <div className="text-left sm:text-right">
              <span className="text-xl font-extrabold text-white">
                ₹{(job.salary.min / 100000).toFixed(1)}L - ₹{(job.salary.max / 100000).toFixed(1)}L
              </span>
              <span className="text-xs text-slate-400 block">Annual CTC (Disclosed)</span>
            </div>

            <button
              onClick={handleApply}
              disabled={isApplying || hasApplied}
              className={`px-6 py-2.5 rounded-xl font-semibold text-xs flex items-center gap-2 transition-all shadow-glow-brand ${
                hasApplied
                  ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 cursor-default'
                  : 'bg-brand-600 hover:bg-brand-500 text-white'
              }`}
            >
              {hasApplied ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Applied Successfully</span>
                </>
              ) : isApplying ? (
                <span>Submitting Application...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>1-Click Easy Apply</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* AI Match Matrix Panel */}
        <div className="p-5 rounded-xl bg-gradient-to-r from-brand-950/40 via-dark-bg to-ai-950/30 border border-brand-500/30 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-ai-400" />
              <h3 className="font-bold text-white text-sm">
                HireGenius AI Compatibility Score: {job.matchScore || 92}%
              </h3>
            </div>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
              High Probability Shortlist
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Matched Skills */}
            <div className="space-y-1.5 p-3 rounded-lg bg-dark-surface/60 border border-dark-border">
              <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Verified Matched Skills ({matchedSkills.length})
              </span>
              <div className="flex flex-wrap gap-1 pt-1">
                {matchedSkills.map((s) => (
                  <span key={s} className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="space-y-1.5 p-3 rounded-lg bg-dark-surface/60 border border-dark-border">
              <span className="font-semibold text-amber-400 flex items-center gap-1.5">
                <XCircle className="w-4 h-4" />
                Missing or Preferred Gap ({missingSkills.length})
              </span>
              <div className="flex flex-wrap gap-1 pt-1">
                {missingSkills.length > 0 ? (
                  missingSkills.map((s) => (
                    <span key={s} className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-medium">
                      {s}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-400">All mandatory requirements fulfilled!</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Description */}
        <div className="space-y-4 text-sm text-slate-300 leading-relaxed pt-2">
          <h2 className="text-base font-bold text-white">About the Role</h2>
          <p>{job.description}</p>

          <h2 className="text-base font-bold text-white pt-2">Key Responsibilities</h2>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-300">
            <li>Architect, develop, and maintain high-throughput web applications with sub-second latencies.</li>
            <li>Collaborate with cross-functional AI research and product engineering teams.</li>
            <li>Participate in peer code reviews, continuous deployment pipelines, and architectural design RFCs.</li>
            <li>Ensure high automated test coverage across frontend and microservices.</li>
          </ul>

          <h2 className="text-base font-bold text-white pt-2">Mandatory Technical Requirements</h2>
          <div className="flex flex-wrap gap-2 pt-1">
            {job.requiredSkills.map((skill) => (
              <span key={skill} className="px-3 py-1 rounded-xl text-xs font-semibold bg-dark-elevated text-brand-300 border border-brand-500/30">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
