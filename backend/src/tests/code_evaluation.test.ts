import { CodeQualityService } from '../services/codeQualityService';

function assert(condition: boolean, testName: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${testName}`);
    process.exit(1);
  } else {
    console.log(`✅ PASSED: ${testName}`);
  }
}

async function runCodeEvaluationTests() {
  console.log(`\n===============================================================`);
  console.log(`🧪 HIREGENIUS AI — PHASE 10 CODE EVALUATION & TELEMETRY SUITE`);
  console.log(`===============================================================\n`);

  // --- TEST GROUP 1: LOC & Comment Density Metrics ---
  console.log(`[Test Group 1: Lines of Code & Comment Ratio Analysis]`);
  const cleanCode = `
    // Solves Two Sum in O(N) using Hash Map
    /*
     * @param {number[]} nums
     * @param {number} target
     */
    function twoSum(nums, target) {
      const map = new Map();
      
      for (let i = 0; i < nums.length; i++) {
        const diff = target - nums[i];
        if (map.has(diff)) {
          return [map.get(diff), i];
        }
        map.set(nums[i], i);
      }
      return [];
    }
  `;

  const m1 = CodeQualityService.analyzeCodeQuality(cleanCode, 'javascript');
  assert(m1.linesOfCode.total > 15, '1.1 Total lines of code tracked');
  assert(m1.linesOfCode.comments >= 5, '1.2 Single-line and multi-line JSDoc comments counted');
  assert(m1.linesOfCode.blank >= 2, '1.3 Blank lines excluded from pure source LOC');
  assert(m1.linesOfCode.commentRatio > 0.2, '1.4 Comment-to-source ratio computed accurately (> 0.2)');

  // --- TEST GROUP 2: Cyclomatic Complexity & Decision Paths ---
  console.log(`\n[Test Group 2: Cyclomatic Complexity & Decision Paths]`);

  // Simple linear function: 0 decisions -> complexity = 1
  const linearCode = `
    function add(a, b) {
      const sum = a + b;
      return sum;
    }
  `;
  const mLinear = CodeQualityService.analyzeCodeQuality(linearCode, 'javascript');
  assert(mLinear.cyclomaticComplexity.score === 1, '2.1 Linear sequence has base cyclomatic complexity of 1');
  assert(mLinear.cyclomaticComplexity.rating === 'Low', '2.2 Base complexity rated as Low');

  // Branching function: for, if, ||, &&, ternary
  const branchingCode = `
    function complexValidator(user, options) {
      if (!user) return false;
      if (user.age < 18 || user.isBanned) return false;
      for (let i = 0; i < options.length; i++) {
        if (options[i].required && !user[options[i].key]) {
          return false;
        }
      }
      return user.score > 50 ? true : false;
    }
  `;
  const mBranch = CodeQualityService.analyzeCodeQuality(branchingCode, 'javascript');
  assert(mBranch.cyclomaticComplexity.score >= 6, '2.3 Branching logic correctly detected (score >= 6)');
  assert(mBranch.cyclomaticComplexity.decisionPoints >= 5, '2.4 Identified at least 5 decision points');

  // --- TEST GROUP 3: Asymptotic Time & Space Bounds Inference ---
  console.log(`\n[Test Group 3: Asymptotic Time & Space Inference]`);

  // O(N) Linear Time, O(N) Space
  const linearSearchCode = `
    function findItems(arr, target) {
      const results = [];
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] === target) results.push(i);
      }
      return results;
    }
  `;
  const mLinearTime = CodeQualityService.analyzeCodeQuality(linearSearchCode, 'javascript');
  assert(mLinearTime.estimatedComplexity.time === 'O(N)', '3.1 Single iterative loop classified as O(N) Time');
  assert(mLinearTime.estimatedComplexity.space === 'O(N)', '3.2 Array allocation classified as O(N) Space');

  // O(N^2) Quadratic Nested Loops
  const bubbleSortCode = `
    function bubbleSort(arr) {
      for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length - i - 1; j++) {
          if (arr[j] > arr[j + 1]) {
            const temp = arr[j];
            arr[j] = arr[j + 1];
            arr[j + 1] = temp;
          }
        }
      }
      return arr;
    }
  `;
  const mQuad = CodeQualityService.analyzeCodeQuality(bubbleSortCode, 'javascript');
  assert(mQuad.estimatedComplexity.time === 'O(N^2)', '3.3 Double nested loops classified as O(N^2) Quadratic Time');

  // O(log N) Binary Search
  const binarySearchCode = `
    function binarySearch(arr, x) {
      let l = 0, r = arr.length - 1;
      while (l <= r) {
        let m = Math.floor((l + r) / 2);
        if (arr[m] === x) return m;
        if (arr[m] < x) l = m + 1;
        else r = m - 1;
      }
      return -1;
    }
  `;
  const mLog = CodeQualityService.analyzeCodeQuality(binarySearchCode, 'javascript');
  assert(mLog.estimatedComplexity.time === 'O(log N)', '3.4 Binary partition loop classified as O(log N) Time');

  // --- TEST GROUP 4: Security Anti-Patterns & Code Smells ---
  console.log(`\n[Test Group 4: Security Anti-Patterns & Code Smells Detection]`);

  const insecureCode = `
    function runUserScript(script) {
      eval(script); // dangerous
      const fn = new Function('return ' + script);
      return fn();
    }
  `;
  const mInsecure = CodeQualityService.analyzeCodeQuality(insecureCode, 'javascript');
  const evalSmell = mInsecure.codeSmells.find((s) => s.rule === 'InsecureEval');
  const funcSmell = mInsecure.codeSmells.find((s) => s.rule === 'InsecureFunctionConstructor');

  assert(evalSmell !== undefined && evalSmell.severity === 'critical', '4.1 Detected eval() usage with critical severity');
  assert(funcSmell !== undefined && funcSmell.severity === 'critical', '4.2 Detected Function constructor with critical severity');

  // --- TEST GROUP 5: Maintainability Index & Grade Curves ---
  console.log(`\n[Test Group 5: Maintainability Index & Grade Computation]`);
  assert(m1.maintainabilityIndex.score >= 70, '5.1 Clean modular code achieves Maintainability Index >= 70');
  assert(m1.maintainabilityIndex.rating === 'Highly Maintainable' || m1.maintainabilityIndex.rating === 'Moderately Maintainable', '5.2 Maintainability rated favorably');
  assert(['A+', 'A', 'B+'].includes(m1.letterGrade), '5.3 Quality letter grade assigned in top tier (A+, A, or B+)');

  // --- TEST GROUP 6: Tamper-Evident Performance Certificate ---
  console.log(`\n[Test Group 6: Digital Performance Certificate Generation & Cryptographic Verification]`);

  const mockSubmission = {
    submissionId: '65f123456789abcdef012345',
    scorePercentage: 100,
    passedTestCases: 10,
    totalTestCases: 10,
    executionTimeMs: 45,
    qualityScore: 92,
    cyclomaticComplexity: 3,
    maintainabilityIndex: 88,
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
  };

  const cert = CodeQualityService.generatePerformanceCertificate(
    'usr-cand-101',
    'Jane Candidate',
    'Full-Stack Algorithms & System Design',
    mockSubmission
  );

  assert(cert.certificateId.startsWith('HG-CERT-'), '6.1 Formatted unique certificate ID generated (HG-CERT-...)');
  assert(typeof cert.verificationHash === 'string' && cert.verificationHash.length === 64, '6.2 256-bit SHA-256 HMAC cryptographic verification hash generated');
  assert(cert.percentileRank >= 90, '6.3 High-performing submission awarded >= 90th percentile rank');
  assert(cert.overallScore >= 90, '6.4 Combined scorecard reflects test correctness and code quality');

  // Validate Verification Engine
  const parsedTime = cert.issuedAt.getTime();
  const isValid = CodeQualityService.verifyCertificateHash(
    cert.certificateId,
    'usr-cand-101',
    mockSubmission.submissionId,
    mockSubmission.scorePercentage,
    parsedTime,
    cert.verificationHash
  );
  assert(isValid === true, '6.5 Cryptographic signature verified successfully as authentic');

  // Validate Tampering Detection
  const isTampered = CodeQualityService.verifyCertificateHash(
    cert.certificateId,
    'usr-cand-101',
    mockSubmission.submissionId,
    95, // tampered score!
    parsedTime,
    cert.verificationHash
  );
  assert(isTampered === false, '6.6 Altered certificate score is immediately caught and rejected');

  console.log(`\n===============================================================`);
  console.log(`🎉 ALL 20 PHASE 10 CODE EVALUATION & TELEMETRY TESTS PASSED!`);
  console.log(`===============================================================\n`);
}

runCodeEvaluationTests().catch((err) => {
  console.error('[Phase 10 Test Error]:', err);
  process.exit(1);
});
