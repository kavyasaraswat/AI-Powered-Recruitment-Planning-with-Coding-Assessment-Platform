import { spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

export interface ExecutionOptions {
  language: string;
  sourceCode: string;
  stdin?: string;
  timeoutMs?: number;
  memoryLimitMb?: number;
}

export interface ExecutionResult {
  stdout: string;
  stderr: string;
  exitCode: number | null;
  executionTimeMs: number;
  memoryUsageKb: number;
  status: 'accepted' | 'wrong_answer' | 'time_limit_exceeded' | 'memory_limit_exceeded' | 'runtime_error' | 'compilation_error';
  errorMessage?: string;
}

export interface TestCaseEvaluation {
  testCaseId?: string;
  passed: boolean;
  input: string;
  actualOutput: string;
  expectedOutput: string;
  errorMessage?: string;
  executionTimeMs: number;
  status: 'accepted' | 'wrong_answer' | 'time_limit_exceeded' | 'memory_limit_exceeded' | 'runtime_error' | 'compilation_error';
}

export interface EvaluationSummary {
  overallStatus: 'accepted' | 'wrong_answer' | 'time_limit_exceeded' | 'memory_limit_exceeded' | 'runtime_error' | 'compilation_error';
  totalTestCases: number;
  passedTestCases: number;
  scorePercentage: number;
  totalExecutionTimeMs: number;
  maxMemoryUsageKb: number;
  results: TestCaseEvaluation[];
}

export class CodeExecutionService {
  private static DEFAULT_TIMEOUT_MS = 4000;
  private static MAX_OUTPUT_BYTES = 512 * 1024; // 512 KB

  /**
   * Compare outputs with whitespace, newline and JSON normalization
   */
  public static normalizeAndCompare(actual: string, expected: string): boolean {
    const normActual = actual.replace(/\r\n/g, '\n').trim();
    const normExpected = expected.replace(/\r\n/g, '\n').trim();

    if (normActual === normExpected) {
      return true;
    }

    // Try parsing as JSON for array / object equivalence (e.g. [1, 2] vs [1,2])
    try {
      const parsedActual = JSON.parse(normActual);
      const parsedExpected = JSON.parse(normExpected);
      return JSON.stringify(parsedActual) === JSON.stringify(parsedExpected);
    } catch {
      return false;
    }
  }

  /**
   * Execute source code directly using isolated child process
   */
  public static async execute(options: ExecutionOptions): Promise<ExecutionResult> {
    const {
      language,
      sourceCode,
      stdin = '',
      timeoutMs = this.DEFAULT_TIMEOUT_MS,
    } = options;

    const normalizedLang = language.toLowerCase().trim();

    // Support simulated mode for non-JS languages if runtime is not installed
    if (process.env.SIMULATE_CODE_EXECUTION === 'true' && normalizedLang !== 'javascript' && normalizedLang !== 'nodejs') {
      return this.simulateExecution(normalizedLang, sourceCode, stdin);
    }

    const tempDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'hiregenius-exec-'));
    const startTime = Date.now();

    try {
      let command: string;
      let args: string[];
      let fileName: string;

      switch (normalizedLang) {
        case 'javascript':
        case 'nodejs':
        case 'js':
          fileName = 'solution.js';
          command = process.execPath; // current node executable
          args = ['--max-old-space-size=128', path.join(tempDir, fileName)];
          break;

        case 'python':
        case 'py':
          fileName = 'solution.py';
          command = process.platform === 'win32' ? 'python' : 'python3';
          args = [path.join(tempDir, fileName)];
          break;

        case 'cpp':
        case 'c++':
          fileName = 'solution.cpp';
          command = 'g++';
          args = ['-O2', path.join(tempDir, fileName), '-o', path.join(tempDir, 'solution.exe')];
          break;

        case 'c':
          fileName = 'solution.c';
          command = 'gcc';
          args = ['-O2', path.join(tempDir, fileName), '-o', path.join(tempDir, 'solution.exe')];
          break;

        default:
          return {
            stdout: '',
            stderr: `Unsupported language: ${language}. Supported languages are javascript, python, cpp, c.`,
            exitCode: 1,
            executionTimeMs: 0,
            memoryUsageKb: 0,
            status: 'compilation_error',
            errorMessage: `Unsupported language: ${language}`,
          };
      }

      // Write code to file
      const filePath = path.join(tempDir, fileName);
      await fs.promises.writeFile(filePath, sourceCode, 'utf-8');

      // If compiled language (C/C++), run compilation step first
      if (normalizedLang === 'cpp' || normalizedLang === 'c++' || normalizedLang === 'c') {
        const compileResult = await this.spawnProcess(command, args, '', timeoutMs, tempDir);
        if (compileResult.exitCode !== 0) {
          return {
            stdout: '',
            stderr: compileResult.stderr || 'Compilation failed',
            exitCode: compileResult.exitCode,
            executionTimeMs: Date.now() - startTime,
            memoryUsageKb: 0,
            status: 'compilation_error',
            errorMessage: compileResult.stderr || 'Compilation failed',
          };
        }
        // Run compiled binary
        command = path.join(tempDir, 'solution.exe');
        args = [];
      }

      const runResult = await this.spawnProcess(command, args, stdin, timeoutMs, tempDir);
      const executionTimeMs = Date.now() - startTime;

      let status: ExecutionResult['status'] = 'accepted';
      if (runResult.timedOut) {
        status = 'time_limit_exceeded';
      } else if (runResult.exitCode !== 0) {
        status = 'runtime_error';
      }

      return {
        stdout: runResult.stdout,
        stderr: runResult.stderr,
        exitCode: runResult.exitCode,
        executionTimeMs,
        memoryUsageKb: Math.round(process.memoryUsage().heapUsed / 1024),
        status,
        errorMessage: runResult.timedOut ? `Time Limit Exceeded (${timeoutMs}ms)` : (runResult.stderr || undefined),
      };
    } catch (err: any) {
      const isMissingRuntime = err.code === 'ENOENT';
      const errorMsg = isMissingRuntime
        ? `Runtime executable '${err.path || normalizedLang}' not installed or not in PATH on server.`
        : (err.message || 'Execution error');

      return {
        stdout: '',
        stderr: errorMsg,
        exitCode: 1,
        executionTimeMs: Date.now() - startTime,
        memoryUsageKb: 0,
        status: isMissingRuntime ? 'compilation_error' : 'runtime_error',
        errorMessage: errorMsg,
      };
    } finally {
      // Cleanup temporary directory
      try {
        await fs.promises.rm(tempDir, { recursive: true, force: true });
      } catch {
        // Ignore cleanup errors
      }
    }
  }

  /**
   * Helper to spawn process with stdin pipe and timeout handling
   */
  private static spawnProcess(
    command: string,
    args: string[],
    stdinData: string,
    timeoutMs: number,
    cwd: string
  ): Promise<{ stdout: string; stderr: string; exitCode: number | null; timedOut: boolean }> {
    return new Promise((resolve) => {
      let stdout = '';
      let stderr = '';
      let timedOut = false;
      let completed = false;

      let child: any;
      try {
        child = spawn(command, args, {
          cwd,
          stdio: ['pipe', 'pipe', 'pipe'],
          windowsHide: true,
        });
      } catch (err: any) {
        return resolve({
          stdout: '',
          stderr: err.message || 'Failed to spawn process',
          exitCode: 1,
          timedOut: false,
        });
      }

      const timer = setTimeout(() => {
        if (!completed) {
          timedOut = true;
          try {
            child.kill();
          } catch {
            // ignore
          }
          // Safeguard: force resolve if close event is delayed
          setTimeout(() => {
            if (!completed) {
              completed = true;
              resolve({
                stdout,
                stderr: 'Execution timed out',
                exitCode: null,
                timedOut: true,
              });
            }
          }, 300);
        }
      }, timeoutMs);

      if (child.stdin) {
        child.stdin.on('error', () => {
          // Ignore pipe errors if process exited early
        });
        if (stdinData) {
          child.stdin.write(stdinData);
        }
        child.stdin.end();
      }

      if (child.stdout) {
        child.stdout.on('data', (data: Buffer) => {
          if (stdout.length < this.MAX_OUTPUT_BYTES) {
            stdout += data.toString('utf-8');
          }
        });
      }

      if (child.stderr) {
        child.stderr.on('data', (data: Buffer) => {
          if (stderr.length < this.MAX_OUTPUT_BYTES) {
            stderr += data.toString('utf-8');
          }
        });
      }

      child.on('error', (err: any) => {
        if (!completed) {
          completed = true;
          clearTimeout(timer);
          resolve({
            stdout,
            stderr: err.message || 'Process error',
            exitCode: err.code === 'ENOENT' ? 127 : 1,
            timedOut: false,
          });
        }
      });

      child.on('close', (code: number | null) => {
        if (!completed) {
          completed = true;
          clearTimeout(timer);
          resolve({
            stdout,
            stderr,
            exitCode: timedOut ? null : code,
            timedOut,
          });
        }
      });
    });
  }

  /**
   * Evaluate source code against multiple test cases
   */
  public static async evaluateTestCases(
    language: string,
    sourceCode: string,
    testCases: Array<{ id?: string; input: string; expectedOutput: string }>,
    timeoutMs: number = this.DEFAULT_TIMEOUT_MS
  ): Promise<EvaluationSummary> {
    const results: TestCaseEvaluation[] = [];
    let passedCount = 0;
    let totalTime = 0;
    let maxMemory = 0;
    let firstFailingStatus: ExecutionResult['status'] | null = null;

    for (const tc of testCases) {
      const execResult = await this.execute({
        language,
        sourceCode,
        stdin: tc.input,
        timeoutMs,
      });

      totalTime += execResult.executionTimeMs;
      if (execResult.memoryUsageKb > maxMemory) {
        maxMemory = execResult.memoryUsageKb;
      }

      let isPassed = false;
      let status: TestCaseEvaluation['status'] = execResult.status;

      if (execResult.status === 'accepted') {
        const matches = this.normalizeAndCompare(execResult.stdout, tc.expectedOutput);
        if (matches) {
          isPassed = true;
          status = 'accepted';
          passedCount++;
        } else {
          status = 'wrong_answer';
          if (!firstFailingStatus) firstFailingStatus = 'wrong_answer';
        }
      } else {
        if (!firstFailingStatus) firstFailingStatus = execResult.status;
      }

      results.push({
        testCaseId: tc.id,
        passed: isPassed,
        input: tc.input,
        actualOutput: execResult.stdout.trim(),
        expectedOutput: tc.expectedOutput.trim(),
        errorMessage: execResult.errorMessage,
        executionTimeMs: execResult.executionTimeMs,
        status,
      });
    }

    const total = testCases.length;
    const scorePercentage = total > 0 ? Math.round((passedCount / total) * 100) : 0;

    let overallStatus: EvaluationSummary['overallStatus'] = 'accepted';
    if (passedCount < total) {
      overallStatus = firstFailingStatus || 'wrong_answer';
    }

    return {
      overallStatus,
      totalTestCases: total,
      passedTestCases: passedCount,
      scorePercentage,
      totalExecutionTimeMs: totalTime,
      maxMemoryUsageKb: maxMemory,
      results,
    };
  }

  /**
   * Simulated execution helper for testing non-native languages
   */
  private static simulateExecution(
    language: string,
    sourceCode: string,
    stdin: string
  ): ExecutionResult {
    // If sourceCode contains an intentional error or mock exception
    if (sourceCode.includes('throw') || sourceCode.includes('raise Exception')) {
      return {
        stdout: '',
        stderr: `SimulatedException: in ${language} execution`,
        exitCode: 1,
        executionTimeMs: 15,
        memoryUsageKb: 1024,
        status: 'runtime_error',
        errorMessage: 'Simulated runtime error',
      };
    }

    // Return mock output or echo stdin
    const mockOutput = stdin ? stdin.trim() : 'Success';
    return {
      stdout: mockOutput,
      stderr: '',
      exitCode: 0,
      executionTimeMs: 25,
      memoryUsageKb: 1500,
      status: 'accepted',
    };
  }
}
