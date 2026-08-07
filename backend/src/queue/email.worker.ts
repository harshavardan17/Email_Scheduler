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

const worker = new Worker(
  "email-queue",
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

    const allowed = await canSendEmail(email.hourlyLimit);

    if (!allowed) {
      console.log("⏳ Hourly limit reached. Rescheduling:", email.recipient);

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

      console.log("✅ Email Sent:", email.recipient, "job:", job.id);
    } catch (error: any) {
      console.error("❌ Email sending failed:", error?.message || error);

      await prisma.emailJob.update({
        where: { id: email.id },
        data: {
          status: "FAILED",
          error: String(error?.message || error),
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

worker.on("failed", (job, err) => {
  console.error("❌ Worker failed job:", job?.id, err?.message || err);
});

worker.on("error", (error) => {
  console.error("❌ Worker error:", error);
});

console.log("📨 Email Worker Started");