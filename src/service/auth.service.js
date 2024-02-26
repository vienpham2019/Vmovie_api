"use strict";
const bcrypt = require("bcrypt");
const {
  BadRequestError,
  ForbiddenError,
  IternalServerError,
  UnauthorizedError,
  NotFoundError,
} = require("../core/error.response");
const { getUserByEmail } = require("../model/user/user.repo");
const { createTokenCode, minsToSeconds } = require("../util");
const UserService = require("./User.service");
const { createTokenPair } = require("../middleware/authUtil");
const {
  deleteKeyTokenById,
  createOrUpdateKeyToken,
} = require("../model/keyToken/keyToken.repo");
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

    const refreshTokenSecret = createTokenCode();
    const accessTokenSecret = createTokenCode();

    const { accessToken, refreshToken } = await createTokenPair({
      payload: {
        userId: foundUser._id,
      },
      refreshTokenSecret,
      accessTokenSecret,
    });

    await createOrUpdateKeyToken({
      userId: foundUser._id,
      refreshTokenSecret,
      accessTokenSecret,
    });

    return {
      accessToken,
      refreshToken,
      userId: foundUser._id,
    };
  }

  static async signUp(payload) {
    const newUser = await UserService.createUser(payload);
    if (!newUser) {
      throw new InternalServerError(
        `Unable to complete signup process. Please try again`
      );
    }
    return { message: "Signup successful" };
  }

  static async checkResetPasswordToken({ token }) {
    const foundToken = await RedisService.get(token);
    if (!foundToken) {
      throw new NotFoundError(
        "The reset password token is invalid, expired, or has already been used. Please request a new reset link."
      );
    }

    return { message: "Valid reset password token" };
  }

  static async forgotPassword({ email, clientUrl }) {
    const foundUser = await getUserByEmail({ email });
    if (!foundUser) {
      throw new UnauthorizedError("Email was not found!");
    }

    const { _id } = foundUser;

    const token = createTokenCode();
    await RedisService.set(
      `forgot_pass:${token}`,
      _id.toString(),
      minsToSeconds(15)
    );
    // send to user

    return { message: "Send Successful" };
  }

  static async handleRefreshToken({ user }) {
    const { userId } = user;
    // add refresh token into blacklist
    const refreshTokenSecret = createTokenCode();
    const accessTokenSecret = createTokenCode();

    await createOrUpdateKeyToken({
      userId,
      refreshTokenSecret,
      accessTokenSecret,
    });

    return await createTokenPair({
      payload: user,
      accessTokenSecret,
      refreshTokenSecret,
    });
  }

  static async logOut({ userId }) {
    await deleteKeyTokenById(userId);
    return;
  }
}
module.exports = AuthService;
