import IORedis from "ioredis";

const configuredRedisUrl = process.env.REDIS_URL;

if (!configuredRedisUrl) {
  throw new Error("REDIS_URL is required");
}

const redisUrl: string = configuredRedisUrl;

function createRedisConnection(name: string, maxRetriesPerRequest: number | null) {
  const connection = new IORedis(redisUrl, {
    maxRetriesPerRequest,
    connectTimeout: 10000,
    keepAlive: 30000,
    retryStrategy(times: number) {
      const delay = Math.min(times * 500, 5000);
      console.warn(`Redis ${name} reconnecting in ${delay}ms (attempt ${times})`);
      return delay;
    },
  });

  connection.on("connect", () => console.log(`Redis ${name} connected`));
  connection.on("ready", () => console.log(`Redis ${name} ready`));
  connection.on("reconnecting", () => console.warn(`Redis ${name} reconnecting`));
  connection.on("end", () => console.warn(`Redis ${name} connection closed`));
  connection.on("error", (error) => console.error(`Redis ${name} error`, error));

  return connection;
}

export const queueRedis = createRedisConnection("queue", 20);
export const workerRedis = createRedisConnection("worker", null);

export async function checkRedisHealth(): Promise<boolean> {
  try {
    return (await queueRedis.ping()) === "PONG";
  } catch (error) {
    console.error("Redis health check failed", error);
    return false;
  }
}