"use strict";
const bcrypt = require("bcrypt");
const { UnauthorizedError, NotFoundError } = require("../core/error.response");
const { getUserByEmail, getUserById } = require("../model/user/user.repo");
const { createTokenCode, minsToSeconds } = require("../util");

const { createTokenPair } = require("../middleware/authUtil");
const {
  deleteKeyTokenById,
  createOrUpdateKeyToken,
} = require("../model/keyToken/keyToken.repo");
const RedisService = require("./redis.service");
const EmailService = require("./email.service");
const UserService = require("./user.service");

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
        roles: foundUser.roles,
        username: foundUser.name,
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

  static async resetPassword({ token, password }) {
    const foundToken = await RedisService.get(`forgot_pass:${token}`);
    if (!foundToken) {
      throw new NotFoundError(
        "The reset password token is invalid, expired, or has already been used. Please request a new reset link."
      );
    }

    const foundUser = await getUserById({ _id: foundToken });
    await UserService.updateUserById({ _id: foundUser._id, password });
    await RedisService.delete(`forgot_pass:${token}`);

    return { message: "Your password has been changed successfully." };
  }

  static async forgotPassword({ email }) {
    const foundUser = await getUserByEmail({ email });
    if (!foundUser) {
      return { message: "Send Successful" };
    }

    const { _id } = foundUser;
    await RedisService.deleteAllKeysByValue("forgot_pass:*", _id.toString());
    const token = createTokenCode();
    await RedisService.set(
      `forgot_pass:${token}`,
      _id.toString(),
      minsToSeconds(15)
    );

    const resetPasswordLink = `${process.env.CLIENT_URL}/resetpassword/${token}`;
    await EmailService.sendEmailResetPassword({
      link: resetPasswordLink,
      toEmail: email,
    });
    // send to user
    return { message: "Send Successful" };
  }

  static async handleRefreshToken({ user }) {
    const { userId } = user;
    // add refresh token into blacklist
    const refreshTokenSecret = createTokenCode();
    const accessTokenSecret = createTokenCode();
    const foundUser = await getUserById({ _id: userId });
    const { accessToken, refreshToken } = await createTokenPair({
      payload: { userId, roles: foundUser.roles, username: foundUser.name },
      refreshTokenSecret,
      accessTokenSecret,
    });

    await createOrUpdateKeyToken({
      userId,
      refreshTokenSecret,
      accessTokenSecret,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  static async logOut({ userId }) {
    await deleteKeyTokenById(userId);
    return;
  }
}
module.exports = AuthService;
