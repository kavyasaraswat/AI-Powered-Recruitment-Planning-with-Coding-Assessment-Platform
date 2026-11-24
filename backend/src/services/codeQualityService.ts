import * as crypto from 'crypto';

export interface CodeSmell {
  rule: string;
  severity: 'info' | 'warning' | 'critical';
  message: string;
  line?: number;
}

export interface CodeQualityMetrics {
  linesOfCode: {
    total: number;
    source: number;
    blank: number;
    comments: number;
    commentRatio: number;
  };
  cyclomaticComplexity: {
    score: number;
    rating: 'Low' | 'Moderate' | 'High' | 'Very High';
    decisionPoints: number;
  };
  estimatedComplexity: {
    time: string; // e.g. "O(1)", "O(N)", "O(N^2)", "O(log N)"
    space: string; // e.g. "O(1)", "O(N)", "O(N^2)"
    explanation: string;
  };
  maintainabilityIndex: {
    score: number; // 0 to 100
    rating: 'Highly Maintainable' | 'Moderately Maintainable' | 'Low Maintainability' | 'Difficult to Maintain';
  };
  codeSmells: CodeSmell[];
  qualityScore: number; // 0 to 100
  letterGrade: 'A+' | 'A' | 'B+' | 'B' | 'C' | 'Needs Improvement';
}

export interface PerformanceCertificate {
  certificateId: string;
  verificationHash: string;
  verificationUrl: string;
  candidateName: string;
  assessmentTitle: string;
  issuedAt: Date;
  overallScore: number;
  letterGrade: string;
  percentileRank: number; // e.g. 95 (top 5%)
  metricsSummary: {
    passedTestCases: number;
    totalTestCases: number;
    executionTimeMs: number;
    cyclomaticComplexity: number;
    maintainabilityIndex: number;
    timeComplexity: string;
    spaceComplexity: string;
  };
}

export class CodeQualityService {
  private static CERT_SECRET = process.env.CERTIFICATE_SECRET || 'hiregenius-tamper-evident-cert-key-2026';

