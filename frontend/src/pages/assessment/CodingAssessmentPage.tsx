import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { CODING_QUESTIONS } from '../../services/mockData';
import { useNotification } from '../../context/NotificationContext';
import {
  Code2,
  Play,
  Send,
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Terminal,
  Settings,
  HelpCircle,
  FileCode,
  Check
} from 'lucide-react';

export const CodingAssessmentPage: React.FC = () => {
  const [selectedQuestion, setSelectedQuestion] = useState(CODING_QUESTIONS[0]);
  const [language, setLanguage] = useState<'python' | 'javascript' | 'java' | 'cpp' | 'c'>('python');
  const [code, setCode] = useState(selectedQuestion.starterCode.python);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'testcases' | 'console'>('testcases');
  const [executionResult, setExecutionResult] = useState<{
    status: 'idle' | 'running' | 'success' | 'failed';
    output: string;
    executionTimeMs?: number;
    passCount?: number;
    totalCount?: number;
  }>({ status: 'idle', output: '' });

  // 60-minute countdown timer
  const [timeLeft, setTimeLeft] = useState(3600);
  const { addToast } = useNotification();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleLanguageChange = (newLang: 'python' | 'javascript' | 'java' | 'cpp' | 'c') => {
    setLanguage(newLang);
    setCode(selectedQuestion.starterCode[newLang] || '# Write code here');
    addToast('info', 'Language Switched', `Editor set to ${newLang.toUpperCase()}`);
  };

  const handleReset = () => {
    setCode(selectedQuestion.starterCode[language] || '');
    addToast('info', 'Code Reset', 'Restored original starter template.');
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setActiveTab('console');
    setExecutionResult({ status: 'running', output: 'Compiling in isolated sandbox environment...' });

    setTimeout(() => {
      setIsRunning(false);
      setExecutionResult({
        status: 'success',
        output: `> Running ${language} runtime in container [ID: 64f_sandbox_worker]\n> Execution completed with exit code 0\n\nTest Case 1: PASSED (Input: nums = [2, 7, 11, 15], target = 9 -> Output: [0, 1])\nTest Case 2: PASSED (Input: nums = [3, 2, 4], target = 6 -> Output: [1, 2])\nTest Case 3: PASSED (Input: nums = [3, 3], target = 6 -> Output: [0, 1])\n\nAll public assertions matched expected output.`,
        executionTimeMs: 42,
        passCount: 3,
        totalCount: 3,
      });
      addToast('success', 'Tests Passed', 'All 3 public test cases executed successfully (42ms).');
    }, 900);
  };

  const handleSubmitSolution = () => {
    setIsSubmitting(true);
    setActiveTab('console');
    setExecutionResult({ status: 'running', output: 'Executing full assessment suite (including hidden edge-case tests)...' });

    setTimeout(() => {
      setIsSubmitting(false);
      setExecutionResult({
        status: 'success',
        output: `=== ASSESSMENT EVALUATION COMPLETE ===\nStatus: ACCEPTED\nLanguage: ${language.toUpperCase()}\nExecution Time: 38ms\nPeak Memory: 14.2 MB\n\nTotal Test Cases: 10/10 Passed (100%)\n- 3 Public Test Cases: PASSED\n- 7 Hidden Verification Test Cases: PASSED\n\nAssessment Score: 100/100 Recorded in Hiring Pipeline.`,
        executionTimeMs: 38,
        passCount: 10,
        totalCount: 10,
      });
      addToast('success', 'Assessment Submitted!', 'Congratulations! 10/10 Test Cases Passed (100% score).');
    }, 1400);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] -m-4 sm:-m-6 lg:-m-8">
      {/* Assessment Top Action Bar */}
      <div className="h-14 border-b border-dark-border bg-dark-surface px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-white text-sm">
              Technical Assessment: {selectedQuestion.title}
            </span>
          </div>

          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
            selectedQuestion.difficulty === 'Easy' ? 'bg-emerald-500/20 text-emerald-300' :
            selectedQuestion.difficulty === 'Medium' ? 'bg-amber-500/20 text-amber-300' :
            'bg-rose-500/20 text-rose-300'
          }`}>
            {selectedQuestion.difficulty}
          </span>
        </div>

        {/* Center: Timer */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-dark-bg border border-dark-border text-xs">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-slate-400 font-medium">Time Left:</span>
          <span className="font-mono font-bold text-white">{formatTime(timeLeft)}</span>
        </div>

        {/* Right: Language Picker, Run, Submit */}
        <div className="flex items-center gap-2.5">
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value as any)}
            className="py-1.5 px-3 rounded-lg bg-dark-bg border border-dark-border text-xs font-semibold text-slate-200 focus:outline-none focus:border-brand-500 cursor-pointer"
          >
            <option value="python">Python 3.11</option>
            <option value="javascript">JavaScript (Node.js 20)</option>
            <option value="java">Java 17 (OpenJDK)</option>
            <option value="cpp">C++ 20 (GCC)</option>
            <option value="c">C (GCC 11)</option>
          </select>

          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-dark-elevated transition-colors"
            title="Reset code template"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={handleRunCode}
            disabled={isRunning || isSubmitting}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-dark-elevated hover:bg-dark-elevated/80 border border-dark-border transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
            <span>{isRunning ? 'Running...' : 'Run Code'}</span>
          </button>

          <button
            onClick={handleSubmitSolution}
            disabled={isRunning || isSubmitting}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 shadow-sm transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Evaluating...' : 'Submit Final'}</span>
          </button>
        </div>
      </div>

      {/* Main Split Layout: Left Problem Pane, Right Editor Pane */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left: Problem Details & Public Test Cases */}
        <div className="w-full md:w-1/2 lg:w-5/12 border-r border-dark-border bg-dark-bg/60 p-6 overflow-y-auto space-y-6">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Category: {selectedQuestion.category}
            </span>
            <h2 className="text-xl font-extrabold text-white">{selectedQuestion.title}</h2>
          </div>

          <div className="text-xs text-slate-300 leading-relaxed space-y-3">
            <p className="whitespace-pre-line">{selectedQuestion.description}</p>
          </div>

          {/* Constraints */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Constraints:
            </h3>
            <ul className="list-disc pl-5 space-y-1 text-xs text-slate-400 font-mono">
              {selectedQuestion.constraints.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>

          {/* Public Example Test Cases */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Sample Examples:
            </h3>
            {selectedQuestion.publicTestCases.map((tc, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-dark-surface border border-dark-border text-xs space-y-1.5 font-mono">
                <div>
                  <span className="text-slate-400">Input: </span>
                  <span className="text-white font-semibold">{tc.input}</span>
                </div>
                <div>
                  <span className="text-slate-400">Expected Output: </span>
                  <span className="text-emerald-400 font-semibold">{tc.expectedOutput}</span>
                </div>
                {tc.explanation && (
                  <div className="text-[11px] text-slate-400 font-sans pt-1">
                    Explanation: {tc.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Monaco Editor + Bottom Console Terminal */}
        <div className="w-full md:w-1/2 lg:w-7/12 flex flex-col overflow-hidden bg-[#1e1e1e]">
          {/* Monaco Editor Container */}
          <div className="flex-1 min-h-[300px]">
            <Editor
              height="100%"
              language={language === 'c' || language === 'cpp' ? 'cpp' : language}
              value={code}
              onChange={(val) => setCode(val || '')}
              theme="vs-dark"
              options={{
                fontSize: 13,
                fontFamily: 'JetBrains Mono, monospace',
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 4,
                lineNumbers: 'on',
                renderLineHighlight: 'all',
              }}
            />
          </div>

          {/* Bottom Console / Terminal Drawer */}
          <div className="h-48 border-t border-dark-border bg-dark-surface/95 flex flex-col shrink-0">
            {/* Terminal Tab Bar */}
            <div className="h-9 px-4 border-b border-dark-border flex items-center justify-between text-xs">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setActiveTab('testcases')}
                  className={`font-semibold py-2 transition-colors flex items-center gap-1.5 ${
                    activeTab === 'testcases' ? 'text-white border-b-2 border-brand-500' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5" />
                  <span>Test Cases</span>
                </button>
                <button
                  onClick={() => setActiveTab('console')}
                  className={`font-semibold py-2 transition-colors flex items-center gap-1.5 ${
                    activeTab === 'console' ? 'text-white border-b-2 border-brand-500' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Execution Output</span>
                </button>
              </div>

              {executionResult.executionTimeMs && (
                <span className="text-[11px] text-slate-400 font-mono">
                  Runtime: <strong className="text-emerald-400">{executionResult.executionTimeMs} ms</strong>
                </span>
              )}
            </div>

            {/* Terminal Body */}
            <div className="flex-1 p-3 overflow-y-auto font-mono text-xs text-slate-300">
              {activeTab === 'console' ? (
                <pre className="whitespace-pre-wrap leading-relaxed">
                  {executionResult.output || 'Click "Run Code" or "Submit Final" to evaluate your code.'}
                </pre>
              ) : (
                <div className="space-y-2">
                  <div className="text-[11px] text-slate-400">
                    Click each test case to inspect assertion requirements:
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedQuestion.publicTestCases.map((tc, idx) => (
                      <div key={idx} className="p-2 rounded bg-dark-bg border border-dark-border text-[11px]">
                        <span className="font-bold text-white block">Case {idx + 1}</span>
                        <span className="text-emerald-400 font-semibold">{tc.expectedOutput}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
