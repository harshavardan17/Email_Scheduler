"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const email_service_1 = __importDefault(require("../services/email.service"));
class EmailController {
    async schedule(req, res) {
        try {
            const body = req.body;
            const normalizedBody = {
                recipients: Array.isArray(body?.recipients) ? body.recipients : [],
                subject: body?.subject ?? "",
                body: body?.body ?? "",
                startTime: body?.startTime ?? body?.scheduledTime ?? "",
                delayBetweenEmails: Number(body?.delayBetweenEmails ?? body?.delayBetween ?? 0),
                hourlyLimit: Number(body?.hourlyLimit ?? body?.limit ?? 100),
            };
            if (Array.isArray(normalizedBody.recipients) && normalizedBody.recipients.length > 0) {
                const emails = await email_service_1.default.schedule(normalizedBody);
                return res.status(201).json({
                    success: true,
                    count: emails.length,
                    data: emails,
                });
            }
            const email = await email_service_1.default.scheduleSingle(body);
            return res.status(201).json({
                success: true,
                data: email,
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
    async scheduled(req, res) {
        const emails = await email_service_1.default.getScheduledEmails();
        return res.json({
            success: true,
            count: emails.length,
            data: emails,
        });
    }
    async sent(req, res) {
        const emails = await email_service_1.default.getSentEmails();
        return res.json({
            success: true,
            count: emails.length,
            data: emails,
        });
    }
    async getById(req, res) {
        const email = await email_service_1.default.getById(req.params.id);
        if (!email) {
            return res.status(404).json({
                success: false,
                message: "Email not found",
            });
        }
        return res.json({
            success: true,
            data: email,
        });
    }
    async deleteScheduledEmail(req, res) {
        try {
            const result = await email_service_1.default.deleteScheduledEmail(req.params.id);
            return res.json(result);
        }
        catch (error) {
            return res.status(404).json({
                success: false,
                message: error.message || "Email not found",
            });
        }
    }
}
exports.default = new EmailController();
