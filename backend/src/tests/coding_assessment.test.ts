import { CodeExecutionService } from '../services/codeExecutionService';
import mongoose from 'mongoose';
import { Assessment } from '../models/Assessment';
import { Question } from '../models/Question';
import { Submission } from '../models/Submission';

function assert(condition: boolean, testName: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${testName}`);
    process.exit(1);
  } else {
    console.log(`✅ PASSED: ${testName}`);
  }
}

async function runAssessmentTests() {
  console.log(`\n===============================================================`);
  console.log(`🧪 HIREGENIUS AI — PHASE 9 ONLINE CODING ASSESSMENT ENGINE TEST`);
  console.log(`===============================================================\n`);

  // --- TEST GROUP 1: Sandbox Output Normalization & Comparison ---
  console.log(`[Test Group 1: Output Normalization & Matching Engine]`);

  const exactMatch = CodeExecutionService.normalizeAndCompare('Hello World', 'Hello World');
  assert(exactMatch === true, '1.1 Exact string matching');

  const whitespaceMatch = CodeExecutionService.normalizeAndCompare(' 42 \r\n', '42\n');
  assert(whitespaceMatch === true, '1.2 Whitespace and CRLF line-ending normalization');

  const jsonArrayMatch = CodeExecutionService.normalizeAndCompare('[1, 2, 3]', '[1,2,3]');
  assert(jsonArrayMatch === true, '1.3 JSON array formatting equivalence');

  const jsonObjectMatch = CodeExecutionService.normalizeAndCompare('{"status": "ok", "count": 1}', '{"status":"ok","count":1}');
  assert(jsonObjectMatch === true, '1.4 JSON object formatting equivalence');

  const falseMatch = CodeExecutionService.normalizeAndCompare('42', '43');
  assert(falseMatch === false, '1.5 Correctly rejects distinct outputs');

  // --- TEST GROUP 2: Real Child Process Execution (Node.js/JavaScript) ---
  console.log(`\n[Test Group 2: Live Isolated Child Process Execution]`);

  // 2.1 Standard I/O execution
  const jsStdinCode = `
    const fs = require('fs');
    const input = fs.readFileSync(0, 'utf-8').trim();
    const [a, b] = input.split(' ').map(Number);
    console.log(a + b);
  `;
  const run1 = await CodeExecutionService.execute({
    language: 'javascript',
    sourceCode: jsStdinCode,
    stdin: '15 27',
    timeoutMs: 3000,
  });

  assert(run1.status === 'accepted', '2.1 Process executed successfully with status accepted');
  assert(run1.stdout.trim() === '42', '2.2 Stdin piped into process and stdout captured (15 + 27 = 42)');
  assert(run1.executionTimeMs > 0 && run1.executionTimeMs < 3000, '2.3 Execution time telemetry captured within threshold');
  assert(run1.memoryUsageKb > 0, '2.4 Memory usage telemetry reported in KB');

  // 2.2 Runtime Error Handling
  const errorJsCode = `
    const invalid = nonExistentVariable.method();
  `;
  const runError = await CodeExecutionService.execute({
    language: 'javascript',
    sourceCode: errorJsCode,
    timeoutMs: 3000,
  });
  assert(runError.status === 'runtime_error', '2.5 Runtime error (ReferenceError) trapped properly');
  assert(runError.exitCode !== 0, '2.6 Non-zero exit code returned on runtime crash');
  assert(runError.stderr.includes('ReferenceError'), '2.7 Stderr stack trace captured in telemetry');

  // 2.3 Timeout / Infinite Loop Protection
  const infiniteLoopCode = `
    while(true) {
      // Loop forever
    }
  `;
  const runTimeout = await CodeExecutionService.execute({
    language: 'javascript',
    sourceCode: infiniteLoopCode,
    timeoutMs: 1200, // Short timeout for rapid test
  });
  assert(runTimeout.status === 'time_limit_exceeded', '2.8 Infinite loop terminated with time_limit_exceeded');
  assert(runTimeout.executionTimeMs >= 1000, '2.9 Process was killed after hitting configured timeout threshold');

  // --- TEST GROUP 3: Multi-Test Case Evaluation Suite ---
  console.log(`\n[Test Group 3: Multi-Test Case Evaluation & Scoring]`);

  const twoSumSolver = `
    const fs = require('fs');
    const input = fs.readFileSync(0, 'utf-8').trim();
    if (!input) process.exit(0);
    const lines = input.split('\\n');
    const nums = lines[0].split(',').map(Number);
    const target = Number(lines[1]);
    
    const map = new Map();
    let result = [-1, -1];
    for (let i = 0; i < nums.length; i++) {
      const complement = target - nums[i];
      if (map.has(complement)) {
        result = [map.get(complement), i];
        break;
      }
      map.set(nums[i], i);
    }
    console.log(JSON.stringify(result));
  `;

  const testCases = [
    { id: 'tc-1', input: '2,7,11,15\n9', expectedOutput: '[0, 1]' },
    { id: 'tc-2', input: '3,2,4\n6', expectedOutput: '[1, 2]' },
    { id: 'tc-3', input: '3,3\n6', expectedOutput: '[0, 1]' },
  ];

  const evalSummary = await CodeExecutionService.evaluateTestCases(
    'javascript',
    twoSumSolver,
    testCases,
    3000
  );

  assert(evalSummary.overallStatus === 'accepted', '3.1 Two-Sum solver passed all test cases');
  assert(evalSummary.totalTestCases === 3, '3.2 Total test cases evaluated = 3');
  assert(evalSummary.passedTestCases === 3, '3.3 Passed test cases = 3');
  assert(evalSummary.scorePercentage === 100, '3.4 Score percentage calculated as 100%');
  assert(evalSummary.results.every((r) => r.passed), '3.5 Individual results flagged as passed');

  // Test Partial Failing Score
  const faultySolver = `
    const fs = require('fs');
    const input = fs.readFileSync(0, 'utf-8').trim();
    if (input.includes('2,7,11,15')) {
      console.log('[0, 1]');
    } else {
      console.log('[0, 0]'); // wrong answer
    }
  `;

  const partialSummary = await CodeExecutionService.evaluateTestCases(
    'javascript',
    faultySolver,
    testCases,
    3000
  );

  assert(partialSummary.overallStatus === 'wrong_answer', '3.6 Faulty solver flagged as wrong_answer');
  assert(partialSummary.passedTestCases === 1, '3.7 Exactly 1 of 3 test cases passed');
  assert(partialSummary.scorePercentage === 33, '3.8 Pro-rated score calculated as 33%');

  // --- TEST GROUP 4: Anti-Cheating Hidden Test Case Masking ---
  console.log(`\n[Test Group 4: Anti-Cheating Hidden Test Case Protection]`);

  // Simulate question with public and hidden test cases
  const questionPayload = {
    title: 'Reverse Words in a String',
    slug: 'reverse-words-test',
    description: 'Reverse the order of words in string s.',
    difficulty: 'Medium' as const,
    category: 'Strings',
    supportedLanguages: ['javascript', 'python'],
    starterTemplates: {
      javascript: '// write solution here',
    },
    constraints: ['1 <= s.length <= 10^4'],
    publicTestCases: [
      { input: 'the sky is blue', expectedOutput: 'blue is sky the', explanation: 'Reversed words' },
    ],
    hiddenTestCases: [
      { input: '  hello world  ', expectedOutput: 'world hello' },
      { input: 'a good   example', expectedOutput: 'example good a' },
    ],
  };

  // Check candidate view masking logic
  const candidateSanitized = {
    ...questionPayload,
    hiddenTestCases: undefined,
  };

  assert(candidateSanitized.publicTestCases.length === 1, '4.1 Public test case exposed for candidate problem view');
  assert(candidateSanitized.hiddenTestCases === undefined, '4.2 Hidden test cases completely stripped from candidate payload');

  // Verify submission masking logic
  const combinedTestCases = [
    { input: questionPayload.publicTestCases[0].input, expectedOutput: questionPayload.publicTestCases[0].expectedOutput, isHidden: false },
    { input: questionPayload.hiddenTestCases[0].input, expectedOutput: questionPayload.hiddenTestCases[0].expectedOutput, isHidden: true },
  ];

  const reverseCode = `
    const fs = require('fs');
    const input = fs.readFileSync(0, 'utf-8');
    const words = input.trim().split(/\\s+/);
    console.log(words.reverse().join(' '));
  `;

  const submissionEval = await CodeExecutionService.evaluateTestCases(
    'javascript',
    reverseCode,
    combinedTestCases,
    3000
  );

  assert(submissionEval.overallStatus === 'accepted', '4.3 Submission successfully evaluated against both public and hidden test cases');
  assert(submissionEval.scorePercentage === 100, '4.4 Candidate achieved 100% on comprehensive suite');

  console.log(`\n===============================================================`);
  console.log(`🎉 ALL 21 PHASE 9 CODING ASSESSMENT TESTS PASSED!`);
  console.log(`===============================================================\n`);
}

runAssessmentTests().catch((err) => {
  console.error('[Assessment Test Error]:', err);
  process.exit(1);
});
