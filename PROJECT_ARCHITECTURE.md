# HireGenius AI — Comprehensive Project Architecture

## 1. Executive Summary
**HireGenius AI** is an enterprise-grade AI-powered Recruitment Planning and Coding Assessment SaaS platform. It automates resume screening, skills extraction, intelligent candidate-job matching, multi-language automated coding assessments in isolated sandboxes, AI career and recruiter chat assistance, multi-tier subscription billing (Razorpay & Stripe), and comprehensive admin control.

---

## 2. System Architecture Diagram

```
+-----------------------------------------------------------------------------------+
|                                  CLIENT LAYER                                     |
|  React 18/19 + TypeScript + Vite + Tailwind CSS + Framer Motion + Lucide Icons   |
|  - Role-based Layouts: Candidate, Recruiter, Admin                                |
|  - Monaco Code Editor Assessment Interface                                       |
|  - Interactive AI Chatbot (Streaming Markdown & Code)                             |
|  - Paywall & Subscription Management UI (Razorpay / Stripe)                      |
+-----------------------------------------------------------------------------------+
                                         |
                                  HTTPS / REST / SSE
                                         v
+-----------------------------------------------------------------------------------+
|                                API GATEWAY LAYER                                  |
|  Node.js + Express + TypeScript Router                                            |
|  - CORS, Helmet Security Headers, Express-Rate-Limit                              |
|  - JWT Authentication & Refresh Token Rotation Middleware                        |
|  - Role-Based Access Control (RBAC: Candidate, Recruiter, Admin)                 |
|  - Subscription Entitlement & Server-side Paywall Gatekeeper                      |
+-----------------------------------------------------------------------------------+
                                         |
        +--------------------------------+-------------------------------+
        |                                |                               |
        v                                v                               v
+-----------------------+   +--------------------------+   +--------------------------+
|    CORE SERVICES      |   |    AI & NLP SERVICES     |   |  CODE EXECUTION ENGINE   |
| - Auth & Profiles     |   | - Resume Parser (PDF/DOC)|   | - Monaco Client Runner   |
| - Job Management      |   | - TF-IDF / Cosine Vector |   | - Isolated Container VM  |
| - Application Pipeline|   | - Skill Extraction       |   | - Multi-lang: Py, JS, C, |
| - Notifications       |   | - Candidate Job Matcher  |   |   C++, Java              |
| - Billing & Webhooks  |   | - LLM Chatbot Engine     |   | - Memory & CPU Throttle  |
| - Admin & Audit Logs  |   | - Career Guidance Engine |   | - Strict Test Evaluator  |
+-----------------------+   +--------------------------+   +--------------------------+
        |                                |                               |
        +--------------------------------+-------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                                  DATA LAYER                                       |
|  MongoDB 8.0+ / MongoDB Atlas with Mongoose ODM                                   |
|  - 20 Relational & Indexed Collections                                            |
|  - Compound Indexes, TTL Sessions, Audit Logs & Invoices                          |
+-----------------------------------------------------------------------------------+
```

---

## 3. Core Modules Breakdown

### Module 1: Authentication & Role Management Module
- **Purpose**: Identity verification, secure authentication, role segregation.
- **Roles**: Candidate, Recruiter, Administrator.
- **Key Features**:
  - Email/Password registration with bcrypt password hashing (cost factor: 12).
  - JWT Access Tokens (short-lived, 15m - 24h) and Refresh Tokens (7 days, rotatable in HTTP-only cookies).
  - Role-Based Authorization Guard (`protect`, `restrictTo('candidate', 'recruiter', 'admin')`).
  - Password reset tokens via crypto SHA-256 and SMTP mailers.

### Module 2: Candidate Module
- **Purpose**: Candidate profile, skills showcase, portfolio links, applied job tracking.
- **Key Features**:
  - Profile builder: Personal info, GitHub, LinkedIn, bio, education, experience, skills, certifications.
  - Resume upload (.pdf, .docx) with malware file-signature validation.
  - Application status tracker: Applied -> Screening -> Shortlisted -> Assessment -> Interview -> Hired/Rejected.
  - Practice coding hub and assessment history.

### Module 3: Recruiter Module
- **Purpose**: Talent acquisition portal for recruiters and hiring managers.
- **Key Features**:
  - Company profile management with brand logo, size, industry, and locations.
  - Applicant tracking kanban and tabular workflows.
  - Action controls: Shortlist, Invite to Assessment, Schedule Interview, Select, Reject.
  - Recruiter candidate notes and interview scheduling.

### Module 4: Administrator Module
- **Purpose**: System governance, financial auditing, and administrative surveillance.
- **Key Features**:
  - User and organization management (Activate, Suspend, Ban).
  - Platform metrics: Total registrations, active jobs, gross recurring revenue (MRR/ARR), system health.
  - Subscription plan management and AI usage throttle controls.
  - Audit logging for administrative activities.

