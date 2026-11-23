# HireGenius AI — Database Schema Specification

This document details the complete MongoDB/Mongoose database design for HireGenius AI. It contains 20 core collections with data types, references, validation constraints, and indexes.

---

## 1. User & Identity Collections

### 1.1 `users`
Core identity record for all platform actors.
```typescript
interface IUser {
  _id: ObjectId;
  name: string;
  email: string;              // unique, lowercase, indexed
  passwordHash: string;       // bcrypt hashed
  role: 'candidate' | 'recruiter' | 'admin';
  avatarUrl?: string;
  phone?: string;
  isEmailVerified: boolean;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  currentSubscription?: {
    planId: ObjectId;         // ref: SubscriptionPlan
    status: 'active' | 'canceled' | 'past_due' | 'trialing' | 'expired';
    validUntil: Date;
    billingCycle: 'monthly' | 'yearly';
  };
  isActive: boolean;          // true = enabled, false = suspended
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
// Indexes: { email: 1 } unique, { role: 1 }, { "currentSubscription.status": 1 }
```

### 1.2 `candidate_profiles`
Detailed candidate resume data, credentials, and portfolios.
```typescript
interface ICandidateProfile {
  _id: ObjectId;
  userId: ObjectId;           // ref: User, unique
  headline: string;           // e.g. "Full Stack Engineer | React & Node.js"
  bio?: string;
  location?: {
    city?: string;
    state?: string;
    country?: string;
    isRemoteOnly?: boolean;
  };
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  skills: Array<{
    name: string;
    level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    yearsOfExperience?: number;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startYear: number;
    endYear?: number;
    gradeOrCgpa?: string;
  }>;
  experience: Array<{
    company: string;
    title: string;
    location?: string;
    startDate: Date;
    endDate?: Date;
    isCurrent: boolean;
    description?: string;
  }>;
  certifications: Array<{
    title: string;
    issuingOrganization: string;
    issueDate: Date;
    credentialUrl?: string;
  }>;
  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
    liveUrl?: string;
    repoUrl?: string;
  }>;
  primaryResumeId?: ObjectId; // ref: Resume
  createdAt: Date;
  updatedAt: Date;
}
// Indexes: { userId: 1 } unique, { "skills.name": 1 }
```

### 1.3 `recruiter_profiles`
Recruiter professional credentials and associated enterprise entity.
```typescript
interface IRecruiterProfile {
  _id: ObjectId;
  userId: ObjectId;           // ref: User, unique
  companyId: ObjectId;        // ref: Company
  department?: string;
  designation?: string;
  workPhone?: string;
  isVerifiedRecruiter: boolean;
  createdAt: Date;
  updatedAt: Date;
}
// Indexes: { userId: 1 } unique, { companyId: 1 }
```

### 1.4 `companies`
Company profile and branding information.
```typescript
interface ICompany {
  _id: ObjectId;
  name: string;               // indexed
  website?: string;
  logoUrl?: string;
  industry: string;
  companySize: '1-10' | '11-50' | '51-200' | '201-500' | '500+';
  description?: string;
  locations: string[];
  recruiterAdminId: ObjectId; // ref: User
  verifiedBadge: boolean;
  createdAt: Date;
  updatedAt: Date;
}
// Indexes: { name: 1 }, { recruiterAdminId: 1 }
```

---

## 2. Jobs & Applications

### 2.1 `jobs`
Job requisitions published by recruiters.
```typescript
interface IJob {
  _id: ObjectId;
  companyId: ObjectId;        // ref: Company
  creatorRecruiterId: ObjectId;// ref: User
  title: string;
  description: string;
  department: string;
  jobType: 'full-time' | 'part-time' | 'contract' | 'internship' | 'remote';
  workplaceType: 'on-site' | 'hybrid' | 'remote';
  location: string;
  experienceLevel: 'entry' | 'mid' | 'senior' | 'lead' | 'executive';
  minExperienceYears: number;
  salary: {
    min: number;
    max: number;
    currency: string;         // 'INR', 'USD'
    isDisclosed: boolean;
  };
  requiredSkills: string[];   // e.g. ['React', 'Node.js', 'MongoDB']
  preferredSkills: string[];  // e.g. ['Docker', 'AWS']
  assessmentId?: ObjectId;    // ref: Assessment (Optional mandatory coding test)
  status: 'draft' | 'published' | 'closed' | 'archived';
  applicationDeadline?: Date;
  applicantCount: number;
  createdAt: Date;
  updatedAt: Date;
}
// Indexes: { status: 1, createdAt: -1 }, { requiredSkills: 1 }, { creatorRecruiterId: 1 }
```

