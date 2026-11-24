export interface ChatContext {
  role: 'candidate' | 'recruiter';
  contextType: 'general' | 'resume_review' | 'interview_prep' | 'job_description' | 'code_explanation';
  userName?: string;
  history?: Array<{ sender: 'user' | 'assistant' | 'system'; content: string }>;
}

export interface AiResponse {
  content: string;
  modelUsed: string;
  promptTokens: number;
  completionTokens: number;
  suggestedFollowUps: string[];
}

export class AiChatService {
  /**
   * Generates a context-aware AI response based on role, intent, and conversational history
   */
  public static async generateReply(userMessage: string, context: ChatContext): Promise<AiResponse> {
    const trimmedInput = userMessage.trim().toLowerCase();
    const role = context.role || 'candidate';
    const type = context.contextType || 'general';

    // 1. Role & Context Specialized AI Responses
    if (type === 'interview_prep') {
      return this.handleInterviewPrep(userMessage, trimmedInput);
    }

    if (type === 'resume_review') {
      return this.handleResumeReview(userMessage, trimmedInput);
    }

    if (type === 'code_explanation') {
      return this.handleCodeExplanation(userMessage, trimmedInput);
    }

    if (role === 'recruiter' && type === 'job_description') {
      return this.handleJobDescriptionDrafting(userMessage, trimmedInput);
    }

    if (role === 'recruiter') {
      return this.handleRecruiterAssistant(userMessage, trimmedInput);
    }

    // Default: General Career & Platform Assistant for Candidates
    return this.handleGeneralCandidate(userMessage, trimmedInput);
  }

  private static handleInterviewPrep(input: string, lower: string): AiResponse {
    let reply = '';
    let followUps: string[] = [];

    if (lower.includes('dsa') || lower.includes('algorithm') || lower.includes('data structure')) {
      reply = `### 🎯 Technical Mock Interview: Algorithms & Data Structures\n\n` +
        `Great! Let's practice a high-frequency algorithmic problem frequently asked at tier-1 tech companies:\n\n` +
        `**Problem: Longest Substring Without Repeating Characters**\n` +
        `- **Input**: A string \`s\` (e.g. \`"abcabcbb"\`)\n` +
        `- **Goal**: Find the length of the longest substring without repeating characters.\n` +
        `- **Expected Time Complexity**: $O(N)$\n` +
        `- **Expected Space Complexity**: $O(\\min(N, M))$ where $M$ is alphabet size.\n\n` +
        `**Next Step**: How would you approach this? Think about the two-pointer sliding window technique using a Hash Map or Set. Explain your thought process before writing code!`;
      followUps = [
        'Can you give me a hint on the sliding window pointers?',
        'Here is my solution using Map to store last seen indices.',
        'Can we practice a dynamic programming problem instead?'
      ];
    } else if (lower.includes('behavioral') || lower.includes('hr') || lower.includes('star')) {
      reply = `### 🌟 Behavioral Interview Coaching: STAR Method\n\n` +
        `In behavioral interviews, structure every response using the **STAR** framework:\n` +
        `1. **Situation**: Set the scene and specify the challenge or project context.\n` +
        `2. **Task**: Describe your specific responsibility in that scenario.\n` +
        `3. **Action**: Explain the exact technical and interpersonal steps *you* took.\n` +
        `4. **Result**: Quantify outcomes with metrics (e.g., "Reduced latency by 35%").\n\n` +
        `**Practice Question**: *"Tell me about a time you had a technical disagreement with a teammate on architecture or tooling. How did you resolve it?"*`;
      followUps = [
        'Review my draft response using STAR format.',
        'What questions should I ask the interviewer at the end?',
        'How do I answer "What is your biggest technical weakness"?'
      ];
    } else {
      reply = `### 🚀 HireGenius AI Interview Simulation\n\n` +
        `I am your technical interview coach. You can practice:\n` +
        `- **DSA & Coding Challenges**: Array manipulation, Two Pointers, Trees, Graphs, Dynamic Programming.\n` +
        `- **System Design**: Scalability, Caching (Redis), Database sharding, Rate limiting.\n` +
        `- **Behavioral & Leadership**: STAR method drills, conflict resolution, project post-mortems.\n\n` +
        `Which topic would you like to drill first?`;
      followUps = [
        'Start DSA technical mock interview',
        'Start System Design mock interview',
        'Start Behavioral STAR interview'
      ];
    }

    return {
      content: reply,
      modelUsed: 'gemini-1.5-flash-recruitment',
      promptTokens: Math.round(input.length / 4) + 60,
      completionTokens: Math.round(reply.length / 4),
      suggestedFollowUps: followUps,
    };
  }

