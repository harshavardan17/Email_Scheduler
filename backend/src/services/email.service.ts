import prisma from "../config/db";
import { emailQueue } from "../queue/email.queue";
import {
  ScheduleBulkEmailDto,
  ScheduleEmailDto,
} from "../validators/email.validator";

class EmailService {

  // ==========================
  // Single Email
  // ==========================
  async scheduleSingle(data: ScheduleEmailDto) {

    const email = await prisma.emailJob.create({
      data: {
        recipient: data.recipient,
        subject: data.subject,
        body: data.body,
        scheduledTime: new Date(data.scheduledTime),
        delayBetween: Number(process.env.DEFAULT_DELAY),
        hourlyLimit: Number(process.env.MAX_EMAILS_PER_HOUR),
      },
    });

    console.log("✅ Email Saved:", email.id);

    const delay = Math.max(
      new Date(data.scheduledTime).getTime() - Date.now(),
      0
    );

    console.log("⏱ Delay:", delay, "ms");

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

    console.log("✅ BullMQ Job Created:", job.id);

    const counts = await emailQueue.getJobCounts();
    console.log("📊 Queue counts after add:", counts);

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

    const baseStartTime = new Date(data.startTime);

    if (Number.isNaN(baseStartTime.getTime())) {
      throw new Error("Invalid startTime provided");
    }

    const jobs = [];
    const failures: { recipient: string; error: string; stack?: string }[] = [];

    for (let i = 0; i < data.recipients.length; i++) {
      const recipient = String(data.recipients[i] ?? "").trim();

      if (!recipient) {
        const failure = { recipient: String(data.recipients[i] ?? ""), error: "Empty recipient" };
        console.error("Failed scheduling: empty recipient", failure);
        failures.push(failure);
        continue;
      }

      const scheduledTime =
        baseStartTime.getTime() +
        i * Number(data.delayBetweenEmails) * 1000;

      let email;

      try {
        email = await prisma.emailJob.create({
          data: {
            recipient,
            subject: data.subject,
            body: data.body,
            scheduledTime: new Date(scheduledTime),
            delayBetween: Number(data.delayBetweenEmails),
            hourlyLimit: Number(data.hourlyLimit),
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