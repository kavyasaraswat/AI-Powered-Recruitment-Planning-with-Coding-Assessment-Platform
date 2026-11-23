# HireGenius AI — Master 20-Phase Development Roadmap

This roadmap governs the entire development lifecycle of HireGenius AI. Each phase must be explicitly approved before proceeding to subsequent steps.

---

## Roadmap Overview

```
Phase 1: Architecture & Foundation [IN PROGRESS / COMPLETING]
   │
   ▼
Phase 2: Figma Integration & Design System
   │
   ▼
Phase 3: Frontend Development (React + TS + Tailwind)
   │
   ▼
Phase 4: Authentication & Role Management (JWT + RBAC)
   │
   ▼
Phase 5: Database Design & Mongoose Schemas (20 Collections)
   │
   ▼
Phase 6: Candidate Profile & Resume Management (PDF Parsing)
   │
   ▼
Phase 7: Recruiter Workspace & Job Pipeline Management
   │
   ▼
Phase 8: AI Resume Parsing & Candidate-Job Matching Engine
   │
   ▼
Phase 9: Online Coding Assessment (Monaco Editor + Sandbox)
   │
   ▼
Phase 10: Automated Code Evaluation & Telemetry Engine
   │
   ▼
Phase 11: HireGenius AI Recruitment Chatbot
   │
   ▼
Phase 12: SaaS Subscription Plans & Pricing System
   │
   ▼
Phase 13: Paywall System & Server-Side Entitlements
   │
   ▼
Phase 14: Payment Gateway Integration (Razorpay + Stripe)
   │
   ▼
Phase 15: Administrator Governance & Metrics Dashboard
   │
   ▼
Phase 16: Multi-channel Notification System
   │
   ▼
Phase 17: Candidate & Recruiter Analytics Engine
   │
   ▼
Phase 18: Security Hardening, Performance & Full Test Suite
   │
   ▼
Phase 19: Production DevOps, Docker & CI/CD Packaging
   │
   ▼
Phase 20: End-to-End System Integration & Final Handover
```

---

## Detailed Phase Breakdown

### Phase 1: Project Analysis & Architecture (Deliverable Complete)
- Directory inspection and asset inventory.
- Module definitions (13 core modules).
- Project architecture specification, schema design, API specs, and environment templates.
- Gate: User review and approval to proceed to Phase 2.

### Phase 2: Figma Integration and UI/UX Design
- Verification of connected Figma accounts and inspect accessible Figma design contexts.
- Modern SaaS aesthetic inspired by Linear, Stripe, Notion.
- Design tokens: Palette, typography, elevation, transitions, dark/light theme definitions.
- 17 screen wireframes/layouts.

### Phase 3: Frontend Development
- Vite + React 18/19 + TypeScript + Tailwind CSS setup.
- Reusable component library (Navbar, Sidebar, Modals, Tables, Forms, Skeletons, Toasts).
- Client routing with React Router and role-based guards.

### Phase 4: Authentication & Role Management
- JWT + HTTP-only Refresh Token mechanism.
- RBAC guards for Candidate, Recruiter, Administrator.
- Password hashing, login/register forms with client & server validation.

### Phase 5: Database Design & Models
- Mongoose schemas for all 20 collections with compound indexes.
- Database connection lifecycle with retry logic.
- Seed data generators for immediate development verification.

### Phase 6: Candidate Profile and Resume Management
- Candidate portfolio, skills, experience, education forms.
- Resume upload handler with file validation (PDF/DOCX) and storage.
- Extraction pipeline for resume entities.

### Phase 7: Recruiter and Job Management
- Company profile setup, job creation, and vacancy lifecycle.
- Applicant pipeline stages (Applied -> Screening -> Shortlisted -> Assessment -> Interview -> Selected -> Rejected).

### Phase 8: AI Resume Parsing and Job Matching
- NLP entity extraction (skills, experience, education).
- Vector matching score algorithm (0-100) with explainable component breakdown.
- Anti-bias enforcement.

### Phase 9: Online Coding Assessment System
- Monaco Code Editor integration.
- Multi-language support (Python, JavaScript, Java, C, C++).
- Problem descriptions, examples, public vs. hidden test cases.

### Phase 10: Automated Code Evaluation
- Isolated code execution engine with CPU/memory limits.
- Output assertion, runtime calculation, error formatting.
- Assessment score aggregation.

### Phase 11: AI Recruitment Chatbot
- HireGenius AI Assistant: Context-aware advice for candidates and recruiters.
- Streaming Markdown responses, code formatting, session persistence.

### Phase 12: Subscription Plans and Pricing System
- 3 Candidate tiers (Free, Pro ₹299, Premium ₹599).
- 3 Recruiter tiers (Free, Recruiter Pro ₹999, Enterprise ₹2499).
- Pricing table UI with monthly/yearly toggle.

### Phase 13: Paywall and Premium Feature Restrictions
- Server-side entitlement middleware (`checkSubscriptionQuota`).
- Client-side upgrade modal trigger with clear value propositions.

### Phase 14: Payment Gateway and Billing
- Razorpay order creation and HMAC-SHA256 signature verification.
- Webhook handlers for real-time subscription lifecycle updates.
- Invoice generation and billing ledger.

### Phase 15: Administrator Dashboard
- Global user management, account suspensions, platform health.
- Real-time revenue analytics (MRR/ARR), active subscriber monitoring.

### Phase 16: Notifications and Communication
- In-app notification bell with real-time updates.
- Transactional email dispatch for interview invites and payment receipts.

### Phase 17: Analytics and Reporting
- Candidate progression analytics and skill gap visualizations.
- Recruiter hiring funnel metrics, time-to-hire, and assessment benchmarks.

### Phase 18: Security, Performance and Testing
- Vulnerability audit, rate limiting, helmet, XSS prevention.
- Automated API test suites covering all user roles and payment paths.

### Phase 19: Production Deployment and DevOps
- Multi-stage Dockerfiles and Docker Compose files.
- Environment guides for Vercel, Render/Railway, and MongoDB Atlas.

### Phase 20: Final Integration and Project Handover
- 6 complete end-to-end verification workflows.
- Final user manual, installation guide, and submission report.
