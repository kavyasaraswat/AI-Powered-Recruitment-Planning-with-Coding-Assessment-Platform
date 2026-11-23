import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Shield, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-dark-border bg-dark-bg/95 text-slate-400 py-12 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand info */}
        <div className="space-y-3 md:col-span-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-ai-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white text-base">HireGenius.ai</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            AI-powered recruitment planning, resume semantic parsing, and Monaco automated coding assessment platform.
          </p>
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <Shield className="w-3.5 h-3.5 text-emerald-500" />
            <span>Final Year B.Tech CSE Project</span>
          </div>
        </div>

        {/* Product links */}
        <div>
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">Platform</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/jobs" className="hover:text-white transition-colors">Job Openings</Link></li>
            <li><Link to="/assessment/q-1" className="hover:text-white transition-colors">Coding Sandbox</Link></li>
            <li><Link to="/chat" className="hover:text-white transition-colors">HireGenius AI Chatbot</Link></li>
            <li><Link to="/candidate/resume" className="hover:text-white transition-colors">Resume AI Parser</Link></li>
          </ul>
        </div>

        {/* Roles links */}
        <div>
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">Roles</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/candidate/dashboard" className="hover:text-white transition-colors">Candidate Hub</Link></li>
            <li><Link to="/recruiter/dashboard" className="hover:text-white transition-colors">Recruiter Workspace</Link></li>
            <li><Link to="/admin/dashboard" className="hover:text-white transition-colors">Administrator Panel</Link></li>
            <li><Link to="/pricing" className="hover:text-white transition-colors">Subscription Plans</Link></li>
          </ul>
        </div>

        {/* Security & System */}
        <div>
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">Security & Compliance</h4>
          <p className="text-xs text-slate-400 leading-relaxed mb-3">
            Anti-bias AI matching algorithms. Code executions sandboxed in isolated runtimes. PCI-DSS compliant payments via Razorpay and Stripe.
          </p>
          <p className="text-[11px] text-slate-500 flex items-center gap-1">
            Engineered with <Heart className="w-3 h-3 text-rose-500" /> for Computer Science & Engineering.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-dark-border/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <p>&copy; {new Date().getFullYear()} HireGenius AI. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
          <span>•</span>
          <span className="hover:text-slate-300 cursor-pointer">Terms of Service</span>
          <span>•</span>
          <span className="hover:text-slate-300 cursor-pointer">Fair-Use AI Guidelines</span>
        </div>
      </div>
    </footer>
  );
};
