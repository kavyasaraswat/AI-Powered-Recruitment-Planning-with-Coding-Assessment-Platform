import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Code2,
  Brain,
  FileCheck2,
  Users2,
  CheckCircle2,
  Zap,
  Terminal,
  TrendingUp,
  Cpu
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  // Interactive mini-simulator state
  const [selectedCandidate, setSelectedCandidate] = useState<'aditya' | 'neha'>('aditya');
  const [selectedJob, setSelectedJob] = useState<'fullstack' | 'ml'>('fullstack');

  const getSimulatedScore = () => {
    if (selectedCandidate === 'aditya' && selectedJob === 'fullstack') return { score: 94, match: 'Exceptional Alignment', missing: 'GraphQL' };
    if (selectedCandidate === 'aditya' && selectedJob === 'ml') return { score: 68, match: 'Moderate Match', missing: 'PyTorch, MLOps' };
    if (selectedCandidate === 'neha' && selectedJob === 'fullstack') return { score: 72, match: 'Good Alignment', missing: 'Docker, Node.js' };
    return { score: 96, match: 'Outstanding Alignment', missing: 'None (Key skills verified)' };
  };

  const simResult = getSimulatedScore();

  return (
    <div className="min-h-screen bg-dark-bg text-slate-100 flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-20 pb-24 overflow-hidden border-b border-dark-border/60">
        {/* Ambient background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-brand-600/20 via-ai-600/20 to-transparent blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-semibold mb-8 animate-pulse">
            <Sparkles className="w-4 h-4 text-brand-400" />
            <span>Next-Gen Autonomous Recruitment & Assessment Platform</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-5xl mx-auto leading-[1.1]">
            Intelligent Hiring Powered by <br />
            <span className="bg-gradient-to-r from-brand-400 via-indigo-200 to-ai-400 bg-clip-text text-transparent">
              Explainable AI & Live Coding
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Eliminate recruitment bias. HireGenius parses candidate resumes into vector embeddings, computes semantic match scores, and verifies technical competence in sandboxed Monaco coding assessments.
          </p>

          {/* Action CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-brand-600 to-ai-600 hover:from-brand-500 hover:to-ai-500 shadow-glow-brand transition-all duration-300 flex items-center justify-center gap-2 text-base"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              to="/jobs"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-slate-200 hover:text-white bg-dark-surface hover:bg-dark-elevated border border-dark-border transition-all duration-200 text-base"
            >
              Browse Open Roles
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 rounded-xl bg-dark-surface/60 border border-dark-border">
              <span className="block text-2xl font-bold text-white">99.4%</span>
              <span className="text-xs text-slate-400">Match Vector Precision</span>
            </div>
            <div className="p-4 rounded-xl bg-dark-surface/60 border border-dark-border">
              <span className="block text-2xl font-bold text-white">&lt; 150ms</span>
              <span className="text-xs text-slate-400">Isolated Code Execution</span>
            </div>
            <div className="p-4 rounded-xl bg-dark-surface/60 border border-dark-border">
              <span className="block text-2xl font-bold text-white">5+ Languages</span>
              <span className="text-xs text-slate-400">Python, JS, Java, C++, C</span>
            </div>
            <div className="p-4 rounded-xl bg-dark-surface/60 border border-dark-border">
              <span className="block text-2xl font-bold text-white">0% Bias</span>
              <span className="text-xs text-slate-400">Protected-Traits Blind</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive AI Match Simulator Section */}
      <section className="py-20 bg-dark-surface/30 border-b border-dark-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ai-500/10 text-ai-400 text-xs font-semibold mb-3">
              <Cpu className="w-3.5 h-3.5" />
              <span>Interactive Demonstration</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-white">
              Test the AI Matching Engine in Real Time
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Select a candidate profile and target job requisition to witness instant semantic scoring.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-2xl bg-dark-surface border border-brand-500/30 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Candidate Picker */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Select Candidate Profile:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setSelectedCandidate('aditya')}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      selectedCandidate === 'aditya'
                        ? 'border-brand-500 bg-brand-500/10 shadow-glow-brand'
                        : 'border-dark-border bg-dark-elevated/40 hover:border-slate-600'
                    }`}
                  >
                    <div className="font-semibold text-sm text-white">Aditya Sharma</div>
                    <div className="text-xs text-slate-400 mt-1">Full Stack • React, Node, TS</div>
                  </button>

                  <button
                    onClick={() => setSelectedCandidate('neha')}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      selectedCandidate === 'neha'
                        ? 'border-brand-500 bg-brand-500/10 shadow-glow-brand'
                        : 'border-dark-border bg-dark-elevated/40 hover:border-slate-600'
                    }`}
                  >
                    <div className="font-semibold text-sm text-white">Neha Iyer</div>
                    <div className="text-xs text-slate-400 mt-1">AI Specialist • Python, PyTorch</div>
                  </button>
                </div>
              </div>

              {/* Job Picker */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Select Target Job Opening:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setSelectedJob('fullstack')}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      selectedJob === 'fullstack'
                        ? 'border-brand-500 bg-brand-500/10 shadow-glow-brand'
                        : 'border-dark-border bg-dark-elevated/40 hover:border-slate-600'
                    }`}
                  >
                    <div className="font-semibold text-sm text-white">Senior Full Stack</div>
                    <div className="text-xs text-slate-400 mt-1">Requires React, Node, Docker</div>
                  </button>

                  <button
                    onClick={() => setSelectedJob('ml')}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      selectedJob === 'ml'
                        ? 'border-brand-500 bg-brand-500/10 shadow-glow-brand'
                        : 'border-dark-border bg-dark-elevated/40 hover:border-slate-600'
                    }`}
                  >
                    <div className="font-semibold text-sm text-white">AI / ML Engineer</div>
                    <div className="text-xs text-slate-400 mt-1">Requires PyTorch, NLP, MLOps</div>
                  </button>
                </div>
              </div>
            </div>

            {/* Real-time Match Calculation Result Card */}
            <div className="mt-8 pt-6 border-t border-dark-border flex flex-col sm:flex-row items-center justify-between gap-6 bg-dark-bg/60 p-5 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-ai-600 flex items-center justify-center text-white font-extrabold text-2xl shadow-glow-brand shrink-0">
                  {simResult.score}%
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{simResult.match}</span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
                      Cosine Similarity: {(simResult.score / 100).toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Missing Skill Flags: <span className="text-rose-400 font-medium">{simResult.missing}</span>
                  </p>
                </div>
              </div>

              <Link
                to="/candidate/resume"
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 transition-colors flex items-center gap-1.5 shrink-0"
              >
                <span>Upload Your Resume For Full Breakdown</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Column Bento Architecture Showcase */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Engineered for Precision & Scalability
            </h2>
            <p className="text-sm text-slate-400 mt-3">
              Every phase designed to replace obsolete hiring filters with verifiable skills.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="p-6 rounded-2xl bg-dark-surface border border-dark-border hover:border-brand-500/40 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 mb-5">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">NLP Resume Extraction</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Parses PDF & DOCX resumes into structured JSON entities: education, verified skills, and chronological career tenure.
              </p>
              <ul className="mt-4 space-y-1.5 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Keyword & synonym normalization</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Anti-bias protected trait anonymization</span>
                </li>
              </ul>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-2xl bg-dark-surface border border-dark-border hover:border-brand-500/40 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-5">
                <Terminal className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Monaco Coding Sandbox</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Full-featured in-browser code editor with automated hidden test assertions, CPU limits, and memory isolation.
              </p>
              <ul className="mt-4 space-y-1.5 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Sub-second execution feedback</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Python, JavaScript, Java, C++, C support</span>
                </li>
              </ul>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-2xl bg-dark-surface border border-dark-border hover:border-brand-500/40 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-ai-500/10 border border-ai-500/20 flex items-center justify-center text-ai-400 mb-5">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">HireGenius AI Chatbot</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Intelligent conversational assistant that writes job descriptions for recruiters and conducts mock technical interviews for candidates.
              </p>
              <ul className="mt-4 space-y-1.5 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Real-time streaming markdown</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Resume bullet-point optimizer</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
