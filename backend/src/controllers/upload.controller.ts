import { Request, Response } from "express";
import csvService from "../services/csv.service";

class UploadController {
  async upload(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "CSV file required",
        });
      }

      const recipients = await csvService.parseCSV(req.file.path);

      return res.json({
        success: true,
        count: recipients.length,
        emails: recipients,
        message: `Loaded ${recipients.length} recipient(s) from the CSV.`,
      });

    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new UploadController();