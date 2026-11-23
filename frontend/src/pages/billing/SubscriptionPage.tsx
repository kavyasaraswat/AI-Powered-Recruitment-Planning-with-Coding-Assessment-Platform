import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import {
  CreditCard,
  CheckCircle2,
  Calendar,
  Download,
  AlertTriangle,
  ArrowRight,
  Shield,
  Layers,
  Sparkles
} from 'lucide-react';

const MOCK_INVOICES = [
  { id: 'INV-2026-003', date: '2026-11-01', plan: 'Candidate Pro (Monthly)', amount: '₹299.00', status: 'Paid' },
  { id: 'INV-2026-002', date: '2026-10-01', plan: 'Candidate Pro (Monthly)', amount: '₹299.00', status: 'Paid' },
  { id: 'INV-2026-001', date: '2026-09-01', plan: 'Candidate Pro (Monthly)', amount: '₹299.00', status: 'Paid' },
];

export const SubscriptionPage: React.FC = () => {
  const { user } = useAuth();
  const { addToast } = useNotification();

  const handleDownloadInvoice = (invId: string) => {
    addToast('success', 'Invoice Downloaded', `${invId}.pdf generated and downloaded.`);
  };

  const handleCancelSubscription = () => {
    addToast('warning', 'Subscription Policy', 'Your subscription remains active until the end of the current billing cycle.');
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Subscription & Billing Management
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Review your active SaaS tier, monitor AI entitlement quotas, and view past tax invoices.
        </p>
      </div>

      {/* Active Subscription Summary Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-dark-surface border border-brand-500/30 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-dark-border">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Active Subscription
              </span>
              <span className="text-xs text-slate-400">Renews on Dec 31, 2026</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white mt-2">
              {user?.currentSubscription?.planCode || 'CANDIDATE_PRO'} Plan
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Billed via Razorpay Auto-Debit (Monthly cycle).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/pricing"
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 shadow-glow-brand transition-colors"
            >
              Change / Upgrade Plan
            </Link>
            <button
              onClick={handleCancelSubscription}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-dark-border transition-colors"
            >
              Cancel Renewal
            </button>
          </div>
        </div>

        {/* Feature Quotas Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-dark-bg border border-dark-border space-y-2">
            <span className="font-semibold text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-brand-400" />
              Daily AI Chatbot Queries
            </span>
            <div className="text-lg font-bold text-white">85 / 100 Used</div>
            <div className="w-full h-1.5 rounded-full bg-dark-elevated overflow-hidden">
              <div className="h-full bg-brand-500 rounded-full" style={{ width: '85%' }} />
            </div>
            <span className="text-[10px] text-slate-400">Resets daily at 00:00 UTC</span>
          </div>

          <div className="p-4 rounded-xl bg-dark-bg border border-dark-border space-y-2">
            <span className="font-semibold text-slate-400 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-ai-400" />
              Resume AI Analyses
            </span>
            <div className="text-lg font-bold text-white">Unlimited</div>
            <div className="w-full h-1.5 rounded-full bg-dark-elevated overflow-hidden">
              <div className="h-full bg-ai-500 rounded-full" style={{ width: '100%' }} />
            </div>
            <span className="text-[10px] text-slate-400">Pro tier feature unlocked</span>
          </div>

          <div className="p-4 rounded-xl bg-dark-bg border border-dark-border space-y-2">
            <span className="font-semibold text-slate-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Coding Sandboxes Attempted
            </span>
            <div className="text-lg font-bold text-white">12 Challenges</div>
            <div className="w-full h-1.5 rounded-full bg-dark-elevated overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: '60%' }} />
            </div>
            <span className="text-[10px] text-slate-400">92% average pass rate</span>
          </div>
        </div>
      </div>

      {/* Invoice History Table */}
      <div className="p-6 rounded-2xl bg-dark-surface border border-dark-border shadow-card space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-brand-400" />
          Billing History & Tax Receipts (GST 18%)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] font-semibold text-slate-400 uppercase bg-dark-bg/60 border-b border-dark-border">
              <tr>
                <th className="py-3 px-4">Invoice ID</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {MOCK_INVOICES.map((inv) => (
                <tr key={inv.id} className="hover:bg-dark-elevated/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-semibold text-white">{inv.id}</td>
                  <td className="py-3.5 px-4 text-slate-400">{inv.date}</td>
                  <td className="py-3.5 px-4 text-slate-300">{inv.plan}</td>
                  <td className="py-3.5 px-4 font-bold text-white">{inv.amount}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleDownloadInvoice(inv.id)}
                      className="px-2.5 py-1 rounded-lg text-slate-300 hover:text-white bg-dark-bg hover:bg-dark-elevated border border-dark-border transition-colors inline-flex items-center gap-1 text-[11px]"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>PDF</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
