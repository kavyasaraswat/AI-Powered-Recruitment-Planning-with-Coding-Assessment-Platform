import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { INITIAL_JOBS } from '../../services/mockData';
import { Job } from '../../types';
import {
  Briefcase,
  Search,
  MapPin,
  Building,
  DollarSign,
  Sparkles,
  Filter,
  CheckCircle2,
  ArrowRight,
  Layers
} from 'lucide-react';

export const JobListingPage: React.FC = () => {
  const [jobs] = useState<Job[]>(INITIAL_JOBS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.requiredSkills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = selectedType === 'all' || job.workplaceType.toLowerCase() === selectedType.toLowerCase();
    const matchesLevel = selectedLevel === 'all' || job.experienceLevel.toLowerCase() === selectedLevel.toLowerCase();

    return matchesSearch && matchesType && matchesLevel;
  });

  return (
    <div className="space-y-8">
      {/* Search Header Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-brand-950/60 via-dark-surface to-dark-surface border border-dark-border shadow-xl">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-500/10 text-brand-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Semantic Career Matching</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Discover Verified High-Impact Engineering Roles
          </h1>
          <p className="text-sm text-slate-300 mt-2">
            Every opening includes transparent salary ranges and instant AI compatibility scoring against your resume.
          </p>

          {/* Search bar */}
          <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-5 h-5 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search by job title, company, or skills (e.g., React, Python, Docker)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-dark-bg border border-dark-border text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Filter Sidebar + Job Results */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filter Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="p-5 rounded-2xl bg-dark-surface border border-dark-border space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-dark-border">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-brand-400" />
                Filter Roles
              </span>
              {(selectedType !== 'all' || selectedLevel !== 'all' || searchTerm) && (
                <button
                  onClick={() => {
                    setSelectedType('all');
                    setSelectedLevel('all');
                    setSearchTerm('');
                  }}
                  className="text-xs text-brand-400 hover:text-brand-300"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Workplace filter */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">Workplace Type</label>
              <div className="space-y-1.5 text-xs">
                {['all', 'Remote', 'Hybrid', 'On-site'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg transition-colors ${
                      selectedType === type
                        ? 'bg-brand-600/20 text-brand-300 font-semibold border border-brand-500/30'
                        : 'text-slate-400 hover:text-white hover:bg-dark-elevated'
                    }`}
                  >
                    {type === 'all' ? 'All Workplace Types' : type}
                  </button>
                ))}
              </div>
            </div>

            {/* Experience level filter */}
            <div className="space-y-2 pt-2 border-t border-dark-border">
              <label className="text-xs font-semibold text-slate-300 block">Experience Level</label>
              <div className="space-y-1.5 text-xs">
                {['all', 'Entry', 'Mid', 'Senior', 'Lead'].map((level) => (
                  <button
                    key={level}
                    onClick={() => setSelectedLevel(level)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg transition-colors ${
                      selectedLevel === level
                        ? 'bg-brand-600/20 text-brand-300 font-semibold border border-brand-500/30'
                        : 'text-slate-400 hover:text-white hover:bg-dark-elevated'
                    }`}
                  >
                    {level === 'all' ? 'All Seniority Levels' : `${level} Level`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Job Listings Column */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Showing {filteredJobs.length} open positions</span>
            <span>Sorted by AI Relevance</span>
          </div>

          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="p-6 rounded-2xl bg-dark-surface border border-dark-border hover:border-brand-500/40 transition-all duration-300 space-y-4 shadow-card"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <img
                    src={job.companyLogo}
                    alt={job.companyName}
                    className="w-12 h-12 rounded-xl object-cover ring-1 ring-dark-border shrink-0"
                  />
                  <div>
                    <h3 className="text-lg font-bold text-white hover:text-brand-300 transition-colors">
                      <Link to={`/jobs/${job.id}`}>{job.title}</Link>
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-400">
                      <span className="font-semibold text-slate-200">{job.companyName}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {job.location}
                      </span>
                      <span>•</span>
                      <span className="px-2 py-0.5 rounded bg-dark-elevated text-slate-300">
                        {job.jobType}
                      </span>
                    </div>
                  </div>
                </div>

                {/* AI Match Badge */}
                {job.matchScore && (
                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1 shrink-0">
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-gradient-to-r from-brand-600/20 to-ai-600/20 text-brand-300 border border-brand-500/30">
                      {job.matchScore}% Match
                    </span>
                    <span className="text-[10px] text-slate-400">Based on your resume</span>
                  </div>
                )}
              </div>

              <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                {job.description}
              </p>

              {/* Skills Tags & Compensation */}
              <div className="pt-2 border-t border-dark-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-wrap gap-1.5">
                  {job.requiredSkills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-dark-bg text-slate-300 border border-dark-border"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                  <div className="text-left sm:text-right">
                    <span className="text-xs font-bold text-white">
                      ₹{(job.salary.min / 100000).toFixed(1)}L - ₹{(job.salary.max / 100000).toFixed(1)}L
                    </span>
                    <span className="text-[10px] text-slate-400 block">per annum</span>
                  </div>

                  <Link
                    to={`/jobs/${job.id}`}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 shadow-glow-brand transition-colors flex items-center gap-1.5"
                  >
                    <span>View & Apply</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
