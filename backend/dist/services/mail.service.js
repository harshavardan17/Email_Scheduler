"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const mail_1 = require("../config/mail");
class MailService {
    async sendMail(to, subject, body) {
        try {
            const info = await mail_1.transporter.sendMail({
                from: `"ReachInbox Scheduler" <${process.env.SMTP_USER}>`,
                to,
                subject,
                text: body,
                html: `<h2>${subject}</h2><p>${body}</p>`,
            });
            console.log("✅ Email sent successfully!");
            console.log("📧 Message ID:", info.messageId);
            const previewUrl = nodemailer_1.default.getTestMessageUrl(info);
            if (previewUrl) {
                console.log("📬 Preview URL:", previewUrl);
            }
            return info;
        }
        catch (error) {
            console.error("❌ SMTP Send Error:", error);
            throw error;
        }
    }
}
exports.default = new MailService();
