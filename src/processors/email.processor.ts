import { Job } from 'bullmq';
import { mailService } from '~/services';
import { SendMailProps } from '~/services/mail.service';

export const emailProcessor = async (job: Job<SendMailProps>) => {
  await mailService.sendEmail(job.data);
};
