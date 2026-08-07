import { z } from "zod";

export const scheduleEmailSchema = z.object({
  recipient: z.string().email(),
  subject: z.string().min(1),
  body: z.string().min(1),
  scheduledTime: z.string().min(1),
});

export const scheduleBulkEmailSchema = z.object({
  recipients: z.array(z.string().email()).min(1),
  subject: z.string().min(1),
  body: z.string().min(1),
  startTime: z.string().min(1),
  delayBetweenEmails: z.number().int().nonnegative(),
  hourlyLimit: z.number().int().positive(),
});

export type ScheduleEmailDto = z.infer<typeof scheduleEmailSchema>;
export type ScheduleBulkEmailDto = z.infer<typeof scheduleBulkEmailSchema>;