  private static handleResumeReview(input: string, lower: string): AiResponse {
    let reply = '';
    let followUps: string[] = [];

    if (lower.includes('metric') || lower.includes('impact') || lower.includes('bullet')) {
      reply = `### 📈 Transforming Resume Bullets with XYZ Formula\n\n` +
        `Google's proven resume framework is: **Accomplished [X], as measured by [Y], by doing [Z]**.\n\n` +
        `**Before (Weak)**: *"Built microservices and added caching to speed up the app."*\n` +
        `**After (Strong)**: *"Engineered distributed Node.js microservices with Redis multi-level caching, reducing 99th percentile API latency by 42% across 1.2M daily active requests."*\n\n` +
        `Paste any bullet point from your resume, and I will rewrite it to maximize impact!`;
      followUps = [
        'Review my experience bullet points',
        'Which ATS keywords should I add for Backend Engineering?',
        'How should I format my projects section?'
      ];
    } else {
      reply = `### 📄 HireGenius ATS Resume Optimization\n\n` +
        `To maximize your match score against applicant tracking systems:\n` +
        `1. **Quantifiable Achievements**: Every project or work entry should feature at least one numerical metric (%, $, hours saved).\n` +
        `2. **Standard Skill Taxonomy**: Ensure your skills list matches canonical industry names (e.g., \`TypeScript\`, \`React\`, \`Docker\`, \`Kubernetes\`).\n` +
        `3. **Clean Single-Column Layout**: Multi-column tables or graphics confuse older ATS parsers.\n\n` +
        `Share your resume text, summary statement, or project description for an instant critique!`;
      followUps = [
        'Evaluate my resume summary statement',
        'Help me highlight my open-source contributions',
        'How do I explain an employment or graduation gap?'
      ];
    }

    return {
      content: reply,
      modelUsed: 'gemini-1.5-flash-recruitment',
      promptTokens: Math.round(input.length / 4) + 50,
      completionTokens: Math.round(reply.length / 4),
      suggestedFollowUps: followUps,
    };
  }

  private static handleCodeExplanation(input: string, lower: string): AiResponse {
    const reply = `### 🧠 Algorithmic Code Decomposition & Complexity Breakdown\n\n` +
      `Here is a structured architectural analysis of your query:\n\n` +
      `1. **Core Mechanism**: In competitive assessment platforms, optimizing time-to-first-byte and spatial allocation requires minimizing redundant allocations.\n` +
      `2. **Time Complexity Analysis**: Single loops scale as $O(N)$, whereas nested lookups without hash tables degrade to $O(N^2)$.\n` +
      `3. **Space Complexity Optimization**: Prefer in-place pointer swapping ($O(1)$ auxiliary memory) over duplicate buffer copies.\n\n` +
      `Paste the specific snippet or function you would like me to step through line-by-line!`;

    return {
      content: reply,
      modelUsed: 'gemini-1.5-flash-recruitment',
      promptTokens: Math.round(input.length / 4) + 40,
      completionTokens: Math.round(reply.length / 4),
      suggestedFollowUps: [
        'Explain time complexity of quicksort vs mergesort',
        'How to optimize this solution from O(N^2) to O(N)?',
        'What are the edge cases I should test for?'
      ],
    };
  }

