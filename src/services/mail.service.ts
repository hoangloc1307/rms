import chalk from 'chalk';
import { Request } from 'express';
import { Attachment } from 'nodemailer/lib/mailer';
import { env, getTransporter } from '~/configs';
import { AppError } from '~/errors';
import { logger, renderTemplate } from '~/utils';

export interface SendMailProps {
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
  template?: string;
  data?: Record<string, unknown>;
  req?: Request;
}

async function sendEmail(props: SendMailProps) {
  const transporter = getTransporter();

  try {
    if (props.template) {
      const template = renderTemplate(props.template, props.data);
      props.html = template;
    }

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
    throw error;
  }
}

async function verifyConnection() {
  const transporter = getTransporter();

  try {
    await transporter.verify();
    console.log(chalk.green('✅ Mail server connected'));
  } catch (err) {
    console.warn(chalk.yellow('⚠️  Mail server unavailable, emails may fail'), err);
  }
}

export const mailService = {
  verifyConnection,
  sendEmail,
};
