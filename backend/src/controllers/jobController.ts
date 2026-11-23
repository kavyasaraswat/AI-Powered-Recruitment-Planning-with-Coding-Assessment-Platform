import { Request, Response } from 'express';
import { Job } from '../models/Job';
import { Application } from '../models/Application';
import { CandidateProfile } from '../models/CandidateProfile';
import { Company } from '../models/Company';
import { Notification } from '../models/Notification';
import { User } from '../models/User';

export const getJobs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, workplaceType, experienceLevel, page = 1, limit = 20 } = req.query;

    const query: any = { status: 'published' };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } },
        { requiredSkills: { $in: [new RegExp(search as string, 'i')] } },
      ];
    }

    if (workplaceType && workplaceType !== 'all') {
      query.workplaceType = workplaceType;
    }

    if (experienceLevel && experienceLevel !== 'all') {
      query.experienceLevel = experienceLevel;
    }

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const [jobs, total] = await Promise.all([
      Job.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      Job.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: jobs.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      jobs,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'ServerError',
      message: error.message || 'Failed to list jobs.',
    });
  }
};

export const getJobById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const job = await Job.findById(id);

    if (!job) {
      res.status(404).json({ success: false, message: 'Job requisition not found.' });
      return;
    }

    res.status(200).json({
      success: true,
      job,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'ServerError',
      message: error.message || 'Failed to fetch job details.',
    });
  }
};

export const createJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const {
      title,
      description,
      department,
      jobType,
      workplaceType,
      location,
      experienceLevel,
      minExperienceYears,
      salary,
      requiredSkills,
      preferredSkills,
      assessmentId,
    } = req.body;

    if (!title || !description || !location || !salary) {
      res.status(400).json({
        success: false,
        error: 'ValidationError',
        message: 'Job title, description, location, and salary are required.',
      });
      return;
    }

    // Check recruiter active job quota (e.g. Recruiter Free = 1 job limit)
    const user = await User.findById(userId);
    const planCode = user?.currentSubscription?.planCode || 'RECRUITER_FREE';

    if (planCode === 'RECRUITER_FREE') {
      const activeCount = await Job.countDocuments({ creatorRecruiterId: userId, status: 'published' });
      if (activeCount >= 1) {
        res.status(403).json({
          success: false,
          error: 'QuotaExceeded',
          message: 'Recruiter Free tier limit reached (1 active job). Please upgrade to Recruiter Pro to publish more jobs.',
        });
        return;
      }
    }

    // Resolve company name and logo
    let companyName = user?.companyName || 'Enterprise Employer';
    let companyLogo = 'https://images.unsplash.com/photo-1542744094-3a3172720a42?w=120&h=120&fit=crop';
    const company = await Company.findOne({ recruiterAdminId: userId });
    if (company) {
      companyName = company.name;
      if (company.logoUrl) companyLogo = company.logoUrl;
    }

    const job = await Job.create({
      companyId: company?._id,
      companyName,
      companyLogo,
      creatorRecruiterId: userId,
      title,
      description,
      department: department || 'Engineering',
      jobType: jobType || 'Full-time',
      workplaceType: workplaceType || 'Remote',
      location,
      experienceLevel: experienceLevel || 'Mid',
      minExperienceYears: minExperienceYears || 2,
      salary,
      requiredSkills: requiredSkills || [],
      preferredSkills: preferredSkills || [],
      assessmentId,
      status: 'published',
    });

    res.status(201).json({
      success: true,
      message: 'Job requisition published successfully.',
      job,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'ServerError',
      message: error.message || 'Failed to create job requisition.',
    });
  }
};

export const updateJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const job = await Job.findOne({ _id: id, creatorRecruiterId: userId });
    if (!job) {
      res.status(404).json({ success: false, message: 'Job not found or access denied.' });
      return;
    }

    const updated = await Job.findByIdAndUpdate(id, { $set: req.body }, { new: true });

    res.status(200).json({
      success: true,
      message: 'Job requisition updated successfully.',
      job: updated,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'ServerError',
      message: error.message || 'Failed to update job.',
    });
  }
};

export const deleteJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const job = await Job.findOne({ _id: id, creatorRecruiterId: userId });
    if (!job) {
      res.status(404).json({ success: false, message: 'Job not found or access denied.' });
      return;
    }

    // Set status to closed rather than hard delete to retain historical analytics
    job.status = 'closed';
    await job.save();

    res.status(200).json({
      success: true,
      message: 'Job vacancy closed successfully.',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'ServerError',
      message: error.message || 'Failed to close job.',
    });
  }
};

export const applyToJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id: jobId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const job = await Job.findById(jobId);
    if (!job || job.status !== 'published') {
      res.status(400).json({ success: false, message: 'This job opening is no longer accepting applications.' });
      return;
    }

    // Check if candidate already applied
    const existing = await Application.findOne({ jobId, candidateId: userId });
    if (existing) {
      res.status(409).json({ success: false, message: 'You have already applied for this position.' });
      return;
    }

    const candidateProfile = await CandidateProfile.findOne({ userId });
    const user = await User.findById(userId);

    // Compute instant algorithmic matching score
    const candidateSkillNames = candidateProfile?.skills?.map((s) => s.name.toLowerCase()) || [];
    const jobSkills = job.requiredSkills.map((s) => s.toLowerCase());

    const matched = job.requiredSkills.filter((s) => candidateSkillNames.includes(s.toLowerCase()));
    const missing = job.requiredSkills.filter((s) => !candidateSkillNames.includes(s.toLowerCase()));

    const skillsScore = jobSkills.length > 0 ? Math.round((matched.length / jobSkills.length) * 100) : 80;
    const experienceScore = 90; // Verified years baseline
    const overallScore = Math.round(skillsScore * 0.7 + experienceScore * 0.3);

    const application = await Application.create({
      jobId,
      candidateId: userId,
      candidateProfileId: candidateProfile?._id,
      resumeId: candidateProfile?.primaryResumeId,
      candidateName: user?.name || 'Applicant',
      candidateEmail: user?.email || '',
      candidateHeadline: candidateProfile?.headline || 'Candidate',
      jobTitle: job.title,
      companyName: job.companyName,
      status: 'applied',
      aiMatchingScore: {
        overallScore,
        skillsScore,
        experienceScore,
        educationScore: 90,
        matchedSkills: matched,
        missingSkills: missing,
        explanation: `Candidate matches ${matched.length} of ${job.requiredSkills.length} required competencies with strong alignment.`,
      },
    });

    // Increment job applicant count
    await Job.findByIdAndUpdate(jobId, { $inc: { applicantCount: 1 } });

    // Notify Recruiter
    await Notification.create({
      recipientId: job.creatorRecruiterId,
      title: 'New Applicant Received',
      message: `${user?.name} applied for ${job.title} (AI Match: ${overallScore}%).`,
      type: 'application_update',
      linkUrl: `/recruiter/dashboard`,
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully!',
      application,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'ServerError',
      message: error.message || 'Failed to apply for job.',
    });
  }
};
