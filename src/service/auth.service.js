"use strict";
const bcrypt = require("bcrypt");
const {
  BadRequestError,
  ForbiddenError,
  IternalServerError,
  UnauthorizedError,
} = require("../core/error.response");
const { getUserByEmail } = require("../model/user/user.repo");
const { daysToSeconds } = require("../util");
const UserService = require("./User.service");
const { createTokenPair } = require("../middleware/authUtil");
const RedisService = require("./redis.service");

class AuthService {
  static async logIn({ email, password }) {
    const foundUser = await getUserByEmail({ email });
    if (!foundUser) {
      throw new UnauthorizedError("Invalid email or password");
    }
    const matchPassword = await bcrypt.compare(password, foundUser.password);
    if (!matchPassword) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const { accessToken, refreshToken } = await createTokenPair({
      userId: foundUser._id,
      roles: foundUser.roles,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  static async signUp(payload) {
    const newUser = await UserService.createUser(payload);
    if (!newUser) {
      throw new BadRequestError(`Can't registered`);
    }
    return newUser;
  }

  static async handleRefreshToken({ user, refreshToken }) {
    const { userId } = user;
    // add refresh token into blacklist
    await RedisService.set(refreshToken, userId, 60);

    return await createTokenPair(user);
  }
}
module.exports = AuthService;
