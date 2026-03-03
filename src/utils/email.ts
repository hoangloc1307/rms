import { env } from '~/configs';
import { getTransporter } from '~/configs/nodemailer.config';
import { AppError } from '~/errors';

interface SendMail {
  from?: string;
  subject: string;
  data: Record<string, unknown>;
  email: string;
  html: string;
}

export async function sendEmail({ from, email, subject, html }: SendMail) {
  const transporter = getTransporter();

  try {
    await transporter.sendMail({
      from: from || `<${env.EMAIL_FROM}>`,
      to: email,
      subject,
      html,
    });
  } catch {
    throw AppError.server('Failed to send email');
  }
}
