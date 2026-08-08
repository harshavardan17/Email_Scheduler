import { Request, Response } from "express";
import emailService from "../services/email.service";
import { parseScheduledDateValue } from "../utils/date";

function normalizeDateInput(value: unknown): string {
  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value !== "string" || !value.trim()) {
    return "";
  }

  try {
    return parseScheduledDateValue(value).toISOString();
  } catch {
    return "";
  }
}

class EmailController {
  async schedule(req: Request, res: Response) {
    try {
      const body = req.body;
      const normalizedBody = {
        recipients: Array.isArray(body?.recipients) ? body.recipients : [],
        subject: body?.subject ?? "",
        body: body?.body ?? "",
        startTime: normalizeDateInput(body?.startTime ?? body?.scheduledTime),
        delayBetweenEmails: Number(body?.delayBetweenEmails ?? body?.delayBetween ?? 0),
        hourlyLimit: Number(body?.hourlyLimit ?? body?.limit ?? 100),
      };

      if (Array.isArray(normalizedBody.recipients) && normalizedBody.recipients.length > 0) {
        const result = await emailService.schedule(normalizedBody);

        if (!result.jobs.length) {
          return res.status(400).json({
            success: false,
            scheduled: 0,
            failed: result.failures.length,
            errors: result.failures,
          });
        }

        return res.status(201).json({
          success: true,
          scheduled: result.scheduledCount,
          failed: result.failures.length,
          errors: result.failures,
          partial: result.failures.length > 0,
          count: result.scheduledCount,
          data: result.jobs,
        });
      }

      const normalizedSingleBody = {
        ...body,
        recipient: body?.recipient ?? "",
        subject: body?.subject ?? "",
        body: body?.body ?? "",
        scheduledTime: normalizeDateInput(body?.scheduledTime ?? body?.startTime),
      };

      const email = await emailService.scheduleSingle(normalizedSingleBody);

      return res.status(201).json({
        success: true,
        data: email,
      });

    } catch (error: any) {

      return res.status(500).json({
        success: false,
        message: error.message,
      });

    }
  }

  async scheduled(req: Request, res: Response) {

    const emails = await emailService.getScheduledEmails();

    return res.json({
      success: true,
      count: emails.length,
      data: emails,
    });

  }

  async sent(req: Request, res: Response) {

    const emails = await emailService.getSentEmails();

    return res.json({
      success: true,
      count: emails.length,
      data: emails,
    });

  }

  async getById(req: Request<{ id: string }>, res: Response) {

    const email = await emailService.getById(req.params.id);

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

  async destroyAllEmails(req: Request, res: Response) {
    try {
      const result = await emailService.destroyAllEmails();

      return res.json(result);
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Unable to destroy data",
      });
    }
  }

  async deleteScheduledEmail(req: Request<{ id: string }>, res: Response) {
    try {
      const result = await emailService.deleteScheduledEmail(req.params.id);

      return res.json(result);
    } catch (error: any) {
      return res.status(404).json({
        success: false,
        message: error.message || "Email not found",
      });
    }
  }
}

export default new EmailController();