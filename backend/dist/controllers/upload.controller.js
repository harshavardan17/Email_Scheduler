"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const csv_service_1 = __importDefault(require("../services/csv.service"));
class UploadController {
    async upload(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: "CSV file required",
                });
            }
            const recipients = await csv_service_1.default.parseCSV(req.file.path);
            return res.json({
                success: true,
                count: recipients.length,
                emails: recipients,
                message: `Loaded ${recipients.length} recipient(s) from the CSV.`,
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
}
exports.default = new UploadController();
