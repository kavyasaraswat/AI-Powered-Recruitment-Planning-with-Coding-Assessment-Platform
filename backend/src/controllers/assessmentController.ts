import { Request, Response } from 'express';
import mongoose from 'express';
import { Assessment, IAssessmentDocument } from '../models/Assessment';
import { Question, IQuestionDocument } from '../models/Question';
import { Submission } from '../models/Submission';
import { CodeExecutionService } from '../services/codeExecutionService';

// Helper: slugify title
const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-') + '-' + Math.random().toString(36).substring(2, 7);
};

/**
 * Recruiter/Admin: Create a new coding assessment with questions and test cases
 */
export const createAssessment = async (req: Request, res: Response): Promise<void> => {
  try {
    const creatorId = req.user?.id;
    const {
      title,
      description,
      difficulty = 'Medium',
      durationMinutes = 60,
      passScorePercentage = 70,
      isPublicPractice = false,
      questions = [],
    } = req.body;

    if (!title) {
      res.status(400).json({
        success: false,
        error: 'ValidationError',
        message: 'Assessment title is required.',
      });
      return;
    }

    const questionIds: any[] = [];

    // Process questions: either existing IDs or new question definitions
    for (const q of questions) {
      if (typeof q === 'string' || q._id) {
        questionIds.push(q._id || q);
      } else {
        const newQuestion = await Question.create({
          title: q.title,
          slug: slugify(q.title || 'coding-question'),
          description: q.description || '',
          difficulty: q.difficulty || difficulty,
          category: q.category || 'Algorithms',
          supportedLanguages: q.supportedLanguages || ['javascript', 'python', 'java', 'cpp', 'c'],
          starterTemplates: q.starterTemplates || {
            javascript: "const fs = require('fs');\nconst input = fs.readFileSync(0, 'utf-8').trim();\n\nfunction solve(input) {\n  // Write your code here\n  return input;\n}\n\nconsole.log(solve(input));\n",
            python: "import sys\n\ndef solve():\n    input_data = sys.stdin.read().strip()\n    # Write your solution here\n    print(input_data)\n\nif __name__ == '__main__':\n    solve()\n",
          },
          constraints: q.constraints || [],
          publicTestCases: q.publicTestCases || [],
          hiddenTestCases: q.hiddenTestCases || [],
        });
        questionIds.push(newQuestion._id);
      }
    }

    const assessment = await Assessment.create({
      creatorId,
      title,
      description,
      difficulty,
      durationMinutes,
      passScorePercentage,
      questionIds,
      isPublicPractice,
      status: 'active',
    });

    const populated = await Assessment.findById(assessment._id).populate('questionIds');

    res.status(201).json({
      success: true,
      message: 'Assessment created successfully.',
      assessment: populated,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'ServerError',
      message: error.message || 'Failed to create assessment.',
    });
  }
};

/**
 * List Assessments (supports filtering by difficulty, practice status, search query)
 */
export const getAssessments = async (req: Request, res: Response): Promise<void> => {
  try {
    const { difficulty, search, isPublicPractice, status } = req.query;
    const filter: any = {};

    if (difficulty) {
      filter.difficulty = difficulty;
    }

    if (isPublicPractice !== undefined) {
      filter.isPublicPractice = isPublicPractice === 'true';
    }

    if (status) {
      filter.status = status;
    } else if (req.user?.role === 'candidate') {
      filter.status = 'active';
    }

    if (search) {
      filter.title = { $regex: String(search), $options: 'i' };
    }

    const assessments = await Assessment.find(filter)
      .populate('creatorId', 'name email company')
      .populate('questionIds', 'title difficulty category supportedLanguages')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: assessments.length,
      assessments,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'ServerError',
      message: error.message || 'Failed to retrieve assessments.',
    });
  }
};

/**
 * Get Single Assessment by ID with candidate anti-cheating masking
 */
export const getAssessmentById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const assessment = await Assessment.findById(id)
      .populate('creatorId', 'name email')
      .populate('questionIds');

    if (!assessment) {
      res.status(404).json({
        success: false,
        error: 'NotFound',
        message: 'Assessment not found.',
      });
      return;
    }

    const isRecruiterOrAdmin = req.user?.role === 'recruiter' || req.user?.role === 'admin';

    // If candidate, strip hidden test cases from question payloads
    const sanitizedQuestions = assessment.questionIds.map((q: any) => {
      const qObj = q.toObject ? q.toObject() : { ...q };
      if (!isRecruiterOrAdmin) {
        delete qObj.hiddenTestCases;
      }
      return qObj;
    });

    const result = assessment.toObject();
    result.questionIds = sanitizedQuestions;

    res.status(200).json({
      success: true,
      assessment: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'ServerError',
      message: error.message || 'Failed to fetch assessment.',
    });
  }
};

/**
 * Dry-run code against public test cases (or custom standard input)
 */
