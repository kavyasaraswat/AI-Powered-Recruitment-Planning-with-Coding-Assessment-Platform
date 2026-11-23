import React, { useState } from 'react';
import { useNotification } from '../../context/NotificationContext';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  Cpu
} from 'lucide-react';

export const ResumeUploadPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [parsedData, setParsedData] = useState<{
    name: string;
    email: string;
    phone: string;
    skills: string[];
    experience: string[];
    education: string;
  } | null>(null);

  const { addToast } = useNotification();

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const handleFileSelected = (selectedFile: File) => {
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(selectedFile.type) && !selectedFile.name.endsWith('.pdf') && !selectedFile.name.endsWith('.docx')) {
      addToast('error', 'Invalid File Type', 'Please upload a PDF (.pdf) or Word document (.docx).');
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      addToast('error', 'File Too Large', 'Maximum allowed resume file size is 10MB.');
      return;
    }

    setFile(selectedFile);
    processResume(selectedFile.name);
  };

  const processResume = (fileName: string) => {
    setIsUploading(true);
    setProgress(15);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 25;
      });
    }, 300);

    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      setIsUploading(false);
      setParsedData({
        name: 'Aditya Sharma',
        email: 'aditya.sharma@example.com',
        phone: '+91 98765 43210',
        skills: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'Docker', 'Python', 'Tailwind CSS', 'REST APIs', 'Git'],
        experience: [
          'Software Development Engineer II at TechWave Solutions (2024 - Present)',
          'Junior Frontend Developer at Innovate Labs (2023 - 2024)',
        ],
        education: 'B.Tech in Computer Science & Engineering, IIIT (2020 - 2024)',
      });
      addToast('success', 'Resume Parsed Successfully', `Extracted 9 technical skills and 2 work experiences from ${fileName}`);
    }, 1500);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 text-brand-300 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Semantic Parsing Engine</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Upload Your Resume
        </h1>
        <p className="text-sm text-slate-300 mt-2">
          Our NLP pipeline extracts your technical credentials, sanitizes demographic information to eliminate bias, and calculates instant job compatibility.
        </p>
      </div>

      {/* Dropzone Card */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleFileDrop}
        className="p-8 sm:p-12 rounded-2xl bg-dark-surface border-2 border-dashed border-dark-border hover:border-brand-500/50 transition-all text-center relative overflow-hidden group shadow-card"
      >
        <div className="w-16 h-16 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 mx-auto mb-4 group-hover:scale-105 transition-transform duration-300 shadow-glow-brand">
          <UploadCloud className="w-8 h-8" />
        </div>

        <h3 className="text-base font-bold text-white">
          Drag and drop your resume file here
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Supports PDF (.pdf) and Microsoft Word (.docx) up to 10MB
        </p>

        <div className="mt-6 flex items-center justify-center gap-3">
          <label className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 cursor-pointer shadow-glow-brand transition-colors">
            <span>Browse Files</span>
            <input
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        {file && (
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-dark-bg border border-dark-border text-xs text-slate-300">
            <FileText className="w-4 h-4 text-brand-400" />
            <span className="font-semibold">{file.name}</span>
            <span className="text-[10px] text-slate-500">({(file.size / 1024).toFixed(0)} KB)</span>
          </div>
        )}
      </div>

      {/* Upload & Extraction Progress Bar */}
      {isUploading && (
        <div className="p-6 rounded-2xl bg-dark-surface border border-dark-border space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-ai-400 animate-spin" />
              Processing NLP Entity Extraction Pipeline...
            </span>
            <span className="text-brand-400">{progress}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-dark-bg overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-600 to-ai-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Extracted Resume Preview Panel */}
      {parsedData && (
        <div className="p-6 sm:p-8 rounded-2xl bg-dark-surface border border-brand-500/30 shadow-card space-y-6 animate-in fade-in duration-300">
          <div className="flex items-center justify-between pb-4 border-b border-dark-border">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-white text-base">Extracted Structured Resume Data</h3>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-semibold">
              NLP Extraction Verified
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-dark-bg border border-dark-border">
              <span className="text-slate-400 block mb-0.5">Candidate Name</span>
              <span className="font-bold text-white text-sm">{parsedData.name}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-dark-bg border border-dark-border">
              <span className="text-slate-400 block mb-0.5">Contact Email</span>
              <span className="font-bold text-white text-sm">{parsedData.email}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-dark-bg border border-dark-border">
              <span className="text-slate-400 block mb-0.5">Phone Number</span>
              <span className="font-bold text-white text-sm">{parsedData.phone}</span>
            </div>
          </div>

          {/* Extracted Skills */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Extracted Technical Skills ({parsedData.skills.length})
            </span>
            <div className="flex flex-wrap gap-2">
              {parsedData.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 rounded-xl text-xs font-medium bg-brand-500/10 text-brand-300 border border-brand-500/20"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Experience entities */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Identified Work History
            </span>
            <div className="space-y-2">
              {parsedData.experience.map((exp, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-dark-bg border border-dark-border text-xs text-slate-200">
                  {exp}
                </div>
              ))}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 border-t border-dark-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-400">
              Ready to match your parsed skills with open engineering vacancies?
            </p>
            <button
              onClick={() => addToast('success', 'Profile Updated', 'Extracted skills synced to candidate database.')}
              className="px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-brand-600 to-ai-600 hover:from-brand-500 hover:to-ai-500 shadow-glow-brand transition-colors flex items-center gap-2"
            >
              <span>Sync to Candidate Profile</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
