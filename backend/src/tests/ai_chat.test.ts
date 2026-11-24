import { AiChatService } from '../services/aiChatService';

function assert(condition: boolean, testName: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${testName}`);
    process.exit(1);
  } else {
    console.log(`✅ PASSED: ${testName}`);
  }
}

async function runChatTests() {
  console.log(`\n===============================================================`);
  console.log(`🧪 HIREGENIUS AI — PHASE 11 AI CHATBOT & INTERVIEW COPILOT TEST`);
  console.log(`===============================================================\n`);

  // --- TEST GROUP 1: Interview Prep Engine ---
  console.log(`[Test Group 1: Technical & Behavioral Mock Interview Engine]`);
  const dsaResponse = await AiChatService.generateReply('Can we practice an algorithm problem on strings?', {
    role: 'candidate',
    contextType: 'interview_prep',
  });
  assert(dsaResponse.content.includes('Longest Substring Without Repeating Characters'), '1.1 Generates targeted algorithmic problem');
  assert(dsaResponse.content.includes('Time Complexity'), '1.2 Outlines expected algorithmic complexity');
  assert(dsaResponse.suggestedFollowUps.length >= 2, '1.3 Returns interactive candidate follow-up suggestions');
  assert(dsaResponse.promptTokens > 0 && dsaResponse.completionTokens > 0, '1.4 Token telemetry calculated');

  const starResponse = await AiChatService.generateReply('How do I answer behavioral questions using STAR method?', {
    role: 'candidate',
    contextType: 'interview_prep',
  });
  assert(starResponse.content.includes('Situation') && starResponse.content.includes('Action'), '1.5 Detailed STAR framework coaching provided');

  // --- TEST GROUP 2: AI Resume Reviewer Engine ---
  console.log(`\n[Test Group 2: AI ATS Resume Review & Bullet Optimizer]`);
  const resumeResponse = await AiChatService.generateReply('How do I write impactful bullet points for backend projects?', {
    role: 'candidate',
    contextType: 'resume_review',
  });
  assert(resumeResponse.content.includes('XYZ Formula') || resumeResponse.content.includes('Accomplished'), '2.1 Recommends Google XYZ impact formula');
  assert(resumeResponse.content.includes('Before') && resumeResponse.content.includes('After'), '2.2 Shows concrete Before vs After transformation');

  // --- TEST GROUP 3: Algorithmic Code Explainer ---
  console.log(`\n[Test Group 3: Algorithmic Code Explainer Engine]`);
  const codeExplainResponse = await AiChatService.generateReply('Explain time complexity trade-offs', {
    role: 'candidate',
    contextType: 'code_explanation',
  });
  assert(codeExplainResponse.content.includes('Time Complexity') || codeExplainResponse.content.includes('Complexity'), '3.1 Analyzes algorithmic trade-offs');

  // --- TEST GROUP 4: Recruiter Copilot & Job Description Drafting ---
  console.log(`\n[Test Group 4: Recruiter Copilot & Job Description Generator]`);
  const jdResponse = await AiChatService.generateReply('Draft a job description for Senior Full-Stack Cloud Engineer', {
    role: 'recruiter',
    contextType: 'job_description',
  });
  assert(jdResponse.content.includes('Senior Full-Stack') || jdResponse.content.includes('Required Qualifications'), '4.1 Generates structured JD with tech stack');
  assert(jdResponse.content.includes('TypeScript') && jdResponse.content.includes('React'), '4.2 Incorporates foundational skills requirements');

  const recruiterCopilot = await AiChatService.generateReply('How can I screen applicants faster?', {
    role: 'recruiter',
    contextType: 'general',
  });
  assert(recruiterCopilot.content.includes('HireGenius Recruiter Copilot') || recruiterCopilot.content.includes('Shortlisting'), '4.3 Recruiter workflow guidance generated');

  // --- TEST GROUP 5: General Candidate Career Advisor ---
  console.log(`\n[Test Group 5: General Candidate Career Assistant]`);
  const careerResponse = await AiChatService.generateReply('Where can I find jobs matched to my profile?', {
    role: 'candidate',
    contextType: 'general',
  });
  assert(careerResponse.content.includes('Jobs Listing') || careerResponse.content.includes('Match Score'), '5.1 Directs candidate to platform matching tools');

  console.log(`\n===============================================================`);
  console.log(`🎉 ALL 11 PHASE 11 AI CHATBOT TESTS PASSED!`);
  console.log(`===============================================================\n`);
}

runChatTests().catch((err) => {
  console.error('[Phase 11 Test Error]:', err);
  process.exit(1);
});
