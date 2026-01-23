import Redis from "ioredis";

const redis = new Redis({
    host: "127.0.0.1",
    port: 6379,
    maxRetriesPerRequest: null // BullMQ ke liye ye zaroori hai
});

redis.on("error", (err) => console.log("❌ Redis Error:", err));
redis.on("connect", () => console.log("🚀 Redis Connected Successfully!"));

export default redis;