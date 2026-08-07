import * as fs from "fs";
import csv = require("csv-parser");

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

  private isValidEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  private extractEmailFromRow(row: Record<string, string>): string | undefined {
    for (const [key, value] of Object.entries(row)) {
      const trimmedKey = key.trim().toLowerCase();
      const trimmedValue = value?.trim() ?? "";

      if (!trimmedValue) {
        continue;
      }

      if (
        EMAIL_KEYS.includes(trimmedKey) ||
        trimmedKey.includes("email") ||
        trimmedKey.includes("recipient") ||
        trimmedKey.includes("address") ||
        trimmedKey === "to"
      ) {
        if (this.isValidEmail(trimmedValue)) {
          return trimmedValue;
        }
      }
    }

    const values = Object.values(row).map((value) => value?.trim() ?? "");
    for (const value of values) {
      if (this.isValidEmail(value)) {
        return value;
      }
    }

    return undefined;
  }

  async parseCSV(filePath: string): Promise<string[]> {

    return new Promise((resolve, reject) => {

      const emails: string[] = [];

      fs.createReadStream(filePath)
        .pipe(csv())
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

export default new CsvService();