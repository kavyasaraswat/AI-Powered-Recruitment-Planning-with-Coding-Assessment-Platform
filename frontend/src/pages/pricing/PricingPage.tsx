import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SUBSCRIPTION_PLANS } from '../../services/mockData';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import {
  Check,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  CreditCard,
  Building,
  UserCheck
} from 'lucide-react';

export const PricingPage: React.FC = () => {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useNotification();

  const [targetAudience, setTargetAudience] = useState<'candidate' | 'recruiter'>(
    role === 'recruiter' ? 'recruiter' : 'candidate'
  );
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = SUBSCRIPTION_PLANS.filter((p) => p.targetRole === targetAudience);

  const handleSelectPlan = (planCode: string, price: number) => {
    if (price === 0) {
      addToast('info', 'Free Tier Active', 'You are currently on the complimentary starter tier.');
      return;
    }
    navigate(`/checkout/${planCode}?cycle=${billingCycle}`);
  };

  return (
    <div className="space-y-12 max-w-6xl mx-auto py-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 text-brand-300 text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Transparent, Configurable SaaS Pricing</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Invest in Your Career & Hiring Superpowers
        </h1>
        <p className="text-sm sm:text-base text-slate-300 mt-3 leading-relaxed">
          Choose the right plan to unlock AI resume optimization, Monaco sandbox assessments, and enterprise recruitment pipelines.
        </p>

        {/* Audience Toggle (Candidate vs Recruiter) */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <div className="inline-flex p-1.5 rounded-2xl bg-dark-surface border border-dark-border">
            <button
              onClick={() => setTargetAudience('candidate')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                targetAudience === 'candidate'
                  ? 'bg-brand-600 text-white shadow-glow-brand'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Candidate Plans</span>
            </button>
            <button
              onClick={() => setTargetAudience('recruiter')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                targetAudience === 'recruiter'
                  ? 'bg-brand-600 text-white shadow-glow-brand'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Building className="w-4 h-4" />
              <span>Recruiter Plans</span>
            </button>
          </div>

          {/* Billing Cycle Toggle */}
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300">
            <span className={billingCycle === 'monthly' ? 'text-white' : 'text-slate-500'}>Monthly</span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="w-11 h-6 rounded-full bg-dark-elevated p-1 transition-colors relative"
            >
              <div
                className={`w-4 h-4 rounded-full bg-brand-500 transition-transform ${
                  billingCycle === 'yearly' ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={billingCycle === 'yearly' ? 'text-white' : 'text-slate-500'}>
              Yearly <span className="text-[10px] text-emerald-400 font-bold ml-1">(Save 20%)</span>
            </span>
          </div>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => {
          const price = billingCycle === 'monthly' ? plan.priceMonthly : Math.round(plan.priceYearly / 12);
          const isCurrentPlan = user?.currentSubscription?.planCode === plan.code;

          return (
            <div
              key={plan.id}
              className={`rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 relative ${
                plan.isPopular
                  ? 'bg-gradient-to-b from-brand-950/60 to-dark-surface border-2 border-brand-500 shadow-glow-brand -translate-y-2'
                  : 'bg-dark-surface border border-dark-border shadow-card'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-brand-600 to-ai-600 text-white text-[10px] font-extrabold tracking-wider uppercase shadow-md">
                  Most Popular Choice
                </div>
              )}

              <div>
                <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white">
                    ₹{price}
                  </span>
                  <span className="text-xs text-slate-400">/ month</span>
                </div>
                {billingCycle === 'yearly' && plan.priceMonthly > 0 && (
                  <span className="text-[11px] text-emerald-400 block mt-1">
                    Billed annually (₹{plan.priceYearly}/yr)
                  </span>
                )}

                {/* Features List */}
                <div className="mt-6 pt-6 border-t border-dark-border space-y-3">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Included Features:
                  </span>
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-slate-200">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-dark-border">
                <button
                  onClick={() => handleSelectPlan(plan.code, plan.priceMonthly)}
                  disabled={isCurrentPlan}
                  className={`w-full py-3 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2 ${
                    isCurrentPlan
                      ? 'bg-dark-elevated text-slate-400 cursor-default'
                      : plan.isPopular
                      ? 'bg-gradient-to-r from-brand-600 to-ai-600 hover:from-brand-500 hover:to-ai-500 text-white shadow-glow-brand'
                      : 'bg-brand-600 hover:bg-brand-500 text-white'
                  }`}
                >
                  {isCurrentPlan ? (
                    <span>Current Active Plan</span>
                  ) : plan.priceMonthly === 0 ? (
                    <span>Included Free</span>
                  ) : (
                    <>
                      <span>Upgrade to {plan.name}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Security & Payment badge footer */}
      <div className="text-center p-6 rounded-2xl bg-dark-surface/50 border border-dark-border text-xs text-slate-400 flex flex-wrap items-center justify-center gap-6">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          PCI-DSS Compliant 256-Bit SSL
        </span>
        <span>•</span>
        <span className="flex items-center gap-1.5">
          <CreditCard className="w-4 h-4 text-brand-400" />
          Razorpay (UPI, Cards, NetBanking) & Stripe
        </span>
        <span>•</span>
        <span>Instant Activation & Cancel Anytime</span>
      </div>
    </div>
  );
};
