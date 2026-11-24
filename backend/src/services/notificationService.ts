import nodemailer from 'nodemailer';
import { Notification } from '../models/Notification';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export class NotificationService {
  private static transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER || 'mock_hiregenius@ethereal.email',
      pass: process.env.SMTP_PASS || 'mock_password_2026',
    },
  });

  /**
   * Dispatch in-app notification to candidate or recruiter
   */
  public static async dispatchInAppNotification(
    recipientId: any,
    title: string,
    message: string,
    type: 'application_update' | 'assessment_invite' | 'interview_scheduled' | 'payment_success' | 'subscription_alert' | 'system' = 'system',
    linkUrl?: string
  ): Promise<any> {
    return await Notification.create({
      recipientId,
      title,
      message,
      type,
      linkUrl,
      isRead: false,
    });
  }

  /**
   * Send multi-channel email notification
   */
  public static async dispatchEmail(options: EmailOptions): Promise<{ success: boolean; messageId?: string }> {
    try {
      if (process.env.NODE_ENV === 'test' || !process.env.SMTP_HOST) {
        // Safe mock dispatch in test or local mode
        return {
          success: true,
          messageId: `mock-msg-${Date.now()}`,
        };
      }

      const info = await this.transporter.sendMail({
        from: process.env.EMAIL_FROM || '"HireGenius AI" <no-reply@hiregenius.ai>',
        to: options.to,
        subject: options.subject,
        html: options.html,
      });

      return { success: true, messageId: info.messageId };
    } catch {
      // Fallback safely so background email failures don't crash main request
      return { success: false };
    }
  }

  /**
   * Responsive HTML Email Templates
   */
  public static buildApplicationStatusEmail(candidateName: string, jobTitle: string, newStatus: string, companyName: string): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #4f46e5;">HireGenius AI — Application Status Update</h2>
        <p>Dear ${candidateName},</p>
        <p>Your application for <strong>${jobTitle}</strong> at <strong>${companyName}</strong> has been updated to:</p>
        <div style="background-color: #f8fafc; padding: 12px; border-left: 4px solid #4f46e5; margin: 16px 0; font-weight: bold; text-transform: uppercase;">
          ${newStatus}
        </div>
        <p>Log in to your dashboard to view feedback, schedule next steps, or review interview details.</p>
        <a href="http://localhost:5173/candidate/dashboard" style="display: inline-block; background-color: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; margin-top: 10px;">View Application Dashboard</a>
      </div>
    `;
  }

  public static buildInterviewInviteEmail(candidateName: string, jobTitle: string, meetingUrl: string, scheduledDate: string): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #059669;">🎉 Technical Interview Invitation</h2>
        <p>Dear ${candidateName},</p>
        <p>Congratulations! You have been invited to a technical interview for <strong>${jobTitle}</strong>.</p>
        <p><strong>Scheduled Time:</strong> ${scheduledDate}</p>
        <p>Please use the secure video meeting link below at the scheduled time:</p>
        <a href="${meetingUrl}" style="display: inline-block; background-color: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 16px 0;">Join Interview Room</a>
      </div>
    `;
  }
}
