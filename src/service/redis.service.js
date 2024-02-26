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

  static async delete(key) {
    const delAsync = promisify(redisClient.del).bind(redisClient);
    return await delAsync(key);
  }
}

module.exports = RedisService;
