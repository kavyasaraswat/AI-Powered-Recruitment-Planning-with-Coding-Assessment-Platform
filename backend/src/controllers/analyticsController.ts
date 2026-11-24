import { Request, Response } from 'express';
import { Application } from '../models/Application';
import { Job } from '../models/Job';
import { Submission } from '../models/Submission';

/**
 * Recruiter recruitment funnel analytics
 */
export const getRecruiterPipelineAnalytics = async (req: Request, res: Response): Promise<void> => {
  try {
    const recruiterId = req.user?.id;
    const { jobId } = req.query;

    const jobFilter: any = { recruiterId };
    if (jobId) jobFilter._id = jobId;

    const recruiterJobs = await Job.find(jobFilter).select('_id');
    const jobIds = recruiterJobs.map((j) => j._id);

    const applications = await Application.find({ jobId: { $in: jobIds } });

    const stages = ['applied', 'screening', 'shortlisted', 'assessment', 'interview', 'selected', 'rejected'];
    const funnel: Record<string, number> = {};
    stages.forEach((s) => (funnel[s] = 0));

    let totalScore = 0;
    applications.forEach((app) => {
      const st = app.status || 'applied';
      funnel[st] = (funnel[st] || 0) + 1;
      const score = typeof app.aiMatchingScore === 'object' ? app.aiMatchingScore?.overallScore : (app.aiMatchingScore || 0);
      totalScore += score || 0;
    });

    const totalApplications = applications.length;
    const avgMatchScore = totalApplications > 0 ? Math.round(totalScore / totalApplications) : 0;
    const conversionRate = totalApplications > 0 ? Number(((funnel['selected'] / totalApplications) * 100).toFixed(1)) : 0;

    res.status(200).json({
      success: true,
      totalApplications,
      avgMatchScore,
      conversionRatePercentage: conversionRate,
      funnel,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'ServerError',
      message: error.message || 'Failed to fetch pipeline analytics.',
    });
  }
};

/**
 * Top in-demand technical skills across published platform jobs
 */
export const getSkillDemandAnalytics = async (req: Request, res: Response): Promise<void> => {
  try {
    const jobs = await Job.find({ status: 'published' }).select('requiredSkills preferredSkills');
    const skillCounts: Record<string, number> = {};

    jobs.forEach((job) => {
      (job.requiredSkills || []).forEach((skill) => {
        const canonical = skill.trim();
        skillCounts[canonical] = (skillCounts[canonical] || 0) + 3; // weighted higher for required
      });
      (job.preferredSkills || []).forEach((skill) => {
        const canonical = skill.trim();
        skillCounts[canonical] = (skillCounts[canonical] || 0) + 1;
      });
    });

    const topSkills = Object.entries(skillCounts)
      .map(([name, weight]) => ({ name, weight }))
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 15);

    res.status(200).json({
      success: true,
      topSkills,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'ServerError',
      message: error.message || 'Failed to fetch skill demand analytics.',
    });
  }
};

/**
 * Export applicants data as CSV or JSON
 */
export const exportApplicationsReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const { jobId, format = 'json' } = req.query;

    const filter: any = {};
    if (jobId) filter.jobId = jobId;

    const applications = await Application.find(filter)
      .populate('candidateId', 'name email')
      .populate('jobId', 'title')
      .sort({ createdAt: -1 });

    if (format === 'csv') {
      const header = 'ApplicationId,CandidateName,CandidateEmail,JobTitle,Stage,MatchScore,AppliedAt\n';
      const rows = applications.map((app: any) => {
        const score = typeof app.aiMatchingScore === 'object' ? app.aiMatchingScore?.overallScore : (app.aiMatchingScore || 0);
        return `"${app._id}","${app.candidateId?.name || ''}","${app.candidateId?.email || ''}","${app.jobId?.title || ''}","${app.status}",${score || 0},"${app.createdAt.toISOString()}"`;
      });
      const csvData = header + rows.join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="applications-export.csv"');
      res.status(200).send(csvData);
      return;
    }

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'ServerError',
      message: error.message || 'Failed to export applications.',
    });
  }
};