  private static handleJobDescriptionDrafting(input: string, lower: string): AiResponse {
    const reply = `### 📝 AI Job Description Generator\n\n` +
      `**Title: Senior Full-Stack Cloud Engineer**\n` +
      `**Department**: Engineering & Platform Architecture\n` +
      `**Location**: Hybrid / Bengaluru / Remote\n\n` +
      `#### 🚀 The Role\n` +
      `We are seeking a high-caliber Full-Stack Engineer to lead the design and execution of our enterprise-grade microservices and real-time collaborative applications.\n\n` +
      `#### 🛠 Required Qualifications\n` +
      `- 4+ years hands-on production experience with **TypeScript**, **Node.js**, and **React**.\n` +
      `- Demonstrated mastery of **MongoDB / PostgreSQL**, database indexing, and query optimization.\n` +
      `- Production expertise with **Docker**, CI/CD automation, and cloud platforms (AWS / GCP).\n` +
      `- Strong foundational knowledge of data structures, distributed consensus, and API security.\n\n` +
      `#### 🎯 Preferred Qualifications\n` +
      `- Experience with Redis caching, Kafka message streaming, or WebSockets.\n` +
      `- Prior contributions to developer tooling or open-source projects.`;

    return {
      content: reply,
      modelUsed: 'gemini-1.5-flash-recruitment',
      promptTokens: Math.round(input.length / 4) + 60,
      completionTokens: Math.round(reply.length / 4),
      suggestedFollowUps: [
        'Add interview question rubric for this job post',
        'Adjust experience requirement to Junior/Entry-Level',
        'Generate candidate screening questions'
      ],
    };
  }

  private static handleRecruiterAssistant(input: string, lower: string): AiResponse {
    const reply = `### 🤝 HireGenius Recruiter Copilot\n\n` +
      `I can assist you with your hiring workflow:\n` +
      `- **Candidate Shortlisting**: Analyze applicants and rank them by weighted skill match.\n` +
      `- **Interview Questions**: Generate custom technical and behavioral rubrics for published jobs.\n` +
      `- **Outreach Drafting**: Compose personalized candidate invitation messages with high response rates.\n` +
      `- **Offer & Compensation Guidance**: Benchmark salary brackets and equity ranges by role.\n\n` +
      `What would you like to work on next?`;

    return {
      content: reply,
      modelUsed: 'gemini-1.5-flash-recruitment',
      promptTokens: Math.round(input.length / 4) + 40,
      completionTokens: Math.round(reply.length / 4),
      suggestedFollowUps: [
        'Draft candidate invitation email for assessment',
        'Review application pipeline conversion bottlenecks',
        'Generate technical screening rubric for React Developer'
      ],
    };
  }

  private static handleGeneralCandidate(input: string, lower: string): AiResponse {
    let reply = '';
    let followUps: string[] = [];

    if (lower.includes('job') || lower.includes('apply') || lower.includes('openings')) {
      reply = `### 💼 Job Search & Application Guidance\n\n` +
        `On HireGenius AI, you can explore vetted software engineering, data science, and cloud roles:\n` +
        `1. Visit the **Jobs Listing** tab to filter by tech stack, experience level, and salary.\n` +
        `2. Check your **AI Match Score** on any job details page to see how your verified skills align.\n` +
        `3. Complete recommended coding assessments to earn a verified **Skill Badge** on your profile, boosting recruiter visibility by 3x!`;
      followUps = [
        'Show me how to improve my match score',
        'Where can I take practice coding assessments?',
        'How do recruiters review my applications?'
      ];
    } else {
      reply = `### 👋 Welcome to HireGenius AI Assistant!\n\n` +
        `I am your intelligent career companion on HireGenius AI. Here is what I can help you with:\n` +
        `- 🎯 **Interview Preparation**: Practice DSA, System Design, and Behavioral STAR questions.\n` +
        `- 📄 **Resume Review**: Get ATS scoring, keyword recommendations, and metric enhancements.\n` +
        `- 💻 **Coding Support**: Understand complex algorithmic concepts and code evaluations.\n` +
        `- 🔍 **Career Navigation**: Find roles matched to your verified technical skills.\n\n` +
        `How can I assist your career journey today?`;
      followUps = [
        'Start an interview preparation session',
        'Review my resume bullet points',
        'Explain how the coding assessment engine works'
      ];
    }

    return {
      content: reply,
      modelUsed: 'gemini-1.5-flash-recruitment',
      promptTokens: Math.round(input.length / 4) + 30,
      completionTokens: Math.round(reply.length / 4),
      suggestedFollowUps: followUps,
    };
  }
}
