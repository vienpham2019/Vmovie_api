const { createClient } = require("redis");

// Create a Redis client
const redisClient = createClient({
  legacyMode: true,
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
