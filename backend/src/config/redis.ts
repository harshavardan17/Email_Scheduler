import IORedis from "ioredis";

const redis = new IORedis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  lazyConnect: false,
  connectTimeout: 10000,
  keepAlive: 30000,
  retryStrategy(times) {
    console.log(`🔄 Redis reconnect: ${times}`);
    return Math.min(times * 1000, 5000);
  },
});

redis.on("connect", () => {
  console.log("✅ Redis Connected");
});

redis.on("ready", () => {
  console.log("🚀 Redis Ready");
});

redis.on("reconnecting", () => {
  console.log("🔄 Redis Reconnecting...");
});

redis.on("end", () => {
  console.log("❌ Redis Connection Closed");
});

redis.on("error", (err) => {
  console.error("❌ Redis Error:", err);
});

export default redis;