### 2.2 `applications`
Candidate job application submissions and lifecycle progression.
```typescript
interface IApplication {
  _id: ObjectId;
  jobId: ObjectId;            // ref: Job
  candidateId: ObjectId;      // ref: User
  candidateProfileId: ObjectId;// ref: CandidateProfile
  resumeId: ObjectId;         // ref: Resume
  coverLetter?: string;
  status: 'applied' | 'screening' | 'shortlisted' | 'assessment' | 'interview' | 'selected' | 'rejected';
  aiMatchingScore?: {
    overallScore: number;     // 0 - 100
    skillsScore: number;
    experienceScore: number;
    educationScore: number;
    matchedSkills: string[];
    missingSkills: string[];
    explanation: string;
  };
  assessmentSubmissionId?: ObjectId; // ref: Submission
  notes: Array<{
    authorId: ObjectId;       // ref: User
    content: string;
    createdAt: Date;
  }>;
  interviewSchedule?: {
    scheduledAt: Date;
    meetingUrl?: string;
    notes?: string;
  };
  appliedAt: Date;
  updatedAt: Date;
}
// Indexes: { jobId: 1, candidateId: 1 } unique, { status: 1 }, { candidateId: 1 }
```

### 2.3 `resumes`
Uploaded resume metadata, parsed JSON structures, and file pointers.
```typescript
interface IResume {
  _id: ObjectId;
  candidateId: ObjectId;      // ref: User
  fileName: string;
  originalName: string;
  mimeType: string;           // 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  fileSize: number;           // bytes
  storagePath: string;
  parsedData?: {
    extractedName?: string;
    extractedEmail?: string;
    extractedPhone?: string;
    extractedSkills: string[];
    extractedEducation: Array<{ degree: string; institution: string; year?: string }>;
    extractedExperience: Array<{ role: string; organization: string; duration?: string }>;
    rawText: string;
  };
  parsingStatus: 'pending' | 'completed' | 'failed';
  createdAt: Date;
}
// Indexes: { candidateId: 1 }
```

### 2.4 `skills`
Master catalog of standardized skills for taxonomy and autocomplete.
```typescript
interface ISkill {
  _id: ObjectId;
  name: string;               // unique, lowercase indexed
  category: 'frontend' | 'backend' | 'devops' | 'mobile' | 'ai_ml' | 'database' | 'design' | 'management' | 'other';
  aliases: string[];
}
// Indexes: { name: 1 } unique
```

---

## 3. Coding Assessments & Automated Evaluation

### 3.1 `assessments`
Coding test configurations created by recruiters or platform administrators.
```typescript
interface IAssessment {
  _id: ObjectId;
  creatorId: ObjectId;        // ref: User
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  durationMinutes: number;    // e.g. 60
  passScorePercentage: number;// e.g. 70
  questionIds: ObjectId[];    // ref: Question[]
  isPublicPractice: boolean;  // true for candidates self-practice
  status: 'active' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}
// Indexes: { creatorId: 1 }, { isPublicPractice: 1 }
```

### 3.2 `questions`
Individual programming challenges.
```typescript
interface IQuestion {
  _id: ObjectId;
  title: string;
  slug: string;               // unique
  description: string;        // Markdown supported
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;           // 'Algorithms', 'Data Structures', 'Strings', etc.
  supportedLanguages: string[];// ['python', 'javascript', 'java', 'cpp', 'c']
  starterTemplates: Array<{
    language: string;
    code: string;
  }>;
  solutionTemplates?: Array<{
    language: string;
    code: string;
  }>;
  constraints: string[];
  publicTestCases: Array<{
    input: string;
    expectedOutput: string;
    explanation?: string;
  }>;
  hiddenTestCases: Array<{
    input: string;
    expectedOutput: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}
// Indexes: { slug: 1 } unique, { difficulty: 1 }, { category: 1 }
```

### 3.3 `test_cases`
Independent test suites for fine-grained assertions.
```typescript
interface ITestCase {
  _id: ObjectId;
  questionId: ObjectId;       // ref: Question
  input: string;
  expectedOutput: string;
  isHidden: boolean;
  weight: number;             // points awarded
}
// Indexes: { questionId: 1 }
```

### 3.4 `submissions`
Candidate code execution records and results.
```typescript
interface ISubmission {
  _id: ObjectId;
  assessmentId?: ObjectId;    // ref: Assessment
  questionId: ObjectId;       // ref: Question
  candidateId: ObjectId;      // ref: User
  language: string;           // 'python', 'javascript', etc.
  sourceCode: string;
  status: 'accepted' | 'wrong_answer' | 'time_limit_exceeded' | 'memory_limit_exceeded' | 'runtime_error' | 'compilation_error';
  totalTestCases: number;
  passedTestCases: number;
  scorePercentage: number;
  executionTimeMs: number;
  memoryUsageKb: number;
  testCaseResults: Array<{
    testCaseId?: ObjectId;
    passed: boolean;
    input?: string;           // shown only for public cases
    actualOutput?: string;
    expectedOutput?: string;
    errorMessage?: string;
    executionTimeMs: number;
  }>;
  submittedAt: Date;
}
// Indexes: { candidateId: 1 }, { questionId: 1 }, { assessmentId: 1 }
```

---

## 4. AI Chatbot Sessions & History

### 4.1 `chat_sessions`
Conversational memory instances for HireGenius AI Assistant.
```typescript
interface IChatSession {
  _id: ObjectId;
  userId: ObjectId;           // ref: User
  role: 'candidate' | 'recruiter';
  title: string;
  contextType: 'general' | 'resume_review' | 'interview_prep' | 'job_description' | 'code_explanation';
  relatedEntityId?: ObjectId; // optional reference to Job or Resume
  messageCount: number;
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}
// Indexes: { userId: 1, updatedAt: -1 }
```

