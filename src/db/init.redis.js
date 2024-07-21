const { createClient } = require("redis");

// Create a Redis client
const redisClient = createClient({
  legacyMode: true,
  password: process.env.REDIS_PASS,
  socket: {
    host: process.env.REDIS_ENDPOINT,
    port: process.env.REDIS_PORT,
  },
});
redisClient.connect();

// Handle connection events
redisClient.on("connect", () => {
  console.log("Connected to Redis");
});

redisClient.on("error", (err) => {
  console.error("Error connecting to Redis:", err);
});

// Test the connection by sending a ping command
redisClient.ping((err, result) => {
  if (err) {
    console.error("Error pinging Redis:", err);
  } else {
    console.log("Ping result:", result); // Should print "PONG"
  }
});

module.exports = redisClient;
