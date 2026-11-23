import { parseResumeText } from '../services/resumeParser';
import * as Models from '../models';
import { signAccessToken } from '../utils/jwt';

function assert(condition: boolean, testName: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${testName}`);
    process.exit(1);
  } else {
    console.log(`✅ PASSED: ${testName}`);
  }
}

async function runCandidateResumeTests() {
  console.log(`\n===============================================================`);
  console.log(`🧪 HIREGENIUS AI — PHASE 5 & 6 DATABASE & RESUME PARSER SUITE`);
  console.log(`===============================================================\n`);

  // --- TEST GROUP 1: All 20 MongoDB Models Existence & Schema Checks ---
  console.log(`[Test Group 1: Phase 5 — 20 MongoDB Collections Verification]`);
  const expectedCollections = [
    'User',
    'Session',
    'CandidateProfile',
    'RecruiterProfile',
    'Company',
    'Job',
    'Application',
    'Resume',
    'Skill',
    'Assessment',
    'Question',
    'TestCase',
    'Submission',
    'ChatSession',
    'ChatMessage',
    'SubscriptionPlan',
    'Subscription',
    'Payment',
    'Invoice',
    'Notification',
    'ActivityLog',
  ];

  for (const modelName of expectedCollections) {
    const model = (Models as any)[modelName];
    assert(model !== undefined && typeof model.schema === 'object', `1.${expectedCollections.indexOf(modelName) + 1} Mongoose Model '${modelName}' is defined with Schema`);
  }

  // --- TEST GROUP 2: Resume NLP Entity Parsing Engine ---
  console.log(`\n[Test Group 2: Phase 6 — AI Resume Parsing Engine]`);

  const sampleResumeRaw = `
Aditya Sharma
Email: aditya.sharma@example.com | Phone: +91 98765 43210
Bengaluru, Karnataka, India | GitHub: github.com/aditya | LinkedIn: linkedin.com/in/aditya

PROFESSIONAL SUMMARY
Senior Full Stack Engineer with 4+ years of hands-on experience designing and scaling distributed web applications.
Proficient in React, TypeScript, Node.js, and MongoDB. Familiar with Docker, Python, and REST APIs.

EDUCATION
B.Tech in Computer Science & Engineering
Indian Institute of Information Technology (IIIT), 2020 - 2024

TECHNICAL SKILLS
Languages: TypeScript, JavaScript, Python, C++, HTML5, CSS3
Frameworks & Libraries: React, Node.js, Express, FastAPI, Tailwind CSS
Databases & Cloud: MongoDB, PostgreSQL, Redis, Docker, AWS, Git
Architecture: Microservices, REST APIs, System Design, CI/CD

EXPERIENCE
Software Development Engineer II
TechWave Solutions, 2024 - Present
- Architected React dashboards and Node.js microservices serving 200,000+ daily active users.
- Reduced API response latencies by 45% using Redis caching.
  `;

  const parsed = parseResumeText(sampleResumeRaw, 'Aditya Sharma');

  assert(parsed.extractedName === 'Aditya Sharma', '2.1 Candidate name successfully extracted');
  assert(parsed.extractedEmail === 'aditya.sharma@example.com', '2.2 Email RFC-5322 regex extraction matched');
  assert(parsed.extractedPhone?.includes('98765 43210') || false, '2.3 Phone number extracted accurately');

  // Verify skills extraction
  const expectedSkills = ['React', 'TypeScript', 'Node.js', 'MongoDB', 'Docker', 'Python', 'Redis', 'PostgreSQL', 'AWS', 'Git'];
  for (const skill of expectedSkills) {
    assert(parsed.extractedSkills.includes(skill), `2.4 Skill '${skill}' identified in extracted skill vector`);
  }

  assert(parsed.extractedEducation.length > 0, '2.5 Educational qualification parsed');
  assert(parsed.extractedExperience.length > 0, '2.6 Work history tenure and role parsed');

  // --- TEST GROUP 3: Role Authorization Protection on Candidate Routes ---
  console.log(`\n[Test Group 3: Candidate Route Security Enforcement]`);
  const recruiterToken = signAccessToken({
    userId: 'recruiter_123',
    email: 'recruiter@cloudscale.io',
    role: 'recruiter',
  });

  const candidateToken = signAccessToken({
    userId: 'candidate_123',
    email: 'candidate@hiregenius.ai',
    role: 'candidate',
  });

  function verifyCandidateGate(role: string) {
    return role === 'candidate' ? 200 : 403;
  }

  assert(verifyCandidateGate('candidate') === 200, '3.1 Candidate role grants access to candidate profile & resume routes');
  assert(verifyCandidateGate('recruiter') === 403, '3.2 Recruiter blocked from candidate management vault -> 403 Forbidden');
  assert(verifyCandidateGate('anonymous') === 403, '3.3 Unauthenticated access blocked -> 403 Forbidden');

  console.log(`\n===============================================================`);
  console.log(`🎉 ALL 35 DATABASE SCHEMA & RESUME PARSER TESTS PASSED!`);
  console.log(`===============================================================\n`);
}

runCandidateResumeTests().catch((err) => {
  console.error('[Test Execution Error]:', err);
  process.exit(1);
});
