import { Job, Application, CodingQuestion, SubscriptionPlan, CandidateProfile } from '../types';

export const INITIAL_JOBS: Job[] = [
  {
    id: 'job-1',
    title: 'Senior Full Stack Engineer',
    companyName: 'CloudScale Technologies',
    companyLogo: 'https://images.unsplash.com/photo-1542744094-3a3172720a42?w=100&h=100&fit=crop',
    department: 'Engineering',
    jobType: 'Full-time',
    workplaceType: 'Remote',
    location: 'Bengaluru, India (Remote)',
    experienceLevel: 'Senior',
    salary: { min: 2400000, max: 3600000, currency: 'INR' },
    description: 'We are seeking a senior full stack engineer proficient in React, Node.js, TypeScript, and distributed systems to lead the core platform team.',
    requiredSkills: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'Docker'],
    preferredSkills: ['Kubernetes', 'GraphQL', 'AWS', 'Redis'],
    applicantCount: 28,
    status: 'published',
    createdAt: '2026-11-20T10:00:00Z',
    matchScore: 92,
  },
  {
    id: 'job-2',
    title: 'AI / Machine Learning Engineer',
    companyName: 'NeuroSync AI',
    companyLogo: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=100&h=100&fit=crop',
    department: 'AI Research',
    jobType: 'Full-time',
    workplaceType: 'Hybrid',
    location: 'Hyderabad, India',
    experienceLevel: 'Mid',
    salary: { min: 1800000, max: 2800000, currency: 'INR' },
    description: 'Build production-ready LLM pipelines, vector search databases, and NLP feature extraction engines for enterprise recruiters.',
    requiredSkills: ['Python', 'FastAPI', 'PyTorch', 'Vector DB', 'NLP'],
    preferredSkills: ['LangChain', 'Hugging Face', 'Docker', 'MLOps'],
    applicantCount: 42,
    status: 'published',
    createdAt: '2026-11-18T14:30:00Z',
    matchScore: 84,
  },
  {
    id: 'job-3',
    title: 'Frontend React Architect',
    companyName: 'FinPulse Systems',
    companyLogo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=100&h=100&fit=crop',
    department: 'UI/UX Engineering',
    jobType: 'Full-time',
    workplaceType: 'Remote',
    location: 'Mumbai, India (Remote)',
    experienceLevel: 'Lead',
    salary: { min: 3000000, max: 4500000, currency: 'INR' },
    description: 'Direct our frontend design system and high-throughput real-time trading dashboard using React, Tailwind, and WebSockets.',
    requiredSkills: ['React', 'TypeScript', 'Tailwind CSS', 'Redux / Zustand', 'WebSockets'],
    preferredSkills: ['Figma', 'Microfrontends', 'Performance Profiling'],
    applicantCount: 19,
    status: 'published',
    createdAt: '2026-11-21T09:15:00Z',
    matchScore: 78,
  },
];

export const INITIAL_APPLICATIONS: Application[] = [
  {
    id: 'app-1',
    jobId: 'job-1',
    candidateId: 'user-cand-1',
    candidateName: 'Aditya Sharma',
    candidateEmail: 'aditya.sharma@example.com',
    candidateHeadline: 'Full Stack Engineer | React, Node.js, TS',
    jobTitle: 'Senior Full Stack Engineer',
    companyName: 'CloudScale Technologies',
    status: 'shortlisted',
    appliedAt: '2026-11-21T11:20:00Z',
    aiMatchingScore: {
      overallScore: 92,
      skillsScore: 95,
      experienceScore: 90,
      matchedSkills: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'Docker'],
      missingSkills: ['Kubernetes'],
      explanation: 'Candidate has 4.5+ years of verified production experience in full stack TypeScript web apps with high architecture alignment.',
    },
    assessmentScore: 95,
  },
  {
    id: 'app-2',
    jobId: 'job-1',
    candidateId: 'user-cand-2',
    candidateName: 'Priya Patel',
    candidateEmail: 'priya.patel@example.com',
    candidateHeadline: 'Backend Specialist | Node.js & Go',
    jobTitle: 'Senior Full Stack Engineer',
    companyName: 'CloudScale Technologies',
    status: 'assessment',
    appliedAt: '2026-11-22T08:45:00Z',
    aiMatchingScore: {
      overallScore: 81,
      skillsScore: 85,
      experienceScore: 78,
      matchedSkills: ['Node.js', 'Docker', 'MongoDB'],
      missingSkills: ['React', 'TypeScript'],
      explanation: 'Strong backend foundation with Docker; however lacks frontend React leadership depth.',
    },
    assessmentScore: 82,
  },
  {
    id: 'app-3',
    jobId: 'job-2',
    candidateId: 'user-cand-3',
    candidateName: 'Rahul Verma',
    candidateEmail: 'rahul.v@example.com',
    candidateHeadline: 'ML Engineer | NLP & Deep Learning',
    jobTitle: 'AI / Machine Learning Engineer',
    companyName: 'NeuroSync AI',
    status: 'interview',
    appliedAt: '2026-11-19T16:10:00Z',
    aiMatchingScore: {
      overallScore: 88,
      skillsScore: 92,
      experienceScore: 85,
      matchedSkills: ['Python', 'FastAPI', 'PyTorch', 'NLP'],
      missingSkills: ['MLOps'],
      explanation: 'Strong portfolio of published NLP models and FastAPI microservices.',
    },
    assessmentScore: 88,
  },
];