### Module 5: Job Management Module
- **Purpose**: Full lifecycle management of job requisitions.
- **Key Features**:
  - Dynamic job creation with title, description, department, location, job type (Full-time, Remote, Hybrid), salary range.
  - Skill requirements: Mandatory vs. Preferred tags.
  - Configurable application deadline and vacancy status (Draft, Published, Closed).
  - Public searchable job board with multi-facet filters.

### Module 6: Resume Management Module
- **Purpose**: Secure resume parsing, storage, and entity extraction.
- **Key Features**:
  - Multi-part document upload with size restriction (up to 10MB).
  - Extraction pipeline: contact details, education, chronological experience, skills catalog, project entities.
  - Secure document access control preventing cross-candidate unauthorized downloads.

### Module 7: AI Matching Module
- **Purpose**: Transparent, unbiased algorithmic matching between candidate profiles and job requirements.
- **Key Features**:
  - Skill vector matching & semantic similarity.
  - Experience weighting, education baseline validation.
  - Score generation (0 to 100) with explainable component breakdown:
    - Overall match percentage.
    - Matched skills list & Missing skills recommendations.
    - Experience alignment and qualitative summary.
  - Strict anti-bias constraints: No demographic or protected traits used in ranking.

### Module 8: Coding Assessment Module
- **Purpose**: Technical assessment portal with Monaco editor.
- **Key Features**:
  - Recruiter custom challenge creator with difficulty (Easy, Medium, Hard), time limit, instructions.
  - Language support: Python, JavaScript, Java, C, C++.
  - Test case definitions: Public example test cases + hidden verification test cases.
  - Monaco editor with syntax highlighting, auto-completion, multi-tab test runner.

### Module 9: Automated Code Execution & Evaluation Module
- **Purpose**: Secure, sandboxed evaluation of candidate code against assertions.
- **Key Features**:
  - Isolated execution environment (containerized/worker process with memory and time bounds).
  - Execution limits: 5000ms max CPU time, 256MB memory cap.
  - Output assertion: standard output vs. expected output comparisons.
  - Detailed telemetry: Passed tests, Failed tests, runtime duration (ms), memory footprint.

### Module 10: AI Recruitment Chatbot Module ("HireGenius AI Assistant")
- **Purpose**: Multi-persona conversational agent for candidates and recruiters.
- **Candidate Capabilities**:
  - Resume bullet point re-writing and action-verb enhancement.
  - Technical mock interview questions & code debugging assistance.
  - Career gap explanation and skills roadmap generator.
- **Recruiter Capabilities**:
  - Automated Job Description generator from keywords.
  - Interview question formulation based on candidate tech stack.
  - Candidate comparative analysis summaries.
- **Architecture**:
  - Streaming responses with Markdown and syntax highlighting.
  - Conversation persistence, session renaming, deletion, and token usage limits.

### Module 11: Subscription & Billing Module
- **Purpose**: Monetization, SaaS tier management, and payment verification.
- **Candidate Tiers**:
  - Free (₹0): Basic profile, 10 AI queries/day, basic assessments.
  - Pro (₹299/mo): Detailed match analysis, 100 AI queries/day, advanced coding problems.
  - Premium (₹599/mo): Unlimited AI career advisor, mock interviews, priority application badge.
- **Recruiter Tiers**:
  - Free Recruiter (₹0): 1 active job, limited applicants, standard filters.
  - Recruiter Pro (₹999/mo): 10 active jobs, AI resume matching, custom coding tests, analytics.
  - Enterprise (₹2,499/mo): Unlimited jobs, team collaboration, bulk candidate parsing, priority support.
- **Gateway Integration**:
  - Razorpay Orders, Subscriptions, Signatures (`HMAC-SHA256` verification).
  - Stripe Checkout Session & Webhook handling.
  - Server-side paywall authorization middleware.

### Module 12: Notification Module
- **Purpose**: Multi-channel transactional notifications.
- **Key Features**:
  - Real-time in-app notification center with read/unread markers.
  - Triggered events: Job applied, status change, assessment invite, payment success, invoice ready.
  - SMTP email dispatch with responsive HTML notification templates.

### Module 13: Analytics & Reporting Module
- **Purpose**: Quantitative intelligence dashboards for candidates, recruiters, and platform admins.
- **Candidate Analytics**: Application velocity, assessment score distribution, skill acquisition matrix.
- **Recruiter Analytics**: Funnel conversion rates, time-to-hire, source effectiveness, assessment benchmark curves.
- **Admin Analytics**: Revenue trends, monthly active users, token consumption heatmaps.

---

## 4. Security & Compliance Architecture
1. **Zero Trust Authentication**: Passwords hashed with bcrypt (salt rounds = 12). JWT with short expiry.
2. **Server-Side Paywall Enforcement**: Every premium endpoint checks subscription state in the database before processing.
3. **Execution Sandboxing**: Code submitted by candidates is executed with strict resource constraints, disallowing network sockets, process forking, or sensitive filesystem access.
4. **Data Sanitization & Injection Prevention**: Mongoose strict schemas protect against NoSQL injection; DOMPurify and escape routines sanitize inputs against XSS.
5. **Idempotent Financial Transactions**: Webhooks verify cryptographic signatures prior to granting entitlements, preventing replay attacks.
