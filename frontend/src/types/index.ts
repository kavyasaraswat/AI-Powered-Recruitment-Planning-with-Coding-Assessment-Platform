export type UserRole = 'candidate' | 'recruiter' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  isEmailVerified?: boolean;
  currentSubscription?: {
    planCode: string;
    status: 'active' | 'canceled' | 'past_due' | 'expired';
    validUntil?: string;
    billingCycle?: 'monthly' | 'yearly';
  };
  createdAt?: string;
}

export interface CandidateProfile {
  id: string;
  userId: string;
  headline: string;
  bio: string;
  location: string;
  githubUrl: string;
  linkedinUrl: string;
  portfolioUrl: string;
  skills: Array<{ name: string; level: 'beginner' | 'intermediate' | 'advanced' | 'expert' }>;
  education: Array<{ institution: string; degree: string; fieldOfStudy: string; startYear: number; endYear?: number }>;
  experience: Array<{ company: string; title: string; startDate: string; endDate?: string; isCurrent: boolean; description: string }>;
  certifications: Array<{ title: string; issuingOrganization: string; issueDate: string }>;
}

export interface Job {
  id: string;
  title: string;
  companyName: string;
  companyLogo?: string;
  department: string;
  jobType: 'Full-time' | 'Part-time' | 'Contract' | 'Remote' | 'Internship';
  workplaceType: 'On-site' | 'Hybrid' | 'Remote';
  location: string;
  experienceLevel: 'Entry' | 'Mid' | 'Senior' | 'Lead';
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  description: string;
  requiredSkills: string[];
  preferredSkills: string[];
  applicantCount: number;
  status: 'published' | 'closed';
  createdAt: string;
  matchScore?: number;
}

export interface Application {
  id: string;
  jobId: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  candidateHeadline?: string;
  jobTitle: string;
  companyName: string;
  status: 'applied' | 'screening' | 'shortlisted' | 'assessment' | 'interview' | 'selected' | 'rejected';
  appliedAt: string;
  aiMatchingScore?: {
    overallScore: number;
    skillsScore: number;
    experienceScore: number;
    matchedSkills: string[];
    missingSkills: string[];
    explanation: string;
  };
  assessmentScore?: number;
}

export interface CodingQuestion {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  description: string;
  constraints: string[];
  starterCode: Record<string, string>;
  publicTestCases: Array<{ input: string; expectedOutput: string; explanation?: string }>;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  code: string;
  targetRole: 'candidate' | 'recruiter';
  priceMonthly: number;
  priceYearly: number;
  features: string[];
  isPopular?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'application' | 'assessment' | 'interview' | 'billing' | 'system';
  linkUrl?: string;
  isRead: boolean;
  createdAt: string;
}
