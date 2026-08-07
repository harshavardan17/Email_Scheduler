"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../config/db"));
const email_queue_1 = require("../queue/email.queue");
class EmailService {
    // ==========================
    // Single Email
    // ==========================
    async scheduleSingle(data) {
        const email = await db_1.default.emailJob.create({
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
        const delay = Math.max(new Date(data.scheduledTime).getTime() - Date.now(), 0);
        console.log("⏱ Delay:", delay, "ms");
        const job = await email_queue_1.emailQueue.add("send-email", {
            emailId: email.id,
        }, {
            jobId: email.id,
            delay,
        });
        console.log("✅ BullMQ Job Created:", job.id);
        const counts = await email_queue_1.emailQueue.getJobCounts();
        console.log("📊 Queue counts after add:", counts);
        await db_1.default.emailJob.update({
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
    async schedule(data) {
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
        for (let i = 0; i < data.recipients.length; i++) {
            const recipient = data.recipients[i];
            const scheduledTime = baseStartTime.getTime() +
                i * Number(data.delayBetweenEmails) * 1000;
            const email = await db_1.default.emailJob.create({
                data: {
                    recipient,
                    subject: data.subject,
                    body: data.body,
                    scheduledTime: new Date(scheduledTime),
                    delayBetween: Number(data.delayBetweenEmails),
                    hourlyLimit: Number(data.hourlyLimit),
                },
            });
            const job = await email_queue_1.emailQueue.add("send-email", {
                emailId: email.id,
            }, {
                jobId: `${email.id}:${scheduledTime}`,
                delay: Math.max(scheduledTime - Date.now(), 0),
            });
            const counts = await email_queue_1.emailQueue.getJobCounts();
            console.log("📊 Queue counts after bulk add:", counts);
            await db_1.default.emailJob.update({
                where: {
                    id: email.id,
                },
                data: {
                    bullJobId: String(job.id),
                },
            });
            jobs.push(email);
        }
        return jobs;
    }
    async getScheduledEmails() {
        return db_1.default.emailJob.findMany({
            where: {
                status: "PENDING",
            },
            orderBy: {
                scheduledTime: "asc",
            },
        });
    }
    async getSentEmails() {
        return db_1.default.emailJob.findMany({
            where: {
                status: "SENT",
            },
            orderBy: {
                sentAt: "desc",
            },
        });
    }
    async getById(id) {
        return db_1.default.emailJob.findUnique({
            where: {
                id,
            },
        });
    }
    async deleteScheduledEmail(id) {
        const email = await db_1.default.emailJob.findUnique({
            where: { id },
        });
        if (!email) {
            throw new Error("Email not found");
        }
        if (email.bullJobId) {
            try {
                await email_queue_1.emailQueue.remove(email.bullJobId);
            }
            catch (error) {
                console.warn("Could not remove job from queue:", error);
            }
        }
        await db_1.default.emailJob.delete({
            where: { id },
        });
        return { success: true };
    }
}
exports.default = new EmailService();
