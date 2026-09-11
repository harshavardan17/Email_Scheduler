import { Queue, Job } from "bullmq";
import { queueRedis } from "../config/redis";

const queueName = process.env.QUEUE_NAME || "email-queue";

export const emailQueue = new Queue(queueName, {
  connection: queueRedis,
  defaultJobOptions: {
    attempts: 3,
    removeOnComplete: 100,
    removeOnFail: 100,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
  },
});

emailQueue.on("error", (error: Error) => {
  console.error("❌ Email Queue error:", error);
});

emailQueue.on("waiting", (job: Job) => {
  console.log("⏳ Job waiting:", job.id, job.name);
});
