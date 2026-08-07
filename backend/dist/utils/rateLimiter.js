"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.canSendEmail = canSendEmail;
const redis_1 = __importDefault(require("../config/redis"));
async function canSendEmail(hourlyLimit) {
    const now = new Date();
    const hourKey = `${now.getFullYear()}-` +
        `${now.getMonth() + 1}-` +
        `${now.getDate()}-` +
        `${now.getHours()}`;
    const key = `email-limit:${hourKey}`;
    const current = await redis_1.default.incr(key);
    if (current === 1) {
        await redis_1.default.expire(key, 3600);
    }
    return current <= hourlyLimit;
}
