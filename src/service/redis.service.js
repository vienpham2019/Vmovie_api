"use strict";

const redisClient = require("../db/init.redis");
const { promisify } = require("util");

class RedisService {
  static async set(key, value, ttlInSeconds) {
    const setAsync = promisify(redisClient.set).bind(redisClient);
    await setAsync(key, value, "EX", ttlInSeconds);
  }

  static async get(key) {
    const getAsync = promisify(redisClient.get).bind(redisClient);
    return await getAsync(key);
  }

  static async scanKeys(pattern, count = 1000) {
    const scanAsync = promisify(redisClient.scan).bind(redisClient);
    let cursor = "0";
    let keys = [];
    do {
      const [newCursor, newKeys] = await scanAsync(
        cursor,
        "MATCH",
        pattern,
        "COUNT",
        count // limit loop
      );
      cursor = newCursor;
      keys.push(...newKeys);
    } while (cursor !== "0");
    return keys;
  }

  static async deleteAllKeysByValue(pattern, value) {
    const keys = await RedisService.scanKeys(pattern);
    for (const key of keys) {
      const storedValue = await RedisService.get(key);
      if (storedValue === value) {
        await RedisService.delete(key);
      }
    }
  }

  static async delete(key) {
    const delAsync = promisify(redisClient.del).bind(redisClient);
    return await delAsync(key);
  }
}

module.exports = RedisService;
