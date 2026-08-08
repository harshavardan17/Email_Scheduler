import prisma from "../config/db";
import { emailQueue } from "../queue/email.queue";
import { parseScheduledDateValue } from "../utils/date";
import {
  ScheduleBulkEmailDto,
  ScheduleEmailDto,
} from "../validators/email.validator";

class EmailService {
  private isValidRecipientEmail(recipient: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient.trim());
  }

  private normalizeRecipient(recipient: string): string {
    return recipient.trim();
  }

  private parseScheduledDate(value: string): Date {
    return parseScheduledDateValue(value);
  }

  // ==========================
  // Single Email
  // ==========================
  async scheduleSingle(data: ScheduleEmailDto) {
    const scheduledDate = this.parseScheduledDate(String(data.scheduledTime ?? ""));
    const delay = Math.max(scheduledDate.getTime() - Date.now(), 0);

    const email = await prisma.emailJob.create({
      data: {
        recipient: data.recipient,
        subject: data.subject,
        body: data.body,
        scheduledTime: scheduledDate,
        delayBetween: Number(process.env.DEFAULT_DELAY) || 0,
        hourlyLimit: Number(process.env.MAX_EMAILS_PER_HOUR) || 100,
      },
    });

    const job = await emailQueue.add(
      "send-email",
      {
        emailId: email.id,
      },
      {
        jobId: email.id,
        delay,
      }
    );

    await prisma.emailJob.update({
      where: {
        id: email.id,
      },
      data: {
        bullJobId: String(job.id),
      },
    });

    return email;
  }

  // ==========================
  // Bulk Email (CSV)
  // ==========================
  async schedule(data: ScheduleBulkEmailDto) {
    if (!data.recipients?.length) {
      throw new Error("Recipients are required");
    }

    if (!data.subject?.trim() || !data.body?.trim()) {
      throw new Error("Subject and body are required");
    }

    const baseStartTime = this.parseScheduledDate(data.startTime);

    if (Number.isNaN(baseStartTime.getTime())) {
      throw new Error("Invalid startTime provided");
    }

    const jobs = [];
    const failures: { recipient: string; error: string; stack?: string }[] = [];

    for (let i = 0; i < data.recipients.length; i++) {
      const originalRecipient = String(data.recipients[i] ?? "");
      const recipient = this.normalizeRecipient(originalRecipient);

      if (!recipient) {
        const failure = { recipient: originalRecipient, error: "Empty recipient" };
        console.error("Failed scheduling: empty recipient", failure);
        failures.push(failure);
        continue;
      }

      if (!this.isValidRecipientEmail(recipient)) {
        const failure = { recipient, error: "Invalid recipient email format" };
        console.error("Failed scheduling: invalid recipient", failure);
        failures.push(failure);
        continue;
      }

      // Each subsequent recipient uses the same base instant and adds a fixed delay in seconds.
      const scheduledTime =
        baseStartTime.getTime() +
        i * Number(data.delayBetweenEmails || 0) * 1000;

      let email;

      try {
        email = await prisma.emailJob.create({
          data: {
            recipient,
            subject: data.subject,
            body: data.body,
            scheduledTime: new Date(scheduledTime),
            delayBetween: Number(data.delayBetweenEmails || 0),
            hourlyLimit: Number(data.hourlyLimit || 100),
          },
        });
      } catch (error: unknown) {
        const failure = {
          recipient,
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        };
        console.error("Failed scheduling: recipient create job", recipient, error);
        failures.push(failure);
        continue;
      }

      try {
        const job = await emailQueue.add(
          "send-email",
          {
            emailId: email.id,
          },
          {
            jobId: email.id,
            delay: Math.max(scheduledTime - Date.now(), 0),
          }
        );

        await prisma.emailJob.update({
          where: {
            id: email.id,
          },
          data: {
            bullJobId: String(job.id),
          },
        });

        jobs.push(email);
      } catch (error: unknown) {
        const failure = {
          recipient,
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        };
        console.error("Failed scheduling: recipient queue job", recipient, error);

        await prisma.emailJob.update({
          where: {
            id: email.id,
          },
          data: {
            status: "FAILED",
            error: failure.error,
          },
        });

        failures.push(failure);
      }
    }

    if (failures.length) {
      console.warn(
        `Bulk scheduling completed with ${failures.length} failures. Scheduled ${jobs.length}/${data.recipients.length} emails.`,
        failures
      );
    }

    return {
      jobs,
      failures,
      scheduledCount: jobs.length,
      totalCount: data.recipients.length,
    };
  }

  async getScheduledEmails() {
    return prisma.emailJob.findMany({
      where: {
        status: "PENDING",
      },
      orderBy: {
        scheduledTime: "asc",
      },
    });
  }

  async getSentEmails() {
    return prisma.emailJob.findMany({
      where: {
        status: "SENT",
      },
      orderBy: {
        sentAt: "desc",
      },
    });
  }

  async getById(id: string) {
    return prisma.emailJob.findUnique({
      where: {
        id,
      },
    });
  }

  async deleteScheduledEmail(id: string) {
    const email = await prisma.emailJob.findUnique({
      where: { id },
    });

    if (!email) {
      throw new Error("Email not found");
    }

    if (email.bullJobId) {
      try {
        await emailQueue.remove(email.bullJobId);
      } catch (error) {
        console.warn("Could not remove job from queue:", error);
      }
    }

    await prisma.emailJob.delete({
      where: { id },
    });

    return { success: true };
  }

  async destroyAllEmails() {
    try {
      await emailQueue.drain();
      await emailQueue.obliterate({ force: true });
    } catch (error) {
      console.warn("Could not clear queue jobs:", error);
    }

    await prisma.emailJob.deleteMany({});

    return { success: true, message: "All email data destroyed" };
  }
}

export default new EmailService();