export const CODING_QUESTIONS: CodingQuestion[] = [
  {
    id: 'q-1',
    title: 'Two Sum Problem',
    difficulty: 'Easy',
    category: 'Algorithms & Hash Maps',
    description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.'
    ],
    starterCode: {
      python: `def twoSum(nums, target):
    # Write your solution here
    seen = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in seen:
            return [seen[diff], i]
        seen[num] = i
    return []

# Example execution
print(twoSum([2, 7, 11, 15], 9))
`,
      javascript: `function twoSum(nums, target) {
  // Write your solution here
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i];
    if (seen.has(diff)) {
      return [seen.get(diff), i];
    }
    seen.set(nums[i], i);
  }
  return [];
}

console.log(JSON.stringify(twoSum([2, 7, 11, 15], 9)));
`,
      java: `import java.util.*;

public class Solution {
    public static int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        return new int[]{};
    }

    public static void main(String[] args) {
        int[] result = twoSum(new int[]{2, 7, 11, 15}, 9);
        System.out.println(Arrays.toString(result));
    }
}
`,
      cpp: `#include <iostream>
#include <vector>
#include <unordered_map>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> seen;
    for (int i = 0; i < nums.size(); ++i) {
        int diff = target - nums[i];
        if (seen.find(diff) != seen.end()) {
            return {seen[diff], i};
        }
        seen[nums[i]] = i;
    }
    return {};
}

int main() {
    vector<int> nums = {2, 7, 11, 15};
    vector<int> res = twoSum(nums, 9);
    cout << "[" << res[0] << ", " << res[1] << "]" << endl;
    return 0;
}
`,
      c: `#include <stdio.h>
#include <stdlib.h>

int* twoSum(int* nums, int numsSize, int target, int* returnSize) {
    *returnSize = 2;
    int* result = (int*)malloc(2 * sizeof(int));
    for (int i = 0; i < numsSize; i++) {
        for (int j = i + 1; j < numsSize; j++) {
            if (nums[i] + nums[j] == target) {
                result[0] = i;
                result[1] = j;
                return result;
            }
        }
    }
    *returnSize = 0;
    return NULL;
}

int main() {
    int nums[] = {2, 7, 11, 15};
    int retSize;
    int* res = twoSum(nums, 4, 9, &retSize);
    if (res) printf("[%d, %d]\\n", res[0], res[1]);
    return 0;
}
`
    },
    publicTestCases: [
      { input: 'nums = [2, 7, 11, 15], target = 9', expectedOutput: '[0, 1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' },
      { input: 'nums = [3, 2, 4], target = 6', expectedOutput: '[1, 2]', explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].' },
      { input: 'nums = [3, 3], target = 6', expectedOutput: '[0, 1]' }
    ]
  },
  {
    id: 'q-2',
    title: 'Valid Palindrome String',
    difficulty: 'Easy',
    category: 'Strings & Two Pointers',
    description: `A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.

Given a string \`s\`, return \`true\` if it is a palindrome, or \`false\` otherwise.`,
    constraints: [
      '1 <= s.length <= 2 * 10^5',
      's consists only of printable ASCII characters.'
    ],
    starterCode: {
      python: `def isPalindrome(s: str) -> bool:
    cleaned = ''.join(c.lower() for c in s if c.isalnum())
    return cleaned == cleaned[::-1]

print(isPalindrome("A man, a plan, a canal: Panama"))
`,
      javascript: `function isPalindrome(s) {
  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  return clean === clean.split('').reverse().join('');
}

console.log(isPalindrome("A man, a plan, a canal: Panama"));
`
    },
    publicTestCases: [
      { input: 's = "A man, a plan, a canal: Panama"', expectedOutput: 'true', explanation: '"amanaplanacanalpanama" is a palindrome.' },
      { input: 's = "race a car"', expectedOutput: 'false', explanation: '"raceacar" is not a palindrome.' }
    ]
  }
];

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  // Candidate Plans
  {
    id: 'plan-cand-free',
    name: 'Candidate Free',
    code: 'CANDIDATE_FREE',
    targetRole: 'candidate',
    priceMonthly: 0,
    priceYearly: 0,
    features: [
      'Basic Candidate Profile',
      '10 AI Chatbot messages / day',
      'Standard Job Applications',
      'Basic Coding Practice Hub',
      'Standard Resume Upload'
    ]
  },
  {
    id: 'plan-cand-pro',
    name: 'Candidate Pro',
    code: 'CANDIDATE_PRO',
    targetRole: 'candidate',
    priceMonthly: 299,
    priceYearly: 2870,
    isPopular: true,
    features: [
      'Everything in Free',
      '100 AI Chatbot queries / day',
      'AI Resume Match & Gap Analysis',
      'AI Bullet-Point Optimizer',
      'Advanced Coding Challenges with Solutions',
      'Saved Interview Simulations'
    ]
  },
  {
    id: 'plan-cand-prem',
    name: 'Candidate Premium',
    code: 'CANDIDATE_PREMIUM',
    targetRole: 'candidate',
    priceMonthly: 599,
    priceYearly: 5750,
    features: [
      'Everything in Pro',
      'Unlimited AI Career Assistant Access',
      'Comprehensive Career Gap & Skills Roadmap',
      'Priority Application Visibility to Recruiters',
      'Real-time Mock Technical Interview Bots',
      '1-on-1 Portfolio & Code Review Insights'
    ]
  },
  // Recruiter Plans
  {
    id: 'plan-rec-free',
    name: 'Recruiter Free',
    code: 'RECRUITER_FREE',
    targetRole: 'recruiter',
    priceMonthly: 0,
    priceYearly: 0,
    features: [
      '1 Active Job Vacancy',
      'Up to 25 Applicants per job',
      'Standard Candidate Review Table',
      'Basic Manual Filtering'
    ]
  },
  {
    id: 'plan-rec-pro',
    name: 'Recruiter Pro',
    code: 'RECRUITER_PRO',
    targetRole: 'recruiter',
    priceMonthly: 999,
    priceYearly: 9590,
    isPopular: true,
    features: [
      '10 Active Job Openings',
      'Up to 500 Applicants per job',
      'AI Resume Parser & Vector Matching Score',
      'AI-Generated Job Descriptions',
      'Custom Coding Assessment Creation',
      'Pipeline Funnel Analytics'
    ]
  },
  {
    id: 'plan-rec-ent',
    name: 'Enterprise',
    code: 'ENTERPRISE',
    targetRole: 'recruiter',
    priceMonthly: 2499,
    priceYearly: 23990,
    features: [
      'Unlimited Active Job Vacancies',
      'Unlimited Applicants & Bulk Resume Parsing',
      'Advanced Recruiter Analytics & Benchmarking',
      'Multi-seat Team Collaboration',
      'Custom Coding Sandbox Assertions',
      'Priority Dedicated Account Support'
    ]
  }
];

