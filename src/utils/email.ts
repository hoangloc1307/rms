import chalk from 'chalk';
import { Attachment } from 'nodemailer/lib/mailer';
import { env } from '~/configs';
import { getTransporter } from '~/configs/nodemailer.config';
import { AppError } from '~/errors';

interface SendMailProps {
  from?: string;
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  subject: string;
  html?: string;
  text?: string;
  replyTo?: string | string[];
  attachments?: Attachment[];
  priority?: 'high' | 'normal' | 'low';
}

export async function sendEmail(props: SendMailProps) {
  const transporter = getTransporter();

  try {
    await transporter.sendMail({
      from: props.from || `RMS <${env.EMAIL_FROM}>`,
      ...props,
    });
  } catch (error) {
    throw AppError.server('Failed to send email', error);
  }
}

export async function initMailer() {
  const transporter = getTransporter();

  try {
    await transporter.verify();
    console.log(chalk.green('✅ Mail server connected'));
  } catch (err) {
    console.warn(chalk.yellow('⚠️  Mail server unavailable, emails may fail'), err);
  }
}
