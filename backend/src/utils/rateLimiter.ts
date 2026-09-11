import { queueRedis as redis } from "../config/redis";

export async function canSendEmail(hourlyLimit: number): Promise<boolean> {
  const now = new Date();

  const hourKey =
    `${now.getFullYear()}-` +
    `${now.getMonth() + 1}-` +
    `${now.getDate()}-` +
    `${now.getHours()}`;

  const key = `email-limit:${hourKey}`;

  const current = await redis.incr(key);

  if (current === 1) {
    await redis.expire(key, 3600);
  }

  return current <= hourlyLimit;
}