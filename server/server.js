//server/server.js
require("dotenv").config();
const express = require("express");
const redis = require("redis");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

const client = redis.createClient({
  url: redisUrl,
});

client.on("error", (err) => console.log("Redis Client Error", err));

(async () => {
  await client.connect();
  console.log("✅ Redis client connected");
})();

// API Routes

app.get("/", (req, res) => {
  res.send("Secret Vault API is Runnig! 🚀");
});

app.post("/api/secret", async (req, res) => {
  try {
    const { cipherText, ttl } = req.body;
    const id = Math.random().toString(36).slice(2, 12);
    const timeToLive = ttl || 3600;

    await client.set(id, cipherText, {
      EX: timeToLive,
      NX: true,
    });

    console.log(`Secret saved with ID: ${id}`);
    res.json({ id, expires_in: timeToLive });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save secret" });
  }
});

app.get("/api/secret/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const secret = await client.get(id);
    if (!secret) {
      return res
        .status(404)
        .json({ error: "Message not found or has expired!!!" });
    }
    await client.del(id);
    res.json({ cipherText: secret });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve secret" });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🔥 Server is running on port ${PORT}`);
});
