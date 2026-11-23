# HireGenius AI — Intelligent Recruitment & Coding Assessment Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-v24.x-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18%2F19-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.x-brightgreen.svg)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v3.x-38bdf8.svg)](https://tailwindcss.com/)

**HireGenius AI** is an end-to-end, enterprise-grade AI-powered SaaS platform designed to modernize the modern recruitment lifecycle. It bridges candidates, recruiters, and administrators through intelligent resume parsing, algorithmic matching, automated online coding evaluations in isolated sandboxes, conversational AI career assistance, and multi-tier subscription monetization.

---

## Key System Highlights

- **AI-Driven Resume & Candidate Matching**: Automated extraction of technical skills, experience, and educational credentials with explainable, unbiased scoring (0–100%).
- **Monaco-Powered Coding Assessment**: Interactive in-browser coding playground supporting Python, JavaScript, Java, C, and C++ with automated test-case evaluation and performance telemetry.
- **HireGenius AI Assistant**: Dual-persona conversational AI that assists candidates with resume enhancement and interview preparation, while empowering recruiters with job description generation and candidate summaries.
- **SaaS Subscription & Monetization**: Multi-tier plans for both candidates and recruiters with server-enforced paywalls, Razorpay checkout for Indian payments, and Stripe support.
- **Comprehensive Role-Based Portals**:
  - **Candidate Dashboard**: Profile management, resume upload, application tracking, practice coding, AI career chat.
  - **Recruiter Dashboard**: Job publishing, applicant tracking kanban, coding assessment creation, candidate shortlisting.
  - **Administrator Dashboard**: User governance, subscription oversight, platform metrics, and audit logging.

---

## Project Structure

```
├── frontend/             # Vite + React + TypeScript + Tailwind CSS + Lucide + Monaco
├── backend/              # Node.js + Express + TypeScript + Mongoose + JWT + Sandbox
├── ai-service/           # NLP Engine, Skill Extraction & Match Scoring
├── docker/               # Containerized isolation & multi-service compose
├── docs/                 # Architectural specifications & technical manuals
├── scripts/              # Database seeders & utility scripts
├── README.md             # Project overview & quickstart
├── PROJECT_ARCHITECTURE.md # Detailed 13-module system architecture
├── API_DOCUMENTATION.md  # Comprehensive REST API reference
├── DATABASE_SCHEMA.md    # 20 MongoDB collections and relationship definitions
├── DEVELOPMENT_ROADMAP.md# 20-Phase development trajectory
└── .env.example          # Unified environment variable template
```

---

## 20-Phase Master Development Plan

1. **Phase 1: Project Analysis & Architecture** *(Current Phase)*
2. **Phase 2: Figma Integration & UI/UX Design**
3. **Phase 3: Frontend Development**
4. **Phase 4: Authentication & Role Management**
5. **Phase 5: Database Design & Mongoose Schemas**
6. **Phase 6: Candidate Profile & Resume Management**
7. **Phase 7: Recruiter & Job Management**
8. **Phase 8: AI Resume Parsing & Job Matching**
9. **Phase 9: Online Coding Assessment System**
10. **Phase 10: Automated Code Evaluation**
11. **Phase 11: AI Recruitment Chatbot**
12. **Phase 12: Subscription Plans & Pricing System**
13. **Phase 13: Paywall & Premium Feature Restrictions**
14. **Phase 14: Payment Gateway & Billing**
15. **Phase 15: Administrator Dashboard**
16. **Phase 16: Notifications & Communication**
17. **Phase 17: Analytics & Reporting**
18. **Phase 18: Security, Performance & Testing**
19. **Phase 19: Production Deployment & DevOps**
20. **Phase 20: Final Integration & Project Handover**

---

## Quickstart & Environment Setup

Copy `.env.example` to `.env` and configure your credentials:

```bash
cp .env.example .env
```

Review [PROJECT_ARCHITECTURE.md](PROJECT_ARCHITECTURE.md) and [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md) for technical deep-dives.
