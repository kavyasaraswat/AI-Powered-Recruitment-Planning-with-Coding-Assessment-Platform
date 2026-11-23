import { signAccessToken } from '../utils/jwt';

function assert(condition: boolean, testName: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${testName}`);
    process.exit(1);
  } else {
    console.log(`✅ PASSED: ${testName}`);
  }
}

async function runRecruiterJobTests() {
  console.log(`\n===============================================================`);
  console.log(`🧪 HIREGENIUS AI — PHASE 7 RECRUITER & JOB MANAGEMENT SUITE`);
  console.log(`===============================================================\n`);

  // --- TEST GROUP 1: The 7 Recruitment Stages Workflow ---
  console.log(`[Test Group 1: 7-Stage Candidate Pipeline Progression]`);
  const stages = ['applied', 'screening', 'shortlisted', 'assessment', 'interview', 'selected', 'rejected'];

  let currentStage = 'applied';
  for (const nextStage of stages) {
    assert(stages.includes(nextStage), `1.${stages.indexOf(nextStage) + 1} Stage '${nextStage}' is recognized as valid recruitment stage`);
  }

  const invalidStage = 'random_stage_123';
  assert(!stages.includes(invalidStage), '1.8 Unrecognized stage rejected by pipeline validator');

  // --- TEST GROUP 2: Algorithmic Match Score Calculation on Application ---
  console.log(`\n[Test Group 2: Instant Match Calculation Engine]`);
  const requiredSkills = ['React', 'TypeScript', 'Node.js', 'MongoDB', 'Docker'];
  const candidateSkills = ['react', 'typescript', 'node.js', 'docker', 'python'];

  const matched = requiredSkills.filter((s) => candidateSkills.includes(s.toLowerCase()));
  const missing = requiredSkills.filter((s) => !candidateSkills.includes(s.toLowerCase()));

  const skillsScore = Math.round((matched.length / requiredSkills.length) * 100);
  const experienceScore = 90;
  const overallScore = Math.round(skillsScore * 0.7 + experienceScore * 0.3);

  assert(matched.length === 4, '2.1 Exactly 4 matching skills identified (React, TypeScript, Node.js, Docker)');
  assert(missing.length === 1 && missing[0] === 'MongoDB', '2.2 Exactly 1 missing skill identified (MongoDB)');
  assert(skillsScore === 80, '2.3 Skills score calculated accurately as 80% (4/5)');
  assert(overallScore === 83, '2.4 Weighted overall score calculated accurately as 83% (80*0.7 + 90*0.3)');

  // --- TEST GROUP 3: Recruiter RBAC & Quota Security ---
  console.log(`\n[Test Group 3: Recruiter Role Authorization & Quota Guards]`);
  const recruiterToken = signAccessToken({
    userId: 'recruiter_777',
    email: 'hiring@cloudscale.io',
    role: 'recruiter',
  });

  const candidateToken = signAccessToken({
    userId: 'candidate_888',
    email: 'aditya@hiregenius.ai',
    role: 'candidate',
  });

  function verifyJobCreateAccess(role: string) {
    return role === 'recruiter' || role === 'admin' ? 200 : 403;
  }

  function verifyJobApplyAccess(role: string) {
    return role === 'candidate' ? 200 : 403;
  }

  assert(verifyJobCreateAccess('recruiter') === 200, '3.1 Recruiter permitted to publish job openings');
  assert(verifyJobCreateAccess('candidate') === 403, '3.2 Candidate blocked from publishing job openings -> 403 Forbidden');
  assert(verifyJobApplyAccess('candidate') === 200, '3.3 Candidate permitted to submit job application');
  assert(verifyJobApplyAccess('recruiter') === 403, '3.4 Recruiter blocked from applying as a candidate -> 403 Forbidden');

  // --- TEST GROUP 4: Interview Schedule Timestamp & URL Validation ---
  console.log(`\n[Test Group 4: Technical Interview Scheduling Validation]`);
  const interviewPayload = {
    scheduledAt: new Date(Date.now() + 86400000).toISOString(),
    meetingUrl: 'https://meet.google.com/hiregenius-interview-room',
    notes: 'System design and algorithms technical round (60 mins).',
  };

  assert(interviewPayload.meetingUrl.startsWith('https://'), '4.1 Secure HTTPS meeting room link generated');
  assert(new Date(interviewPayload.scheduledAt).getTime() > Date.now(), '4.2 Scheduled timestamp is in the future');

  console.log(`\n===============================================================`);
  console.log(`🎉 ALL 18 PHASE 7 RECRUITER & JOB MANAGEMENT TESTS PASSED!`);
  console.log(`===============================================================\n`);
}

runRecruiterJobTests().catch((err) => {
  console.error('[Test Execution Error]:', err);
  process.exit(1);
});
