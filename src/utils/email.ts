import chalk from 'chalk';
import { Request } from 'express';
import { Attachment } from 'nodemailer/lib/mailer';
import { env } from '~/configs';
import { getTransporter } from '~/configs/nodemailer.config';
import { AppError } from '~/errors';
import { logger } from '~/utils';

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
  req?: Request;
}

export async function sendEmail(props: SendMailProps) {
  const transporter = getTransporter();

  try {
    await transporter.sendMail({
      from: props.from || `RMS <${env.EMAIL_FROM}>`,
      ...props,
    });
  } catch (error) {
    logger.error({
      err: AppError.server('Failed to send email', error),
      requestId: props.req?.id,
      method: props.req?.method,
      url: props.req?.url,
    });
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
