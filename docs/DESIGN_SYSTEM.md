# HireGenius AI — Design System & UI/UX Specification

## 1. Visual Direction & SaaS Philosophy
**HireGenius AI** adopts a modern enterprise SaaS aesthetic inspired by **Linear, Stripe, and Notion**:
- **High-contrast typography**: crisp Inter font hierarchy with distinct weight contrast.
- **Deep Slate Surfaces**: sleek, glare-reducing dark background (`#0B0F19`) with elevated card surfaces (`#151C2C`), paired with a pristine light mode (`#F8FAFC` to `#FFFFFF`).
- **Precision Accents**: Electric Indigo (`#4F46E5`) for primary interactions and Violet (`#7C3AED`) for AI-powered actions and badges.
- **Micro-Interactions**: subtle border highlights (`ring-1 ring-white/10`), smooth transitions (150–250ms cubic bezier), Framer Motion layout animations.
- **Accessible State Handling**: Distinct visual representations for Loading (skeleton pulses), Empty states (helpful vector illustrations & actionable CTAs), and Error states (clear recovery instructions).

---

## 2. Design Tokens

### 2.1 Color Palette
| Token Name | Light Value | Dark Value | Purpose |
|---|---|---|---|
| `bg-background` | `#F8FAFC` | `#0B0F19` | Main page canvas |
| `bg-surface` | `#FFFFFF` | `#151C2C` | Cards, modals, sidebars |
| `bg-surface-elevated`| `#F1F5F9` | `#1E293B` | Dropdowns, tooltips, popovers |
| `border-subtle` | `#E2E8F0` | `#2D3748` | Dividers, card strokes |
| `border-focus` | `#4F46E5` | `#6366F1` | Focus rings, active inputs |
| `text-primary` | `#0F172A` | `#F8FAFC` | Page titles, primary content |
| `text-secondary` | `#475569` | `#94A3B8` | Descriptions, labels |
| `text-muted` | `#94A3B8` | `#64748B` | Timestamps, metadata |
| `brand-primary` | `#4F46E5` | `#6366F1` | Primary CTA, links, active navigation |
| `brand-accent-ai` | `#7C3AED` | `#8B5CF6` | AI match pills, AI Chatbot accents |
| `status-success` | `#10B981` | `#34D399` | Accepted code, shortlisted status |
| `status-warning` | `#F59E0B` | `#FBBF24` | Pending review, expiring trial |
| `status-danger` | `#EF4444` | `#F87171` | Failed test cases, rejection |

### 2.2 Typography Scale (Inter Font Family)
- **Display 1**: `36px` / `line-height: 44px` / `Font-Weight: 700` (Hero headers)
- **Heading 1**: `30px` / `line-height: 38px` / `Font-Weight: 700` (Dashboard page titles)
- **Heading 2**: `24px` / `line-height: 32px` / `Font-Weight: 600` (Section headings, modal headers)
- **Heading 3**: `20px` / `line-height: 28px` / `Font-Weight: 600` (Card headers)
- **Body Regular**: `14px` / `line-height: 20px` / `Font-Weight: 400` (General prose, table rows)
- **Body Medium**: `14px` / `line-height: 20px` / `Font-Weight: 500` (Interactive labels, buttons)
- **Caption**: `12px` / `line-height: 16px` / `Font-Weight: 400` (Meta tags, badges, footnotes)
- **Monospace**: `13px` / `JetBrains Mono` / `Fira Code` (Monaco editor, code snippets)

### 2.3 Spacing, Radii & Shadows
- **Base Grid**: 4px increment (`p-2` = 8px, `p-4` = 16px, `p-6` = 24px, `p-8` = 32px).
- **Corner Radii**:
  - `rounded-md`: 6px (Badges, tags, dropdown items)
  - `rounded-lg`: 8px (Inputs, buttons)
  - `rounded-xl`: 12px (Cards, alerts, panels)
  - `rounded-2xl`: 16px (Modals, full containers)
- **Shadows**:
  - `shadow-sm`: `0 1px 2px 0 rgb(0 0 0 / 0.05)`
  - `shadow-card`: `0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)`
  - `shadow-glow-brand`: `0 0 20px -5px rgba(79, 70, 229, 0.3)` (AI highlights)

---

## 3. The 17 Core SaaS Screens Architecture

### 1. Landing Page (`/`)
- **Header**: Sticky glassmorphism navbar (Logo, Features, Pricing, Testimonials, Login, Get Started CTA).
- **Hero**: Dynamic animated badge ("AI Recruitment 2.0"), High-impact headline, Dual CTAs (Candidate & Recruiter), Live interactive preview demo.
- **Feature Showcase**: 3-column Bento grid (AI Resume Parser, Isolated Code Sandbox, Matching Vector Engine).
- **Interactive Code & Match Simulator**: Live interactive mini-widget demonstrating how HireGenius scores resumes against jobs.
- **Footer**: Sitemap, compliance notes, role shortcuts, social links.

### 2. Login Page (`/login`)
- Clean centered card with toggle for Candidate and Recruiter role hints.
- Input fields: Email address, Password (with reveal toggle), "Remember Me" checkbox, "Forgot Password" link.
- Social/OAuth placeholders and direct link to `/register`.

### 3. Registration Page (`/register`)
- Dual-role tab switch: "I'm looking for a Job" (Candidate) vs. "I'm Hiring Talent" (Recruiter).
- Form inputs: Full Name, Company Name (for recruiters), Work Email, Password strength meter, Terms checkbox.

