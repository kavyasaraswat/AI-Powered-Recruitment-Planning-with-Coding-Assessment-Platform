import { computeCandidateJobMatch, sanitizeAntiBias } from '../services/aiMatchingService';

function assert(condition: boolean, testName: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${testName}`);
    process.exit(1);
  } else {
    console.log(`✅ PASSED: ${testName}`);
  }
}

async function runAiMatchingTests() {
  console.log(`\n===============================================================`);
  console.log(`🧪 HIREGENIUS AI — PHASE 8 AI RESUME PARSING & MATCHING SUITE`);
  console.log(`===============================================================\n`);

  // --- TEST GROUP 1: Anti-Bias Sanitization Engine ---
  console.log(`[Test Group 1: Strict Anti-Bias Sanitization Guard]`);
  const biasedInput = {
    name: 'Candidate X',
    skills: [{ name: 'React' }, { name: 'Node.js' }],
    gender: 'Female',
    age: 26,
    religion: 'Non-disclosed',
    ethnicity: 'South Asian',
    maritalStatus: 'Single',
    photo: 'https://example.com/face.jpg',
  };

  const sanitized = sanitizeAntiBias(biasedInput);
  assert(sanitized.gender === undefined, '1.1 Gender attribute stripped prior to ranking');
  assert(sanitized.age === undefined, '1.2 Age attribute stripped prior to ranking');
  assert(sanitized.religion === undefined, '1.3 Religion attribute stripped prior to ranking');
  assert(sanitized.ethnicity === undefined, '1.4 Ethnicity attribute stripped prior to ranking');
  assert(sanitized.photo === undefined, '1.5 Photo attribute stripped prior to ranking');
  assert(sanitized.skills.length === 2, '1.6 Technical skills preserved for objective evaluation');

  // --- TEST GROUP 2: Skill Synonym Normalization & Vector Cosine Match ---
  console.log(`\n[Test Group 2: Skill Synonym & Vector Matching]`);
  const candidateA = {
    skills: [
      { name: 'JS', level: 'expert' },            // matches JavaScript
      { name: 'TS', level: 'expert' },            // matches TypeScript
      { name: 'NodeJS', level: 'advanced' },       // matches Node.js
      { name: 'Mongo', level: 'intermediate' },    // matches MongoDB
      { name: 'K8s', level: 'intermediate' },      // matches Kubernetes (preferred)
    ],
    totalYearsExperience: 4,
    education: [{ degree: 'B.Tech', fieldOfStudy: 'Computer Science', institution: 'IIIT' }],
  };

  const jobA = {
    requiredSkills: ['JavaScript', 'TypeScript', 'Node.js', 'MongoDB', 'Docker'],
    preferredSkills: ['Kubernetes', 'GraphQL'],
    minExperienceYears: 3,
  };

  const reportA = computeCandidateJobMatch(candidateA, jobA);

  assert(reportA.matchedSkills.length === 4, '2.1 Successfully normalized and matched 4 required skills');
  assert(reportA.missingSkills.length === 1 && reportA.missingSkills[0] === 'Docker', '2.2 Identified Docker as the single missing skill');
  assert(reportA.matchedPreferredSkills.length === 1 && reportA.matchedPreferredSkills[0] === 'Kubernetes', '2.3 Matched preferred skill Kubernetes via synonym K8s');
  assert(reportA.skillsScore >= 80, '2.4 Skills score calculated accurately with preferred bonus (>= 80%)');

  // --- TEST GROUP 3: Experience & Education Curves ---
  console.log(`\n[Test Group 3: Experience & Education Weighting Engine]`);
  assert(reportA.experienceScore === 100, '3.1 Candidate with 4 yrs >= 3 yrs receives 100% experience alignment');
  assert(reportA.educationScore === 95, '3.2 Candidate with B.Tech in CS receives 95% education alignment');
  assert(reportA.overallScore >= 85, '3.3 Overall weighted score exceeds 85% for high-alignment candidate');

  // Under-experienced candidate test
  const juniorCandidate = {
    skills: [{ name: 'JavaScript' }, { name: 'TypeScript' }],
    totalYearsExperience: 1, // requires 4
  };
  const seniorJob = {
    requiredSkills: ['JavaScript', 'TypeScript'],
    minExperienceYears: 4,
  };
  const reportJunior = computeCandidateJobMatch(juniorCandidate, seniorJob);
  assert(reportJunior.experienceScore < 100, '3.4 Under-experienced candidate receives pro-rated experience score');
  assert(reportJunior.recommendations.length > 0, '3.5 Actionable skill recommendations generated');

  // --- TEST GROUP 4: Transparent Explainability Output ---
  console.log(`\n[Test Group 4: Transparent Explainability & Recommendations]`);
  assert(typeof reportA.explanation === 'string' && reportA.explanation.length > 20, '4.1 Explainable summary text generated');
  assert(reportA.antiBiasVerified === true, '4.2 Anti-bias compliance verified flag set');

  console.log(`\n===============================================================`);
  console.log(`🎉 ALL 17 PHASE 8 AI RESUME PARSING & MATCHING TESTS PASSED!`);
  console.log(`===============================================================\n`);
}

runAiMatchingTests().catch((err) => {
  console.error('[Test Execution Error]:', err);
  process.exit(1);
});
