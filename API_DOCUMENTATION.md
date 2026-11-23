# HireGenius AI — API Documentation

Base URL: `http://localhost:5000/api/v1`

All protected requests require the HTTP Header:
`Authorization: Bearer <JWT_ACCESS_TOKEN>`

---

## 1. Authentication & Identity (`/auth`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/auth/register` | Public | Register new candidate or recruiter |
| `POST` | `/auth/login` | Public | Authenticate user & issue tokens |
| `POST` | `/auth/refresh-token` | Public (Cookie) | Rotate and refresh access token |
| `POST` | `/auth/logout` | Authenticated | Invalidate session & clear cookies |
| `GET` | `/auth/me` | Authenticated | Get current authenticated user details |
| `POST` | `/auth/forgot-password`| Public | Initiate password reset email |
| `POST` | `/auth/reset-password` | Public | Reset password using valid token |

#### Example: Register (`POST /auth/register`)
Request:
```json
{
  "name": "Alex Mercer",
  "email": "alex@example.com",
  "password": "SecurePassword123!",
  "role": "candidate"
}
```
Response: `201 Created`
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "64f123456789...",
    "name": "Alex Mercer",
    "email": "alex@example.com",
    "role": "candidate"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

## 2. Candidate Profiles & Resumes (`/candidates`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/candidates/profile` | Candidate | Retrieve own profile |
| `PUT` | `/candidates/profile` | Candidate | Update profile (bio, skills, links) |
| `POST` | `/candidates/resume/upload` | Candidate | Upload resume (.pdf, .docx) |
| `GET` | `/candidates/resumes` | Candidate | List uploaded resumes & parsed info |
| `GET` | `/candidates/applications` | Candidate | View all submitted job applications |
| `GET` | `/candidates/analytics` | Candidate | Candidate dashboard analytics |

---

## 3. Recruiters & Companies (`/recruiters`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/recruiters/company` | Recruiter | Get recruiter's company profile |
| `PUT` | `/recruiters/company` | Recruiter | Update company details and branding |
| `GET` | `/recruiters/jobs` | Recruiter | List all jobs created by recruiter |
| `GET` | `/recruiters/applicants/:jobId` | Recruiter | List applicants for a specific job |
| `PATCH`| `/recruiters/applications/:appId/status` | Recruiter | Update stage (shortlist, interview, etc.) |
| `POST` | `/recruiters/interviews/schedule` | Recruiter | Schedule candidate interview |
| `GET` | `/recruiters/analytics` | Recruiter | Funnel metrics & hiring efficiency |

---

## 4. Jobs Portal (`/jobs`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/jobs` | Public | Search and filter published jobs |
| `GET` | `/jobs/:id` | Public | Get single job details |
| `POST` | `/jobs` | Recruiter (Paywall Checked) | Create new job vacancy |
| `PUT` | `/jobs/:id` | Recruiter (Owner) | Update existing job |
| `DELETE`| `/jobs/:id` | Recruiter (Owner) | Close or remove job |
| `POST` | `/jobs/:id/apply` | Candidate | Apply for a job |

---

## 5. AI Matching Engine (`/ai/matching`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/ai/matching/score` | Recruiter / Candidate | Compute match score for candidate vs job |
| `GET` | `/ai/matching/report/:appId`| Recruiter (Pro/Ent) | Get explainable matching breakdown |
| `POST` | `/ai/resume/analyze` | Candidate (Pro/Prem) | AI-powered resume enhancement advice |

#### Response: Match Score Analysis
```json
{
  "success": true,
  "matchData": {
    "overallScore": 88,
    "skillsScore": 92,
    "experienceScore": 85,
    "educationScore": 90,
    "matchedSkills": ["React", "TypeScript", "Node.js", "Docker"],
    "missingSkills": ["Kubernetes", "GraphQL"],
    "explanation": "Candidate demonstrates 4+ years of relevant TypeScript and Node.js backend development matching the required seniority level."
  }
}
```

---

## 6. Coding Assessments & Sandbox (`/assessments`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/assessments` | Authenticated | List available assessments / practice |
| `GET` | `/assessments/:id` | Authenticated | Get assessment details and questions |
| `POST` | `/assessments` | Recruiter (Pro/Ent) | Create custom coding test |
| `POST` | `/assessments/execute` | Authenticated | Run code against public test cases |
| `POST` | `/assessments/submit` | Candidate | Submit final code against all test cases |
| `GET` | `/assessments/submissions/:id` | Authenticated | View submission telemetry & score |

#### Example: Run Code (`POST /assessments/execute`)
Request:
```json
{
  "language": "python",
  "sourceCode": "def twoSum(nums, target):\n    seen = {}\n    for i, n in enumerate(nums):\n        if target - n in seen:\n            return [seen[target - n], i]\n        seen[n] = i\n    return []",
  "questionId": "64f987654321..."
}
```

---

## 7. AI Recruitment Chatbot (`/chat`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/chat/sessions` | Authenticated | List user conversation history |
| `POST` | `/chat/sessions` | Authenticated | Create a new chat session |
| `GET` | `/chat/sessions/:id` | Authenticated | Get messages of a specific session |
| `POST` | `/chat/message` | Authenticated (Rate-Limited) | Send prompt and receive AI response (streaming / json) |
| `DELETE`| `/chat/sessions/:id` | Authenticated | Delete chat session |

---

## 8. Subscriptions & Payments (`/billing`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/billing/plans` | Public | List all Candidate & Recruiter plans |
| `GET` | `/billing/subscription` | Authenticated | Current active subscription & quotas |
| `POST` | `/billing/razorpay/create-order` | Authenticated | Generate Razorpay order for checkout |
| `POST` | `/billing/razorpay/verify` | Authenticated | Cryptographic signature verification |
| `POST` | `/billing/webhooks/razorpay` | Public (Signed) | Webhook listener for payment events |
| `GET` | `/billing/invoices` | Authenticated | Download billing invoice receipts |

---

## 9. Administrator Controls (`/admin`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/admin/metrics` | Admin Only | Platform statistics, MRR, users |
| `GET` | `/admin/users` | Admin Only | Paginated users list with search |
| `PATCH`| `/admin/users/:id/status`| Admin Only | Activate, suspend, or promote user |
| `GET` | `/admin/subscriptions` | Admin Only | Global subscriber and billing ledger |
| `GET` | `/admin/audit-logs` | Admin Only | Security logs and audit trails |

---

## 10. Notifications (`/notifications`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/notifications` | Authenticated | Fetch notifications (unread first) |
| `PATCH`| `/notifications/:id/read` | Authenticated | Mark notification as read |
| `PATCH`| `/notifications/read-all` | Authenticated | Mark all notifications read |
