import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { PaywallModal } from '../../components/paywall/PaywallModal';
import { ChatMessage } from '../../types';
import {
  Sparkles,
  Send,
  Plus,
  Trash2,
  Copy,
  Check,
  Bot,
  User,
  Zap,
  HelpCircle,
  FileText,
  Briefcase,
  Code2
} from 'lucide-react';

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'm-1',
    sender: 'assistant',
    content: `Hello! I am **HireGenius AI Assistant**. 

I am trained on thousands of technical hiring loops, engineering job descriptions, and code interview benchmarks. 

Here are a few things I can assist you with:
- **Resume Optimization**: Improve your bullet points with high-impact action metrics.
- **Mock Interviews**: Run a simulated interview for Full Stack, DevOps, or ML roles.
- **Code Debugging**: Explain time complexity, edge cases, and algorithmic patterns.
- **Job Description Writing**: (For recruiters) Generate comprehensive technical requisitions.`,
    timestamp: 'Just now',
  },
];

export const ChatPage: React.FC = () => {
  const { user, role } = useAuth();
  const { addToast } = useNotification();
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Paywall state
  const [paywallOpen, setPaywallOpen] = useState(false);

  const candidatePrompts = [
    'How do I explain a 6-month career gap on my resume?',
    'Conduct a mock system design interview for a URL Shortener',
    'Review my React & TypeScript experience bullet points',
    'Explain the two-pointer approach for Palindrome algorithms',
  ];

  const recruiterPrompts = [
    'Write a job description for a Senior AI / ML Engineer',
    'Generate 5 behavioral and technical interview questions for a React lead',
    'How do I compare two candidates with similar skill scores?',
    'Create assessment rubric for frontend state management',
  ];

  const suggestedPrompts = role === 'recruiter' ? recruiterPrompts : candidatePrompts;

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      content: text,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Simulate intelligent LLM streaming response
    setTimeout(() => {
      setIsTyping(false);
      let replyContent = '';

      if (text.toLowerCase().includes('job description') || text.toLowerCase().includes('write')) {
        replyContent = `### Senior AI / Machine Learning Engineer Job Description
**Company**: CloudScale Technologies  
**Location**: Remote / Hybrid (Bengaluru, India)  
**Compensation**: ₹24L – ₹38L CTC + Equity

#### Role Purpose
We are seeking an experienced **Machine Learning Engineer** to scale our real-time inference microservices and NLP feature pipelines.

#### Key Responsibilities
- Architect high-throughput inference endpoints using FastAPI, TorchScript, and Triton.
- Develop vector embeddings matching pipelines using Milvus/Pinecone and Sentence Transformers.
- Deploy MLOps monitoring pipelines detecting model drift and latency bottlenecks.

#### Technical Requirements
- **Must Have**: Python, PyTorch, Vector Search, Docker, REST APIs
- **Preferred**: Kubernetes, Triton, LangChain, CI/CD pipelines.`;
      } else if (text.toLowerCase().includes('gap') || text.toLowerCase().includes('resume')) {
        replyContent = `Here is how to frame your career gap with professional confidence:

1. **Be Transparent and Proactive**: State the gap cleanly without being defensive (e.g. *"Between May 2024 and Dec 2024, took planned sabbatical for advanced certifications & independent AI projects"*).
2. **Highlight Continuous Skill Acquisition**: Showcase open-source GitHub contributions, hackathon participations, or AWS/Kubernetes certifications acquired during that duration.
3. **Connect Past Learnings to Current Role**: Emphasize that you are recharged and equipped with refreshed modern skills (e.g., Docker, TypeScript, Microservices).`;
      } else {
        replyContent = `Here is an actionable breakdown regarding **"${text}"**:

1. **Core Concept**: Focus on algorithmic efficiency (O(n) time complexity over nested loops) and modular separation of concerns.
2. **Implementation Strategy**:
\`\`\`typescript
// Scalable architectural pattern
export function processCandidateSignal(input: MetricVector): MatchReport {
  const cosineScore = computeVectorSimilarity(input.profile, input.targetJob);
  return {
    score: Math.round(cosineScore * 100),
    isApproved: cosineScore >= 0.85
  };
}
\`\`\`
3. **Next Steps**: You can run practice test cases in our **Coding Hub** or upload your resume for automatic keyword enhancement!`;
      }

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        content: replyContent,
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 1000);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    addToast('info', 'Copied to Clipboard', 'Response copied to clipboard.');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleNewChat = () => {
    setMessages(INITIAL_MESSAGES);
    addToast('info', 'New Conversation Started', 'Chat history cleared for fresh context.');
  };

  return (
    <div className="flex h-[calc(100vh-6rem)] -m-4 sm:-m-6 lg:-m-8 border-t border-dark-border">
      {/* Left Chat Sidebar: History & Prompts */}
      <div className="w-72 shrink-0 hidden md:flex flex-col border-r border-dark-border bg-dark-surface/50 p-4">
        <button
          onClick={handleNewChat}
          className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 shadow-glow-brand transition-colors flex items-center justify-center gap-2 mb-4"
        >
          <Plus className="w-4 h-4" />
          <span>New AI Conversation</span>
        </button>

        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">
          Suggested Workflows
        </span>

        <div className="space-y-1.5 overflow-y-auto flex-1">
          {suggestedPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              className="w-full text-left p-2.5 rounded-xl bg-dark-bg/60 border border-dark-border hover:border-brand-500/40 text-xs text-slate-300 hover:text-white transition-all line-clamp-2"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Quota Meter Box */}
        <div className="mt-4 p-3 rounded-xl bg-dark-bg border border-dark-border text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400">Daily AI Queries</span>
            <span className="font-bold text-brand-400">85 / 100</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-dark-elevated overflow-hidden">
            <div className="h-full bg-brand-500 rounded-full" style={{ width: '85%' }} />
          </div>
          <button
            onClick={() => setPaywallOpen(true)}
            className="w-full text-center text-[10px] font-bold text-ai-400 hover:text-ai-300 pt-1"
          >
            Upgrade to Unlimited &rarr;
          </button>
        </div>
      </div>

      {/* Main Chat Workspace */}
      <div className="flex-1 flex flex-col bg-dark-bg">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 max-w-3xl ${
                msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  msg.sender === 'user'
                    ? 'bg-brand-600 text-white'
                    : 'bg-gradient-to-tr from-brand-600 to-ai-600 text-white shadow-glow-brand'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Box */}
              <div
                className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-brand-600 text-white rounded-tr-none'
                    : 'bg-dark-surface border border-dark-border text-slate-200 rounded-tl-none shadow-card'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>

                {msg.sender === 'assistant' && (
                  <div className="mt-3 pt-2 border-t border-dark-border/80 flex items-center justify-between text-[11px] text-slate-400">
                    <span>HireGenius v2.0 • Context Aware</span>
                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="hover:text-white flex items-center gap-1 transition-colors"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-ai-600 flex items-center justify-center text-white shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3.5 rounded-2xl bg-dark-surface border border-dark-border text-xs text-slate-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-brand-400 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-brand-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-brand-400 animate-bounce [animation-delay:0.4s]" />
                <span className="ml-1 text-[11px]">Synthesizing hiring insights...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-dark-border bg-dark-surface/80 backdrop-blur">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="max-w-3xl mx-auto flex items-center gap-2"
          >
            <input
              type="text"
              placeholder={`Ask HireGenius AI Assistant (${role === 'recruiter' ? 'e.g., Generate interview questions...' : 'e.g., Review my resume bullet points...'})`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 py-3 px-4 rounded-xl bg-dark-bg border border-dark-border text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isTyping}
              className="p-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white shadow-glow-brand transition-colors disabled:opacity-40"
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Paywall modal */}
      <PaywallModal
        isOpen={paywallOpen}
        onClose={() => setPaywallOpen(false)}
        featureTitle="Unlimited AI Career & Recruiter Assistant"
        featureDescription="Remove daily chat rate limits, access custom LLM fine-tuned interviewers, and save unlimited conversations."
        requiredPlanName="Candidate Pro"
        requiredPlanPrice="₹299/mo"
        targetPlanCode="CANDIDATE_PRO"
      />
    </div>
  );
};
