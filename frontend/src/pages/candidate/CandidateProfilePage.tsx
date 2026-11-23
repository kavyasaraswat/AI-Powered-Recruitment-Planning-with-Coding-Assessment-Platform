import React, { useState } from 'react';
import { MOCK_CANDIDATE_PROFILE } from '../../services/mockData';
import { useNotification } from '../../context/NotificationContext';
import { CandidateProfile } from '../../types';
import {
  User,
  Mail,
  MapPin,
  Github,
  Linkedin,
  Globe,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  GraduationCap,
  Briefcase,
  Award,
  Sparkles
} from 'lucide-react';

export const CandidateProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<CandidateProfile>(MOCK_CANDIDATE_PROFILE);
  const [newSkill, setNewSkill] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { addToast } = useNotification();

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    if (profile.skills.some((s) => s.name.toLowerCase() === newSkill.toLowerCase())) {
      addToast('warning', 'Skill Exists', 'This skill is already in your profile.');
      return;
    }

    setProfile((prev) => ({
      ...prev,
      skills: [...prev.skills, { name: newSkill.trim(), level: 'advanced' }],
    }));
    setNewSkill('');
    addToast('success', 'Skill Added', `${newSkill.trim()} added to your verified technical skills.`);
  };

  const handleRemoveSkill = (skillName: string) => {
    setProfile((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s.name !== skillName),
    }));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      addToast('success', 'Profile Updated', 'Your candidate profile and AI embeddings have been synchronized.');
    }, 600);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-dark-surface border border-dark-border shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop"
            alt="Candidate"
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-brand-500/50 shadow-glow-brand"
          />
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">Aditya Sharma</h1>
            <p className="text-xs text-brand-300 font-medium mt-0.5">{profile.headline}</p>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{profile.location}</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-brand-600 hover:bg-brand-500 shadow-glow-brand transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving Changes...' : 'Save Profile'}</span>
        </button>
      </div>

      {/* Main Profile Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Bio & Links */}
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-dark-surface border border-dark-border space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-brand-400" />
              Professional Links
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">GitHub Profile</label>
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-dark-bg border border-dark-border text-slate-200">
                  <Github className="w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={profile.githubUrl}
                    onChange={(e) => setProfile({ ...profile, githubUrl: e.target.value })}
                    className="bg-transparent focus:outline-none w-full"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">LinkedIn Profile</label>
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-dark-bg border border-dark-border text-slate-200">
                  <Linkedin className="w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={profile.linkedinUrl}
                    onChange={(e) => setProfile({ ...profile, linkedinUrl: e.target.value })}
                    className="bg-transparent focus:outline-none w-full"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Portfolio Website</label>
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-dark-bg border border-dark-border text-slate-200">
                  <Globe className="w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={profile.portfolioUrl}
                    onChange={(e) => setProfile({ ...profile, portfolioUrl: e.target.value })}
                    className="bg-transparent focus:outline-none w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bio input */}
          <div className="p-5 rounded-2xl bg-dark-surface border border-dark-border space-y-2">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">About & Bio</h3>
            <textarea
              rows={4}
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              className="w-full p-3 rounded-xl bg-dark-bg border border-dark-border text-xs text-slate-200 leading-relaxed focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>

        {/* Right Column: Skills, Experience, Education */}
        <div className="md:col-span-2 space-y-6">
          {/* Skills Management */}
          <div className="p-6 rounded-2xl bg-dark-surface border border-dark-border space-y-4 shadow-card">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-ai-400" />
                Technical Skills Inventory ({profile.skills.length})
              </h3>
            </div>

            {/* Add skill input */}
            <form onSubmit={handleAddSkill} className="flex gap-2">
              <input
                type="text"
                placeholder="Add technical skill (e.g. GraphQL, Kubernetes, Rust)..."
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-dark-bg border border-dark-border text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Skill</span>
              </button>
            </form>

            {/* Skill tags */}
            <div className="flex flex-wrap gap-2 pt-2">
              {profile.skills.map((skill) => (
                <div
                  key={skill.name}
                  className="group flex items-center gap-2 px-3 py-1.5 rounded-xl bg-dark-bg border border-dark-border text-xs font-medium text-slate-200 hover:border-brand-500/40 transition-colors"
                >
                  <span>{skill.name}</span>
                  <span className="text-[10px] text-brand-400 uppercase font-semibold">({skill.level})</span>
                  <button
                    onClick={() => handleRemoveSkill(skill.name)}
                    className="text-slate-500 hover:text-rose-400 transition-colors ml-1"
                    title="Remove skill"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Work Experience */}
          <div className="p-6 rounded-2xl bg-dark-surface border border-dark-border space-y-4 shadow-card">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-brand-400" />
              Work Experience
            </h3>

            <div className="space-y-4 divide-y divide-dark-border">
              {profile.experience.map((exp, idx) => (
                <div key={idx} className="pt-3 first:pt-0 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm text-white">{exp.title}</h4>
                    <span className="text-xs text-slate-400">{exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}</span>
                  </div>
                  <p className="text-xs text-brand-300 font-medium">{exp.company}</p>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Education & Certifications */}
          <div className="p-6 rounded-2xl bg-dark-surface border border-dark-border space-y-4 shadow-card">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-emerald-400" />
              Education & Verified Certifications
            </h3>

            <div className="space-y-3 text-xs">
              {profile.education.map((edu, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-dark-bg border border-dark-border">
                  <div className="font-semibold text-white">{edu.institution}</div>
                  <div className="text-slate-300 mt-0.5">{edu.degree} in {edu.fieldOfStudy} ({edu.startYear} - {edu.endYear})</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