export const MOCK_CANDIDATE_PROFILE: CandidateProfile = {
  id: 'cand-prof-1',
  userId: 'user-cand-1',
  headline: 'Senior Full Stack Software Engineer | React, TypeScript & Node.js',
  bio: 'Passionate software craftsman with 4+ years of building resilient, scalable web applications, real-time microservices, and AI-enabled developer tools.',
  location: 'Bengaluru, Karnataka, India',
  githubUrl: 'https://github.com/adityasharma',
  linkedinUrl: 'https://linkedin.com/in/adityasharma',
  portfolioUrl: 'https://adityasharma.dev',
  skills: [
    { name: 'React', level: 'expert' },
    { name: 'TypeScript', level: 'expert' },
    { name: 'Node.js', level: 'advanced' },
    { name: 'MongoDB', level: 'advanced' },
    { name: 'Docker', level: 'intermediate' },
    { name: 'Python', level: 'intermediate' },
    { name: 'Tailwind CSS', level: 'expert' }
  ],
  education: [
    {
      institution: 'Indian Institute of Information Technology (IIIT)',
      degree: 'B.Tech',
      fieldOfStudy: 'Computer Science & Engineering',
      startYear: 2020,
      endYear: 2024
    }
  ],
  experience: [
    {
      company: 'TechWave Solutions',
      title: 'Software Development Engineer II',
      startDate: '2024-06-01',
      isCurrent: true,
      description: 'Architected high-throughput customer dashboards using React, Redux, and Node.js microservices serving 200k+ daily active users.'
    },
    {
      company: 'Innovate Labs',
      title: 'Junior Frontend Developer',
      startDate: '2023-01-15',
      endDate: '2024-05-30',
      isCurrent: false,
      description: 'Implemented responsive design systems, automated UI component unit tests, and reduced client bundle size by 35%.'
    }
  ],
  certifications: [
    {
      title: 'AWS Certified Solutions Architect – Associate',
      issuingOrganization: 'Amazon Web Services',
      issueDate: '2025-03-15'
    }
  ]
};
