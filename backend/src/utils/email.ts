import nodemailer from 'nodemailer';
import { config } from '../config/env';

export const sendEmail = async (options: {
  to: string;
  subject: string;
  text: string;
  html?: string;
}): Promise<boolean> => {
  try {
    if (!config.smtp.user || !config.smtp.pass) {
      console.log(`[Email Mock Service] Simulated Email Dispatch:`);
      console.log(`  To: ${options.to}`);
      console.log(`  Subject: ${options.subject}`);
      console.log(`  Content: ${options.text}`);
      return true;
    }

    const transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      auth: {
        user: config.smtp.user,
        pass: config.smtp.pass,
      },
    });

    await transporter.sendMail({
      from: config.smtp.from,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });

    return true;
  } catch (error: any) {
    console.error(`[Email Error] Failed to send email to ${options.to}:`, error.message);
    return false;
  }
};
