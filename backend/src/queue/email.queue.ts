import { Queue, Job } from "bullmq";
import redis from "../config/redis";

export const emailQueue = new Queue("email-queue", {
  connection: redis,
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
