import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, CheckCircle2, ShieldAlert, X, ArrowRight } from 'lucide-react';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureTitle: string;
  featureDescription: string;
  requiredPlanName?: string;
  requiredPlanPrice?: string;
  targetPlanCode?: string;
}

export const PaywallModal: React.FC<PaywallModalProps> = ({
  isOpen,
  onClose,
  featureTitle,
  featureDescription,
  requiredPlanName = 'Candidate Pro',
  requiredPlanPrice = '₹299/mo',
  targetPlanCode = 'CANDIDATE_PRO',
}) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleUpgrade = () => {
    onClose();
    navigate(`/checkout/${targetPlanCode}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-dark-surface border border-brand-500/40 shadow-2xl p-6 sm:p-8 overflow-hidden">
        {/* Glow accent in background */}
        <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-brand-600/30 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-ai-600/30 blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-dark-elevated transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon */}
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-ai-600 flex items-center justify-center shadow-glow-brand mb-5">
          <Sparkles className="w-6 h-6 text-white" />
        </div>

        {/* Feature Context */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-semibold mb-3">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Premium Feature Restricted</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Unlock {featureTitle}
        </h3>
        <p className="text-sm text-slate-300 mt-2 leading-relaxed">
          {featureDescription}
        </p>

        {/* Value Proposition list */}
        <div className="mt-5 p-4 rounded-xl bg-dark-bg/60 border border-dark-border space-y-2.5 text-xs text-slate-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>AI-powered semantic skill gap & resume keyword optimization</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Multi-language Monaco coding sandbox with hidden test suites</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Unlimited context-aware conversational AI assistance & interview prep</span>
          </div>
        </div>

        {/* Plan Upgrade summary */}
        <div className="mt-6 flex items-center justify-between p-3.5 rounded-xl bg-gradient-to-r from-brand-950/70 to-dark-surface border border-brand-500/30">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Required Plan
            </span>
            <span className="font-bold text-base text-white">{requiredPlanName}</span>
          </div>
          <div className="text-right">
            <span className="text-lg font-extrabold text-brand-400">{requiredPlanPrice}</span>
            <span className="text-[11px] text-slate-400 block">Billed monthly</span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white bg-dark-elevated hover:bg-dark-elevated/80 transition-colors"
          >
            Maybe Later
          </button>
          <button
            onClick={handleUpgrade}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-brand-600 to-ai-600 hover:from-brand-500 hover:to-ai-500 shadow-glow-brand transition-all duration-200 flex items-center justify-center gap-2"
          >
            <span>Upgrade Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