export const runCode = async (req: Request, res: Response): Promise<void> => {
  try {
    const { questionId, language, sourceCode, customInput } = req.body;

    if (!language || !sourceCode) {
      res.status(400).json({
        success: false,
        error: 'ValidationError',
        message: 'Language and source code are required.',
      });
      return;
    }

    // Case 1: Custom Stdin Input Execution
    if (customInput !== undefined && customInput !== null) {
      const execResult = await CodeExecutionService.execute({
        language,
        sourceCode,
        stdin: String(customInput),
        timeoutMs: 4000,
      });

      res.status(200).json({
        success: true,
        type: 'custom_run',
        result: execResult,
      });
      return;
    }

    // Case 2: Run against Question's Public Test Cases
    if (!questionId) {
      res.status(400).json({
        success: false,
        error: 'ValidationError',
        message: 'Question ID or customInput is required to run code.',
      });
      return;
    }

    const question = await Question.findById(questionId);
    if (!question) {
      res.status(404).json({
        success: false,
        error: 'NotFound',
        message: 'Question not found.',
      });
      return;
    }

    const testCasesToRun = question.publicTestCases.map((tc, idx) => ({
      id: `public-${idx + 1}`,
      input: tc.input,
      expectedOutput: tc.expectedOutput,
    }));

    const evaluation = await CodeExecutionService.evaluateTestCases(
      language,
      sourceCode,
      testCasesToRun,
      4000
    );

    res.status(200).json({
      success: true,
      type: 'public_test_run',
      evaluation,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'ServerError',
      message: error.message || 'Error executing code.',
    });
  }
};

/**
 * Submit Code against ALL test cases (public + hidden) and record submission
 */
export const submitQuestion = async (req: Request, res: Response): Promise<void> => {
  try {
    const candidateId = req.user?.id;
    const { assessmentId, questionId, language, sourceCode } = req.body;

    if (!questionId || !language || !sourceCode) {
      res.status(400).json({
        success: false,
        error: 'ValidationError',
        message: 'questionId, language, and sourceCode are required for submission.',
      });
      return;
    }

    const question = await Question.findById(questionId);
    if (!question) {
      res.status(404).json({
        success: false,
        error: 'NotFound',
        message: 'Question not found.',
      });
      return;
    }

    // Combine public and hidden test cases
    const allTestCases: Array<{ id: string; input: string; expectedOutput: string; isHidden: boolean }> = [];

    question.publicTestCases.forEach((tc, idx) => {
      allTestCases.push({
        id: `pub-${idx + 1}`,
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        isHidden: false,
      });
    });

    question.hiddenTestCases.forEach((tc, idx) => {
      allTestCases.push({
        id: `hid-${idx + 1}`,
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        isHidden: true,
      });
    });

    // Evaluate code
    const evaluation = await CodeExecutionService.evaluateTestCases(
      language,
      sourceCode,
      allTestCases,
      4000
    );

    // Format results for storage and mask hidden test case internals
    const sanitizedResults = evaluation.results.map((resItem, idx) => {
      const originalTestCase = allTestCases[idx];
      const isHidden = originalTestCase?.isHidden ?? false;

      return {
        passed: resItem.passed,
        input: isHidden ? '[Hidden Test Case]' : resItem.input,
        actualOutput: isHidden && !resItem.passed ? '[Hidden Output]' : resItem.actualOutput,
        expectedOutput: isHidden ? '[Hidden Output]' : resItem.expectedOutput,
        errorMessage: resItem.errorMessage,
        executionTimeMs: resItem.executionTimeMs,
      };
    });

    const submission = await Submission.create({
      assessmentId: assessmentId || undefined,
      questionId: question._id,
      candidateId,
      language,
      sourceCode,
      status: evaluation.overallStatus,
      totalTestCases: evaluation.totalTestCases,
      passedTestCases: evaluation.passedTestCases,
      scorePercentage: evaluation.scorePercentage,
      executionTimeMs: evaluation.totalExecutionTimeMs,
      memoryUsageKb: evaluation.maxMemoryUsageKb,
      testCaseResults: sanitizedResults,
      submittedAt: new Date(),
    });

    res.status(201).json({
      success: true,
      message: evaluation.overallStatus === 'accepted' ? 'All test cases passed!' : 'Submission processed.',
      submission,
      evaluation: {
        status: evaluation.overallStatus,
        scorePercentage: evaluation.scorePercentage,
        passedTestCases: evaluation.passedTestCases,
        totalTestCases: evaluation.totalTestCases,
        totalExecutionTimeMs: evaluation.totalExecutionTimeMs,
        results: sanitizedResults,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'ServerError',
      message: error.message || 'Failed to submit code.',
    });
  }
};

/**
 * Get submissions for an assessment (recruiter sees all, candidate sees own)
 */
export const getAssessmentSubmissions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const filter: any = { assessmentId: id };

    if (req.user?.role === 'candidate') {
      filter.candidateId = req.user.id;
    }

    const submissions = await Submission.find(filter)
      .populate('candidateId', 'name email')
      .populate('questionId', 'title difficulty category')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: submissions.length,
      submissions,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'ServerError',
      message: error.message || 'Failed to fetch assessment submissions.',
    });
  }
};

/**
 * Get individual submission details
 */
export const getSubmissionById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { submissionId } = req.params;
    const submission = await Submission.findById(submissionId)
      .populate('candidateId', 'name email')
      .populate('questionId', 'title description difficulty constraints starterTemplates');

    if (!submission) {
      res.status(404).json({
        success: false,
        error: 'NotFound',
        message: 'Submission not found.',
      });
      return;
    }

    // Role check: Only author, recruiter, or admin can inspect submission
    if (
      req.user?.role === 'candidate' &&
      submission.candidateId._id.toString() !== req.user.id
    ) {
      res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: 'You do not have permission to view this submission.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      submission,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'ServerError',
      message: error.message || 'Failed to fetch submission details.',
    });
  }
};
