import IORedis from "ioredis";

const redis = new IORedis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,
});

let logged = false;

redis.on("connect", () => {
  if (!logged) {
    console.log("✅ Redis Connected");
    logged = true;
  }
});

redis.on("error", (err) => {
  console.error("❌ Redis Error:", err);
});

export default redis;