"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduleBulkEmailSchema = exports.scheduleEmailSchema = void 0;
const zod_1 = require("zod");
exports.scheduleEmailSchema = zod_1.z.object({
    recipient: zod_1.z.string().email(),
    subject: zod_1.z.string().min(1),
    body: zod_1.z.string().min(1),
    scheduledTime: zod_1.z.string().min(1),
});
exports.scheduleBulkEmailSchema = zod_1.z.object({
    recipients: zod_1.z.array(zod_1.z.string().email()).min(1),
    subject: zod_1.z.string().min(1),
    body: zod_1.z.string().min(1),
    startTime: zod_1.z.string().min(1),
    delayBetweenEmails: zod_1.z.number().int().nonnegative(),
    hourlyLimit: zod_1.z.number().int().positive(),
});