### 4. Candidate Dashboard (`/candidate/dashboard`)
- **Metric Cards**: Active Applications, Assessment Invitations, Profile Strength Score, AI Credits Remaining.
- **Application Tracker**: Progress bar per application (Applied -> Shortlisted -> Assessment -> Interview).
- **Recommended Jobs**: AI matched job cards with match percentage pill (e.g. `94% Match`).
- **Quick Actions**: Practice Coding, Chat with AI Assistant, Update Resume.

### 5. Recruiter Dashboard (`/recruiter/dashboard`)
- **Metric Cards**: Published Vacancies, Total Applicants, Pending Reviews, Coding Pass Rate.
- **Candidate Pipeline Funnel**: Visual stage breakdown.
- **Recent High-Match Applicants**: AI matching score badges, resume preview trigger, 1-click Shortlist/Reject.
- **Active Job Requisitions**: Quick status toggle (Open/Paused).

### 6. Administrator Dashboard (`/admin/dashboard`)
- **Platform Telemetry**: Monthly Recurring Revenue (MRR), Active Users (by role), AI token consumption, System health.
- **User Management Table**: Search, filter by role/status, ban/activate toggle.
- **Subscription Overview**: Active paying accounts, churn metrics, manual quota adjustment.
- **Audit Trails**: Security logs (logins, privilege escalations, payment events).

### 7. Job Listing Page (`/jobs`)
- Multi-faceted filter sidebar: Experience level (Entry, Mid, Senior), Workplace (Remote, Hybrid, On-site), Salary range, Technology tags.
- Search input with debounce.
- Job cards with title, company, location, salary tags, required skills badges, and "Apply Now" button.

### 8. Job Details Page (`/jobs/:id`)
- Comprehensive overview: Job requirements, company summary, responsibilities, compensation.
- AI Match Analysis widget (displays candidate's matched skills vs missing skills in real-time).
- One-click application modal with resume selector and optional cover note.

### 9. Candidate Profile (`/candidate/profile`)
- Tabbed interface: Overview, Work Experience, Education, Technical Skills, Certifications, Portfolio.
- Dynamic skill tags with proficiency levels (Beginner, Intermediate, Advanced, Expert).
- Social links (GitHub, LinkedIn, personal website).

### 10. Resume Upload Page (`/candidate/resume`)
- Drag-and-drop file upload zone (accepts `.pdf`, `.docx` up to 10MB).
- Instant parsing progress bar with status indicator.
- Live extracted data preview: Parsed Contact info, Work History, Education, and Extracted Skills tags with edit options.

### 11. Coding Assessment Interface (`/assessment/:id`)
- Split-screen layout:
  - Left pane: Problem description, constraints, input/output specifications, sample test cases.
  - Right pane: Monaco Code Editor with language selector (Python, JS, Java, C, C++), font size toggle, Dark/Light theme.
- Bottom terminal: Console output, public test case runner (Run Code), and submission button (Submit Solution).
- Real-time countdown timer with autosave indicator.

### 12. AI Chatbot Interface (`/chat`)
- Conversational workspace with HireGenius AI Assistant.
- Sidebar: Past conversation threads, New Chat button, prompt templates ("Review my resume", "Prepare for React interview", "Write Job Description").
- Main area: Streaming markdown responses, code syntax blocks with copy button, suggested follow-ups, user quota tracker.

### 13. Pricing Page (`/pricing`)
- Candidate vs. Recruiter billing toggle.
- Monthly vs. Annual toggle (with 20% discount badge).
- 3 Candidate Cards: Free, Pro (₹299/mo), Premium (₹599/mo).
- 3 Recruiter Cards: Free, Pro (₹999/mo), Enterprise (₹2,499/mo).
- Feature comparison matrix table.

### 14. Subscription Management Page (`/billing`)
- Active plan details, next renewal date, current billing cycle.
- Quota meters: Chatbot credits, Job postings limit, Candidate resume match credits.
- Payment method details and invoice download history table.

### 15. Payment Checkout Page (`/checkout/:planId`)
- Plan order summary with GST breakdown (18%).
- Payment Gateway selector: Razorpay (Cards, UPI, NetBanking) and Stripe (International cards).
- Security badges (256-bit SSL, PCI-DSS compliant).
- Order confirmation modal upon verified payment signature.

### 16. Recruiter Analytics (`/recruiter/analytics`)
- Visual charts: Candidate drop-off rate at each pipeline stage, time-to-hire trend line.
- Coding assessment score distribution bell curve.
- Source effectiveness chart (Direct vs. Referral).

### 17. Settings Page (`/settings`)
- Profile details & Avatar change.
- Password & Security (Change password, active sessions).
- Notification preferences (Email digests, application alerts, interview invites).
- Theme preference toggle (Light, Dark, System).

---

## 4. Reusable UI Components Catalog
1. **Navigation**: `Navbar`, `Sidebar`, `Breadcrumbs`, `UserMenuDropdown`.
2. **Data Presentation**: `MetricCard`, `DataTable` (sortable, paginated), `Badge`, `Avatar`, `ProgressBar`.
3. **Form Elements**: `TextInput`, `PasswordInput`, `SelectDropdown`, `TagInput`, `ToggleSwitch`, `Checkbox`.
4. **Feedback & Overlays**: `Modal`, `ConfirmationDialog`, `PaywallModal`, `ToastNotifications`, `SkeletonLoader`.
5. **Specialized Tools**: `MonacoEditorContainer`, `TerminalOutput`, `ChatBubble`, `ResumeDropzone`, `MatchScoreGauge`.
