"use strict";

const redisClient = require("../db/init.redis");
const { promisify } = require("util");

class RedisService {
  static async set(key, value) {
    const setAsync = promisify(redisClient.set).bind(redisClient);
    await setAsync(key, value);
  }

  static async get(key) {
    const getAsync = promisify(redisClient.get).bind(redisClient);
    return await getAsync(key);
  }
}

module.exports = RedisService;