import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/common/Layout';

// 17 Core SaaS Screens
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { CandidateDashboard } from './pages/candidate/CandidateDashboard';
import { RecruiterDashboard } from './pages/recruiter/RecruiterDashboard';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { JobListingPage } from './pages/jobs/JobListingPage';
import { JobDetailsPage } from './pages/jobs/JobDetailsPage';
import { CandidateProfilePage } from './pages/candidate/CandidateProfilePage';
import { ResumeUploadPage } from './pages/candidate/ResumeUploadPage';
import { CodingAssessmentPage } from './pages/assessment/CodingAssessmentPage';
import { ChatPage } from './pages/chat/ChatPage';
import { PricingPage } from './pages/pricing/PricingPage';
import { SubscriptionPage } from './pages/billing/SubscriptionPage';
import { CheckoutPage } from './pages/billing/CheckoutPage';
import { RecruiterAnalyticsPage } from './pages/recruiter/RecruiterAnalyticsPage';
import { SettingsPage } from './pages/settings/SettingsPage';

export const App: React.FC = () => {
  return (
    <Layout>
      <Routes>
        {/* Public & Auth */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Candidate Portal */}
        <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
        <Route path="/candidate/profile" element={<CandidateProfilePage />} />
        <Route path="/candidate/resume" element={<ResumeUploadPage />} />

        {/* Recruiter Portal */}
        <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
        <Route path="/recruiter/analytics" element={<RecruiterAnalyticsPage />} />

        {/* Administrator Portal */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* Job Requisitions */}
        <Route path="/jobs" element={<JobListingPage />} />
        <Route path="/jobs/:id" element={<JobDetailsPage />} />

        {/* Technical Coding Assessment (Monaco Sandbox) */}
        <Route path="/assessment/:id" element={<CodingAssessmentPage />} />

        {/* AI Chatbot Assistant */}
        <Route path="/chat" element={<ChatPage />} />

        {/* SaaS Subscriptions & Billing */}
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/billing" element={<SubscriptionPage />} />
        <Route path="/checkout/:planId" element={<CheckoutPage />} />

        {/* Global Settings */}
        <Route path="/settings" element={<SettingsPage />} />

        {/* 404 Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

export default App;
