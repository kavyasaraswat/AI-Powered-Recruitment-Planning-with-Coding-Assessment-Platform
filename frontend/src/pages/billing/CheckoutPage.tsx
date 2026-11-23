import React, { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { SUBSCRIPTION_PLANS } from '../../services/mockData';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  QrCode,
  DollarSign
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const { planId } = useParams<{ planId: string }>();
  const [searchParams] = useSearchParams();
  const billingCycle = searchParams.get('cycle') || 'monthly';
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const { addToast } = useNotification();

  const [gateway, setGateway] = useState<'razorpay' | 'stripe'>('razorpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const plan = SUBSCRIPTION_PLANS.find((p) => p.code === planId) || SUBSCRIPTION_PLANS[1];

  const basePrice = billingCycle === 'yearly' ? plan.priceYearly : plan.priceMonthly;
  const gstAmount = Math.round(basePrice * 0.18);
  const totalAmount = basePrice + gstAmount;

  const handleConfirmPayment = () => {
    setIsProcessing(true);

    // Simulate real Razorpay checkout modal / webhook signature verification
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      updateUser({
        currentSubscription: {
          planCode: plan.code,
          status: 'active',
          validUntil: '2027-12-31T23:59:59Z',
          billingCycle: billingCycle as any,
        },
      });
      addToast(
        'success',
        'Payment Verified & Activated!',
        `Your ${plan.name} subscription is now active via ${gateway.toUpperCase()}!`
      );
    }, 1200);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Complete Your Subscription Order
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Secure, 256-bit encrypted checkout with instant entitlement unlocking.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Payment Gateway Selection */}
        <div className="md:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl bg-dark-surface border border-dark-border shadow-card space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-brand-400" />
              Select Payment Gateway
            </h3>

            {/* Gateway Radios */}
            <div className="space-y-3">
              {/* Razorpay */}
              <label
                onClick={() => setGateway('razorpay')}
                className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  gateway === 'razorpay'
                    ? 'border-brand-500 bg-brand-500/10 shadow-glow-brand'
                    : 'border-dark-border bg-dark-bg/60 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full border border-brand-500 flex items-center justify-center">
                    {gateway === 'razorpay' && <div className="w-2 h-2 rounded-full bg-brand-500" />}
                  </div>
                  <div>
                    <span className="font-bold text-sm text-white block">Razorpay (India Preferred)</span>
                    <span className="text-xs text-slate-400">UPI (GPay, PhonePe, Paytm), Credit/Debit Cards, NetBanking</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-500/20 text-brand-300">
                  Instant UPI
                </span>
              </label>

              {/* Stripe */}
              <label
                onClick={() => setGateway('stripe')}
                className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  gateway === 'stripe'
                    ? 'border-brand-500 bg-brand-500/10 shadow-glow-brand'
                    : 'border-dark-border bg-dark-bg/60 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full border border-brand-500 flex items-center justify-center">
                    {gateway === 'stripe' && <div className="w-2 h-2 rounded-full bg-brand-500" />}
                  </div>
                  <div>
                    <span className="font-bold text-sm text-white block">Stripe (International)</span>
                    <span className="text-xs text-slate-400">Visa, MasterCard, American Express, Global Cards</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-dark-elevated text-slate-300">
                  Global
                </span>
              </label>
            </div>

            {/* Mock Card Preview Fields */}
            <div className="p-4 rounded-xl bg-dark-bg border border-dark-border space-y-3 text-xs">
              <span className="text-slate-400 font-semibold block">Billing Information:</span>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[11px] text-slate-500 block">Name on Account</span>
                  <span className="text-white font-medium">{user?.name}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block">Email Address</span>
                  <span className="text-white font-medium">{user?.email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Checkout Trigger */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-dark-surface border border-dark-border shadow-card space-y-4">
            <h3 className="text-sm font-bold text-white pb-3 border-b border-dark-border">
              Order Summary
            </h3>

            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex justify-between">
                <span>Plan:</span>
                <strong className="text-white">{plan.name}</strong>
              </div>
              <div className="flex justify-between">
                <span>Billing Frequency:</span>
                <strong className="text-white capitalize">{billingCycle}</strong>
              </div>
              <div className="flex justify-between">
                <span>Base Subtotal:</span>
                <span>₹{basePrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>GST (18%):</span>
                <span>₹{gstAmount.toLocaleString()}</span>
              </div>
              <div className="pt-2 border-t border-dark-border flex justify-between text-sm font-extrabold text-white">
                <span>Total Due:</span>
                <span className="text-brand-400">₹{totalAmount.toLocaleString()}</span>
              </div>
            </div>

            {paymentSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="font-bold text-white text-xs">Payment Confirmed!</h4>
                <p className="text-[11px] text-slate-300">
                  Your premium entitlement has been successfully unlocked.
                </p>
                <button
                  onClick={() => navigate(user?.role === 'recruiter' ? '/recruiter/dashboard' : '/candidate/dashboard')}
                  className="w-full mt-2 py-2 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors"
                >
                  Return to Dashboard
                </button>
              </div>
            ) : (
              <button
                onClick={handleConfirmPayment}
                disabled={isProcessing}
                className="w-full mt-4 py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-brand-600 to-ai-600 hover:from-brand-500 hover:to-ai-500 shadow-glow-brand transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Lock className="w-4 h-4" />
                <span>{isProcessing ? 'Verifying with Gateway...' : `Pay ₹${totalAmount.toLocaleString()} via ${gateway.toUpperCase()}`}</span>
              </button>
            )}

            <div className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1.5 pt-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verified Webhook Signature Guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
