"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({
    path: path_1.default.resolve(__dirname, "../../.env"),
});
const bullmq_1 = require("bullmq");
const redis_1 = __importDefault(require("../config/redis"));
const db_1 = __importDefault(require("../config/db"));
const mail_service_1 = __importDefault(require("../services/mail.service"));
const rateLimiter_1 = require("../utils/rateLimiter");
const email_queue_1 = require("./email.queue");
const worker = new bullmq_1.Worker("email-queue", async (job) => {
    console.log("📥 Worker received job:", job.id, job.name, job.data);
    const { emailId } = job.data;
    const email = await db_1.default.emailJob.findUnique({
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
    const allowed = await (0, rateLimiter_1.canSendEmail)(email.hourlyLimit);
    if (!allowed) {
        console.log("⏳ Hourly limit reached. Rescheduling:", email.recipient);
        await email_queue_1.emailQueue.add("send-email", { emailId: email.id }, {
            jobId: `${email.id}:retry:${Date.now()}`,
            delay: 60 * 60 * 1000,
        });
        return;
    }
    await db_1.default.emailJob.update({
        where: { id: email.id },
        data: { status: "PROCESSING" },
    });
    console.log("🔄 Processing email:", email.id, email.recipient);
    try {
        await mail_service_1.default.sendMail(email.recipient, email.subject, email.body);
        await db_1.default.emailJob.update({
            where: { id: email.id },
            data: { status: "SENT", sentAt: new Date() },
        });
        console.log("✅ Email Sent:", email.recipient, "job:", job.id);
    }
    catch (error) {
        console.error("❌ Email sending failed:", error?.message || error);
        await db_1.default.emailJob.update({
            where: { id: email.id },
            data: {
                status: "FAILED",
                error: String(error?.message || error),
            },
        });
        throw error;
    }
}, {
    connection: redis_1.default,
    concurrency: Number(process.env.WORKER_CONCURRENCY) || 1,
});
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
