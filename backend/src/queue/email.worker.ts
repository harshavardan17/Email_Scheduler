import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});

import { Worker } from "bullmq";
import redis from "../config/redis";
import prisma from "../config/db";
import mailService from "../services/mail.service";
import { canSendEmail } from "../utils/rateLimiter";
import { emailQueue } from "./email.queue";

const queueName = process.env.QUEUE_NAME || "email-queue";

const isTransientSendError = (error: unknown): boolean => {
  const message = String(
    error && typeof error === "object" && "message" in error && typeof (error as { message?: unknown }).message === "string"
      ? (error as { message: string }).message
      : error || ""
  );

  return /(timeout|timed out|ECONNRESET|ECONNREFUSED|ETIMEDOUT|socket hang up|temporarily unavailable|connection closed|econn|network|try again|rate limit|service unavailable)/i.test(message);
};

const worker = new Worker(
  queueName,
  async (job) => {
    console.log("📥 Worker received job:", job.id, job.name, job.data);

    const { emailId } = job.data;

    const email = await prisma.emailJob.findUnique({
      where: {
        id: emailId,
      },
    });

    if (!email) {
      console.warn("⚠️ Email not found for job:", job.id);
      return;
    }

    if (email.status === "SENT") {
      console.log("ℹ️ Email already sent, skipping job:", email.id);
      return;
    }

    if (email.status === "PROCESSING") {
      console.log("ℹ️ Email already processing, skipping duplicate job:", email.id);
      return;
    }

    const allowed = await canSendEmail(email.hourlyLimit);

    if (!allowed) {
      console.log("⏳ Hourly limit reached. Rescheduling:", email.recipient);

      await prisma.emailJob.update({
        where: { id: email.id },
        data: {
          status: "PENDING",
          error: null,
          scheduledTime: new Date(Date.now() + 60 * 60 * 1000),
        },
      });

      await emailQueue.add(
        "send-email",
        { emailId: email.id },
        {
          delay: 60 * 60 * 1000,
        }
      );

      return;
    }

    await prisma.emailJob.update({
      where: { id: email.id },
      data: { status: "PROCESSING" },
    });

    console.log("🔄 Processing email:", email.id, email.recipient);

    try {
      await mailService.sendMail(email.recipient, email.subject, email.body);

      await prisma.emailJob.update({
        where: { id: email.id },
        data: { status: "SENT", sentAt: new Date() },
      });

      if (job.id) {
        try {
          await emailQueue.remove(job.id.toString());
        } catch (cleanupError) {
          console.warn("⚠️ Failed to cleanup queue job:", cleanupError);
        }
      }

      console.log("✅ Email Sent:", email.recipient, "job:", job.id);
    } catch (error: any) {
      const message = String(error?.message || error || "");
      console.error("❌ Email sending failed:", message);

      if (isTransientSendError(error)) {
        console.warn("⏳ Temporary send error. Requeueing email:", email.id);

        await prisma.emailJob.update({
          where: { id: email.id },
          data: {
            status: "PENDING",
            error: message,
            scheduledTime: new Date(Date.now() + 30_000),
          },
        });

        await emailQueue.add(
          "send-email",
          { emailId: email.id },
          {
            jobId: `${email.id}-retry`,
            delay: 30_000,
          }
        );

        return;
      }

      await prisma.emailJob.update({
        where: { id: email.id },
        data: {
          status: "FAILED",
          error: message,
        },
      });

      throw error;
    }
  },
  {
    connection: redis,
    concurrency: Number(process.env.WORKER_CONCURRENCY) || 1,
  }
);

worker.on("completed", (job) => {
  console.log("✅ Worker completed job:", job.id);
});

worker.on("active", (job) => {
  console.log("▶️ Worker active job:", job.id);
});

worker.on("failed", (job, err) => {
  console.error("❌ Worker failed job:", job?.id, err?.message || err);
});

worker.on("error", (error) => {
  console.error("❌ Worker error:", error);
});

console.log("📨 Email Worker Started");