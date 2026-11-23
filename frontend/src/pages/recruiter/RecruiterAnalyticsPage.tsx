import React, { useState } from 'react';
import { useNotification } from '../../context/NotificationContext';
import { MetricCard } from '../../components/common/MetricCard';
import {
  BarChart3,
  TrendingUp,
  Users,
  Code2,
  Calendar,
  Download,
  Filter,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';

export const RecruiterAnalyticsPage: React.FC = () => {
  const { addToast } = useNotification();
  const [timeRange, setTimeRange] = useState('30d');

  const funnelStages = [
    { name: '1. Applications Received', count: 89, percent: 100, color: 'bg-brand-500' },
    { name: '2. Resume Screening Passed', count: 52, percent: 58, color: 'bg-brand-400' },
    { name: '3. Coding Assessment Attempted', count: 34, percent: 38, color: 'bg-emerald-500' },
    { name: '4. Shortlisted for Technical Interview', count: 12, percent: 13, color: 'bg-ai-500' },
    { name: '5. Final Offers Extended', count: 4, percent: 4.5, color: 'bg-emerald-400' },
  ];

  const handleExportReport = () => {
    addToast('success', 'Analytics Exported', 'Comprehensive recruitment analytics CSV report generated.');
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-dark-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Recruitment Funnel & Assessment Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Data-driven hiring efficiency metrics, applicant conversion drop-offs, and Monaco code benchmarks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="py-2 px-3 rounded-xl bg-dark-surface border border-dark-border text-xs text-slate-200 focus:outline-none focus:border-brand-500 cursor-pointer"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last Quarter</option>
          </select>

          <button
            onClick={handleExportReport}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 shadow-glow-brand transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Conversion to Interview"
          value="13.5%"
          change="+3.2% vs industry"
          icon={TrendingUp}
          iconColor="text-emerald-400"
        />
        <MetricCard
          title="Average Assessment Score"
          value="74.8%"
          subtitle="Across 34 submissions"
          icon={Code2}
          iconColor="text-brand-400"
        />
        <MetricCard
          title="Average Time to Hire"
          value="11.4 Days"
          change="-42% faster with AI"
          icon={Clock}
          iconColor="text-ai-400"
        />
        <MetricCard
          title="Candidate Quality Index"
          value="8.8 / 10"
          subtitle="AI Vector fit score"
          icon={Sparkles}
          iconColor="text-amber-400"
        />
      </div>

      {/* Funnel Visualizer */}
      <div className="p-6 sm:p-8 rounded-2xl bg-dark-surface border border-dark-border shadow-card space-y-6">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-brand-400" />
            Candidate Pipeline Conversion Funnel
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Step-by-step conversion rates from initial application through final offer.
          </p>
        </div>

        <div className="space-y-4">
          {funnelStages.map((stage, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-200">{stage.name}</span>
                <span className="font-mono text-slate-400">
                  <strong className="text-white">{stage.count}</strong> candidates ({stage.percent}%)
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-dark-bg overflow-hidden p-0.5 border border-dark-border">
                <div
                  className={`h-full rounded-full ${stage.color} transition-all duration-500`}
                  style={{ width: `${stage.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Assessment Benchmark Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-dark-surface border border-dark-border shadow-card space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Code2 className="w-4 h-4 text-emerald-400" />
            Top Programming Languages Used
          </h3>
          <p className="text-xs text-slate-400">
            Language choices made by candidates during Monaco coding assessments:
          </p>
          <div className="space-y-2 pt-2 text-xs">
            <div className="flex justify-between items-center p-2 rounded bg-dark-bg border border-dark-border">
              <span className="font-semibold text-white">Python 3.11</span>
              <span className="text-emerald-400 font-mono">48% of submissions</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded bg-dark-bg border border-dark-border">
              <span className="font-semibold text-white">JavaScript / TypeScript</span>
              <span className="text-brand-400 font-mono">32% of submissions</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded bg-dark-bg border border-dark-border">
              <span className="font-semibold text-white">Java / C++</span>
              <span className="text-ai-400 font-mono">20% of submissions</span>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-dark-surface border border-dark-border shadow-card space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-ai-400" />
            AI Explainability Report
          </h3>
          <p className="text-xs text-slate-400">
            Methodology & ranking validation:
          </p>
          <div className="p-4 rounded-xl bg-dark-bg border border-dark-border text-xs text-slate-300 space-y-2">
            <p>
              Candidate-Job matching relies on a multi-modal cosine similarity vector of normalized skills, verified years of experience, and coding challenge assertion scores.
            </p>
            <p className="text-emerald-400 font-semibold flex items-center gap-1.5 pt-1">
              <CheckCircle2 className="w-4 h-4" />
              Protected characteristics (age, gender, ethnicity) are strictly masked during AI scoring.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