  /**
   * Analyze code quality, cyclomatic complexity, asymptotic bounds, and code smells
   */
  public static analyzeCodeQuality(sourceCode: string, language: string = 'javascript'): CodeQualityMetrics {
    const rawLines = sourceCode.split('\n');
    let totalLines = rawLines.length;
    let blankLines = 0;
    let commentLines = 0;
    let sourceLines = 0;

    const smells: CodeSmell[] = [];

    // 1. Analyze Lines & Comments
    let inBlockComment = false;
    rawLines.forEach((line, idx) => {
      const trimmed = line.trim();
      const lineNum = idx + 1;

      if (!trimmed) {
        blankLines++;
        return;
      }

      if (inBlockComment) {
        commentLines++;
        if (trimmed.includes('*/')) inBlockComment = false;
        return;
      }

      if (trimmed.startsWith('/*')) {
        commentLines++;
        if (!trimmed.includes('*/')) inBlockComment = true;
        return;
      }

      if (trimmed.startsWith('//') || trimmed.startsWith('#')) {
        commentLines++;
        return;
      }

      sourceLines++;

      // Check line length smell (> 120 chars)
      if (line.length > 120) {
        smells.push({
          rule: 'LineLengthExceeded',
          severity: 'info',
          message: `Line ${lineNum} exceeds recommended 120 character limit (${line.length} chars).`,
          line: lineNum,
        });
      }
    });

    const commentRatio = sourceLines > 0 ? Number((commentLines / sourceLines).toFixed(2)) : 0;

    // 2. Cyclomatic Complexity
    // Base complexity is 1. Increment on decision keywords / operators.
    let decisionPoints = 0;
    const branchKeywords = [
      /\bif\s*\(/g,
      /\belse\s+if\s*\(/g,
      /\belif\b/g,
      /\bfor\s*\(/g,
      /\bwhile\s*\(/g,
      /\bcase\s+[^:]+:/g,
      /\bcatch\s*\(/g,
      /\bexcept\b/g,
      /&&/g,
      /\|\|/g,
      /\?[^:\n]+:/g, // ternary
    ];

    branchKeywords.forEach((regex) => {
      const matches = sourceCode.match(regex);
      if (matches) decisionPoints += matches.length;
    });

    const complexityScore = 1 + decisionPoints;
    let complexityRating: CodeQualityMetrics['cyclomaticComplexity']['rating'] = 'Low';
    if (complexityScore > 20) {
      complexityRating = 'Very High';
      smells.push({
        rule: 'HighCyclomaticComplexity',
        severity: 'critical',
        message: `Cyclomatic complexity of ${complexityScore} is very high. Consider refactoring into smaller modular functions.`,
      });
    } else if (complexityScore > 10) {
      complexityRating = 'High';
      smells.push({
        rule: 'ModerateCyclomaticComplexity',
        severity: 'warning',
        message: `Cyclomatic complexity of ${complexityScore} indicates multiple nested branching paths.`,
      });
    } else if (complexityScore > 5) {
      complexityRating = 'Moderate';
    }

    // 3. Estimate Asymptotic Time & Space Complexity
    const { timeComplexity, spaceComplexity, explanation } = this.inferComplexity(sourceCode);

    // 4. Security & Dangerous Anti-Patterns
    const dangerousPatterns = [
      { regex: /\beval\s*\(/, rule: 'InsecureEval', message: 'Dynamic code execution with eval() poses severe security risks.' },
      { regex: /\bnew\s+Function\s*\(/, rule: 'InsecureFunctionConstructor', message: 'Function constructor allows arbitrary code execution.' },
      { regex: /\bchild_process\b/, rule: 'SandboxEscapeRisk', message: 'Direct child process invocation detected in assessment solution.' },
      { regex: /\bprocess\.exit\s*\(/, rule: 'ProcessExit', message: 'Calling process.exit() terminates the runtime container abruptly.' },
    ];

    dangerousPatterns.forEach((pat) => {
      if (pat.regex.test(sourceCode)) {
        smells.push({
          rule: pat.rule,
          severity: 'critical',
          message: pat.message,
        });
      }
    });

    // Code length smell
    if (sourceLines > 80) {
      smells.push({
        rule: 'LengthySolution',
        severity: 'info',
        message: `Solution spans ${sourceLines} lines. Concise functional decomposition is advised.`,
      });
    }

    // 5. Maintainability Index (0 to 100)
    // Formula approximation based on standard SEI maintainability model
    const logSource = Math.log(Math.max(1, sourceLines));
    const rawMI = 171 - 5.2 * Math.log(Math.max(10, decisionPoints * 5 + sourceLines * 3)) - 0.23 * complexityScore - 16.2 * logSource + (commentRatio > 0.1 ? 10 : 0);
    const maintainabilityScore = Math.min(100, Math.max(0, Math.round(rawMI)));

    let maintainabilityRating: CodeQualityMetrics['maintainabilityIndex']['rating'] = 'Moderately Maintainable';
    if (maintainabilityScore >= 80) {
      maintainabilityRating = 'Highly Maintainable';
    } else if (maintainabilityScore >= 60) {
      maintainabilityRating = 'Moderately Maintainable';
    } else if (maintainabilityScore >= 40) {
      maintainabilityRating = 'Low Maintainability';
    } else {
      maintainabilityRating = 'Difficult to Maintain';
    }

    // 6. Overall Quality Score
    let quality = Math.round(
      maintainabilityScore * 0.45 +
      Math.max(0, 100 - (complexityScore - 1) * 6) * 0.35 +
      (commentRatio > 0.05 ? 10 : 5) +
      Math.max(0, 10 - smells.filter((s) => s.severity === 'critical').length * 10)
    );
    quality = Math.min(100, Math.max(0, quality));

    let letterGrade: CodeQualityMetrics['letterGrade'] = 'A';
    if (quality >= 95) letterGrade = 'A+';
    else if (quality >= 85) letterGrade = 'A';
    else if (quality >= 75) letterGrade = 'B+';
    else if (quality >= 65) letterGrade = 'B';
    else if (quality >= 50) letterGrade = 'C';
    else letterGrade = 'Needs Improvement';

    return {
      linesOfCode: {
        total: totalLines,
        source: sourceLines,
        blank: blankLines,
        comments: commentLines,
        commentRatio,
      },
      cyclomaticComplexity: {
        score: complexityScore,
        rating: complexityRating,
        decisionPoints,
      },
      estimatedComplexity: {
        time: timeComplexity,
        space: spaceComplexity,
        explanation,
      },
      maintainabilityIndex: {
        score: maintainabilityScore,
        rating: maintainabilityRating,
      },
      codeSmells: smells,
      qualityScore: quality,
      letterGrade,
    };
  }

  /**
   * Infer Time & Space Complexity heuristics from loop nesting and data structure allocations
   */
  private static inferComplexity(sourceCode: string): { timeComplexity: string; spaceComplexity: string; explanation: string } {
    // Count nesting depth of loops
    const loopMatches = sourceCode.match(/\b(for|while)\s*\(/g);
    const loopCount = loopMatches ? loopMatches.length : 0;

    // Detect nested loops: e.g. for(...) { ... for(...) {
    const nestedForRegex = /\b(for|while)\s*\([^)]*\)\s*\{[^}]*\b(for|while)\s*\(/;
    const tripleNestedRegex = /\b(for|while)\s*\([^)]*\)\s*\{[^}]*\b(for|while)\s*\([^)]*\)\s*\{[^}]*\b(for|while)\s*\(/;

    // Detect binary search / divide-and-conquer logarithmic indicators
    const logIndicators = /(?:\/=\s*2|>>=\s*1|Math\.floor\s*\([^)]*\/2\)|Math\.trunc\s*\([^)]*\/2\)|(?:l|left)\s*<=\s*(?:r|right))/;

    // Detect recursion
    const recursionIndicators = /\b(return\s+\w+\s*\(|function\s+(\w+)[\s\S]*?\b\2\s*\()/;

    let time = 'O(1)';
    let space = 'O(1)';
    let explanation = 'Linear constant time operations with minimal auxiliary memory.';

    if (tripleNestedRegex.test(sourceCode)) {
      time = 'O(N^3)';
      explanation = 'Detected 3 levels of nested iterative loops (cubic time complexity).';
    } else if (nestedForRegex.test(sourceCode)) {
      time = 'O(N^2)';
      explanation = 'Detected nested loops over input collections (quadratic time complexity).';
    } else if (loopCount === 1) {
      if (logIndicators.test(sourceCode)) {
        time = 'O(log N)';
        explanation = 'Single iterative loop with binary partition / halving step (logarithmic time).';
      } else {
        time = 'O(N)';
        explanation = 'Single pass linear traversal over the input elements.';
      }
    } else if (loopCount > 1) {
      if (logIndicators.test(sourceCode)) {
        time = 'O(N log N)';
        explanation = 'Multi-phase linear scan with divide-and-conquer / sorting partition.';
      } else {
        time = 'O(N)';
        explanation = 'Sequential un-nested linear passes over input data.';
      }
    } else if (recursionIndicators.test(sourceCode)) {
      time = 'O(2^N)';
      explanation = 'Recursive branching without explicit dynamic programming memoization.';
    }

    // Space Complexity detection
    const auxiliaryAllocations = /(?:new\s+(?:Array|Map|Set|Object|Int32Array)|\[\s*\]|\{\s*\}|\.push\(|\.set\()/g;
    const allocCount = (sourceCode.match(auxiliaryAllocations) || []).length;
    const matrixAllocation = /\b(new\s+Array|Array\.from|\.map)\b[\s\S]*?\b(new\s+Array|Array\.from|\.fill)\b/;

    if (matrixAllocation.test(sourceCode)) {
      space = 'O(N^2)';
    } else if (allocCount > 0 || recursionIndicators.test(sourceCode)) {
      space = 'O(N)';
    } else {
      space = 'O(1)';
    }

    return { timeComplexity: time, spaceComplexity: space, explanation };
  }

  /**
   * Generate verified tamper-evident digital assessment certificate
   */
  public static generatePerformanceCertificate(
    candidateId: string,
    candidateName: string,
    assessmentTitle: string,
    submission: {
      submissionId: string;
      scorePercentage: number;
      passedTestCases: number;
      totalTestCases: number;
      executionTimeMs: number;
      qualityScore?: number;
      cyclomaticComplexity?: number;
      maintainabilityIndex?: number;
      timeComplexity?: string;
      spaceComplexity?: string;
    }
  ): PerformanceCertificate {
    const timestamp = Date.now();
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const certId = `HG-CERT-${dateStr}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

    // Cryptographic signature payload
    const signPayload = `${certId}:${candidateId}:${submission.submissionId}:${submission.scorePercentage}:${timestamp}`;
    const verificationHash = crypto
      .createHmac('sha256', this.CERT_SECRET)
      .update(signPayload)
      .digest('hex');

    // Compute percentile rank heuristic
    let percentile = 75;
    if (submission.scorePercentage === 100) {
      percentile = submission.executionTimeMs < 100 ? 98 : 94;
    } else if (submission.scorePercentage >= 85) {
      percentile = 88;
    } else if (submission.scorePercentage >= 70) {
      percentile = 78;
    } else {
      percentile = Math.max(30, Math.round(submission.scorePercentage * 0.7));
    }

    let letterGrade = 'A';
    const combinedScore = Math.round(
      submission.scorePercentage * 0.7 + (submission.qualityScore || 85) * 0.3
    );

    if (combinedScore >= 95) letterGrade = 'A+';
    else if (combinedScore >= 85) letterGrade = 'A';
    else if (combinedScore >= 75) letterGrade = 'B+';
    else if (combinedScore >= 65) letterGrade = 'B';
    else if (combinedScore >= 50) letterGrade = 'C';
    else letterGrade = 'Needs Improvement';

    return {
      certificateId: certId,
      verificationHash,
      verificationUrl: `/verify/${certId}?h=${verificationHash.slice(0, 16)}`,
      candidateName,
      assessmentTitle,
      issuedAt: new Date(timestamp),
      overallScore: combinedScore,
      letterGrade,
      percentileRank: percentile,
      metricsSummary: {
        passedTestCases: submission.passedTestCases,
        totalTestCases: submission.totalTestCases,
        executionTimeMs: submission.executionTimeMs,
        cyclomaticComplexity: submission.cyclomaticComplexity || 1,
        maintainabilityIndex: submission.maintainabilityIndex || 85,
        timeComplexity: submission.timeComplexity || 'O(N)',
        spaceComplexity: submission.spaceComplexity || 'O(1)',
      },
    };
  }

  /**
   * Verify authenticity of a digital certificate
   */
  public static verifyCertificateHash(
    certificateId: string,
    candidateId: string,
    submissionId: string,
    scorePercentage: number,
    timestamp: number,
    expectedHash: string
  ): boolean {
    const signPayload = `${certificateId}:${candidateId}:${submissionId}:${scorePercentage}:${timestamp}`;
    const computedHash = crypto
      .createHmac('sha256', this.CERT_SECRET)
      .update(signPayload)
      .digest('hex');

    return computedHash === expectedHash;
  }
}