### 4.2 `chat_messages`
Individual turns in a conversation.
```typescript
interface IChatMessage {
  _id: ObjectId;
  sessionId: ObjectId;        // ref: ChatSession
  sender: 'user' | 'assistant' | 'system';
  content: string;            // markdown formatted
  promptTokens?: number;
  completionTokens?: number;
  modelUsed?: string;
  feedback?: {
    isHelpful: boolean;
    comment?: string;
  };
  createdAt: Date;
}
// Indexes: { sessionId: 1, createdAt: 1 }
```

---

## 5. Subscriptions, Payments & Invoices

### 5.1 `subscription_plans`
Tier specifications for Candidates and Recruiters.
```typescript
interface ISubscriptionPlan {
  _id: ObjectId;
  name: string;               // 'Candidate Free', 'Candidate Pro', 'Recruiter Pro', etc.
  code: string;               // 'CANDIDATE_FREE', 'CANDIDATE_PRO', 'CANDIDATE_PREMIUM', 'RECRUITER_FREE', 'RECRUITER_PRO', 'ENTERPRISE'
  targetRole: 'candidate' | 'recruiter';
  priceMonthly: number;       // in INR
  priceYearly: number;        // in INR (with discount)
  currency: string;           // 'INR'
  features: string[];
  limits: {
    maxActiveJobs?: number;
    maxAiQueriesPerDay: number;
    canAccessAdvancedMatching: boolean;
    canCreateCustomAssessments: boolean;
    maxApplicantsPerJob?: number;
    hasPrioritySupport: boolean;
  };
  isActive: boolean;
  createdAt: Date;
}
// Indexes: { code: 1 } unique, { targetRole: 1 }
```

### 5.2 `subscriptions`
Customer active subscription records.
```typescript
interface ISubscription {
  _id: ObjectId;
  userId: ObjectId;           // ref: User
  planId: ObjectId;           // ref: SubscriptionPlan
  status: 'active' | 'canceled' | 'past_due' | 'expired';
  billingCycle: 'monthly' | 'yearly';
  amount: number;
  currency: string;
  gateway: 'razorpay' | 'stripe';
  gatewaySubscriptionId?: string;
  gatewayCustomerId?: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  canceledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
// Indexes: { userId: 1 }, { status: 1 }
```

### 5.3 `payments`
Transactional log of all checkout orders and verification receipts.
```typescript
interface IPayment {
  _id: ObjectId;
  userId: ObjectId;           // ref: User
  subscriptionId?: ObjectId;  // ref: Subscription
  planId: ObjectId;           // ref: SubscriptionPlan
  amount: number;             // e.g. 29900 (in paise)
  currency: string;           // 'INR'
  gateway: 'razorpay' | 'stripe';
  orderId: string;            // Razorpay Order ID or Stripe Session ID
  paymentId?: string;         // Razorpay Payment ID or Stripe Payment Intent ID
  signature?: string;         // HMAC verification signature
  status: 'created' | 'authorized' | 'captured' | 'failed' | 'refunded';
  errorMessage?: string;
  metadata?: Record<string, any>;
  paidAt?: Date;
  createdAt: Date;
}
// Indexes: { orderId: 1 } unique, { paymentId: 1 }, { userId: 1 }
```

### 5.4 `invoices`
Formal invoices generated after confirmed payments.
```typescript
interface IInvoice {
  _id: ObjectId;
  invoiceNumber: string;      // e.g. "INV-2026-0001"
  userId: ObjectId;           // ref: User
  paymentId: ObjectId;        // ref: Payment
  amount: number;
  taxAmount: number;          // GST 18%
  totalAmount: number;
  currency: string;
  billingDetails: {
    name: string;
    email: string;
    address?: string;
    gstin?: string;
  };
  pdfUrl?: string;
  issuedAt: Date;
}
// Indexes: { invoiceNumber: 1 } unique, { userId: 1 }
```

---

## 6. Notifications & System Auditing

### 6.1 `notifications`
In-app and transactional message logs.
```typescript
interface INotification {
  _id: ObjectId;
  recipientId: ObjectId;      // ref: User
  title: string;
  message: string;
  type: 'application_update' | 'assessment_invite' | 'interview_scheduled' | 'payment_success' | 'subscription_alert' | 'system';
  linkUrl?: string;
  isRead: boolean;
  createdAt: Date;
}
// Indexes: { recipientId: 1, isRead: 1, createdAt: -1 }
```

### 6.2 `activity_logs`
Security, administrative, and audit records.
```typescript
interface IActivityLog {
  _id: ObjectId;
  actorId?: ObjectId;         // ref: User (or system)
  action: string;             // e.g. "USER_LOGIN", "PLAN_UPGRADE", "JOB_PUBLISHED"
  ipAddress?: string;
  userAgent?: string;
  details?: Record<string, any>;
  createdAt: Date;
}
// Indexes: { actorId: 1, createdAt: -1 }, { action: 1 }
```
