import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { Sparkles, Lock, Mail, ArrowRight, Eye, EyeOff, Shield } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'candidate' | 'recruiter' | 'admin'>('candidate');
  const [isLoading, setIsLoading] = useState(false);

  const { login, switchDemoRole } = useAuth();
  const { addToast } = useNotification();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      addToast('error', 'Validation Error', 'Please enter your email and password.');
      return;
    }

    setIsLoading(true);
    // Simulate real server auth handshake
    setTimeout(() => {
      setIsLoading(false);
      switchDemoRole(selectedRole);
      addToast('success', 'Authenticated Successfully', `Welcome back to HireGenius AI as ${selectedRole}!`);

      if (selectedRole === 'candidate') navigate('/candidate/dashboard');
      else if (selectedRole === 'recruiter') navigate('/recruiter/dashboard');
      else navigate('/admin/dashboard');
    }, 600);
  };

  const fillQuickDemo = (role: 'candidate' | 'recruiter' | 'admin') => {
    setSelectedRole(role);
    if (role === 'candidate') {
      setEmail('aditya@hiregenius.ai');
      setPassword('CandidatePass123!');
    } else if (role === 'recruiter') {
      setEmail('rohit.deshmukh@cloudscale.io');
      setPassword('RecruiterPass123!');
    } else {
      setEmail('admin@hiregenius.ai');
      setPassword('AdminPass123!');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-dark-surface border border-dark-border p-8 shadow-2xl relative overflow-hidden">
        {/* Top glow decoration */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-brand-600/30 blur-3xl pointer-events-none rounded-full" />

        {/* Brand header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-brand-600 to-ai-600 flex items-center justify-center mx-auto shadow-glow-brand mb-3">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Sign in to HireGenius</h2>
          <p className="text-xs text-slate-400 mt-1">
            Access your AI recruitment dashboard & coding portal
          </p>
        </div>

        {/* Demo Fast-Fill Bar */}
        <div className="mb-6 p-2.5 rounded-xl bg-dark-bg/60 border border-dark-border">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-1.5">
            <span className="flex items-center gap-1">
              <Shield className="w-3 h-3 text-brand-400" />
              1-Click Demo Login:
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => fillQuickDemo('candidate')}
              className={`py-1 rounded font-medium transition-colors ${
                selectedRole === 'candidate'
                  ? 'bg-brand-600 text-white'
                  : 'bg-dark-elevated text-slate-300 hover:text-white'
              }`}
            >
              Candidate
            </button>
            <button
              type="button"
              onClick={() => fillQuickDemo('recruiter')}
              className={`py-1 rounded font-medium transition-colors ${
                selectedRole === 'recruiter'
                  ? 'bg-brand-600 text-white'
                  : 'bg-dark-elevated text-slate-300 hover:text-white'
              }`}
            >
              Recruiter
            </button>
            <button
              type="button"
              onClick={() => fillQuickDemo('admin')}
              className={`py-1 rounded font-medium transition-colors ${
                selectedRole === 'admin'
                  ? 'bg-brand-600 text-white'
                  : 'bg-dark-elevated text-slate-300 hover:text-white'
              }`}
            >
              Admin
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-dark-bg border border-dark-border text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-300">Password</label>
              <a href="#" className="text-xs text-brand-400 hover:text-brand-300">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-dark-bg border border-dark-border text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 rounded-xl font-semibold text-white bg-brand-600 hover:bg-brand-500 shadow-glow-brand transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-brand-400 font-semibold hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};
