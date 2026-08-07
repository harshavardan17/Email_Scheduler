"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const EMAIL_KEYS = [
    "email",
    "e-mail",
    "emailaddress",
    "email_address",
    "recipient",
    "to",
    "address",
    "recipientemail",
    "rcpt",
];
class CsvService {
    isValidEmail(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }
    extractEmailFromRow(row) {
        for (const [key, value] of Object.entries(row)) {
            const trimmedKey = key.trim().toLowerCase();
            const trimmedValue = value?.trim() ?? "";
            if (!trimmedValue) {
                continue;
            }
            if (EMAIL_KEYS.includes(trimmedKey) ||
                trimmedKey.includes("email") ||
                trimmedKey.includes("recipient") ||
                trimmedKey.includes("address") ||
                trimmedKey === "to") {
                if (this.isValidEmail(trimmedValue)) {
                    return trimmedValue;
                }
            }
        }
        const values = Object.values(row).map((value) => value?.trim() ?? "");
        if (values.length === 1 && this.isValidEmail(values[0])) {
            return values[0];
        }
        return undefined;
    }
    async parseCSV(filePath) {
        return new Promise((resolve, reject) => {
            const emails = [];
            fs_1.default.createReadStream(filePath)
                .pipe((0, csv_parser_1.default)())
                .on("data", (row) => {
                const email = this.extractEmailFromRow(row);
                if (email) {
                    emails.push(email);
                }
            })
                .on("end", () => {
                resolve(emails);
            })
                .on("error", reject);
        });
    }
}
exports.default = new CsvService();
