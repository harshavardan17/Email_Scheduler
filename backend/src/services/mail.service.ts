import nodemailer from "nodemailer";
import { transporter } from "../config/mail";

class MailService {
  async sendMail(to: string, subject: string, body: string) {
    try {
      const info = await transporter.sendMail({
        from: `"ReachInbox Scheduler" <${process.env.SMTP_USER}>`,
        to,
        subject,
        text: body,
        html: `<h2>${subject}</h2><p>${body}</p>`,
      });

      console.log("✅ Email sent successfully!");
      console.log("📧 Message ID:", info.messageId);

      const previewUrl = nodemailer.getTestMessageUrl(info);

      if (previewUrl) {
        console.log("📬 Preview URL:", previewUrl);
      }

      return info;
    } catch (error) {
      console.error("❌ SMTP Send Error:", error);
      throw error;
    }
  }
}

export default new MailService();