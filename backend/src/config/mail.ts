import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});

import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Verify SMTP connection when the server starts
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ SMTP Connection Failed:");
    console.error(error);
  } else {
    console.log("✅ SMTP Server Ready");
  }
});