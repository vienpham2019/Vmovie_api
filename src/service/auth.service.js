"use strict";
const byscrypt = require("bcrypt");

const {
  BadRequestError,
  ForbiddenError,
  IternalServerError,
  UnauthorizedError,
} = require("../core/error.response");
const { getUserByEmail } = require("../model/user/user.repo");
const { createTokenCode } = require("../util");
const UserService = require("./User.service");
const { createTokenPair } = require("../middleware/authUtil");
const {
  createKeyToken,
  deleteKeyTokenByUserId,
  updateRefreshToken,
} = require("../model/keyToken/keyToken.repo");

class AuthService {
  static async logIn({ email, password }) {
    const foundUser = await getUserByEmail({ email });
    if (!foundUser) {
      throw new BadRequestError("User not found");
    }

    // Check password in DB
    const matchPassword = byscrypt.compare(password, foundUser.password);
    if (!matchPassword) {
      throw new UnauthorizedError();
    }
    const accessTokenSecret = createTokenCode();
    const refeshTokenSecret = createTokenCode();

    const { accessToken, refreshToken } = await createTokenPair(
      {
        userId: foundUser._id,
      },
      accessTokenSecret,
      refeshTokenSecret
    );

    const keyStore = await createKeyToken({
      userId: foundUser._id,
      refeshTokenSecret,
      accessTokenSecret,
      refreshToken,
    });

    if (!keyStore) {
      throw IternalServerError();
    }

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

  static async handleRefreshToken({ user, keyStore, refreshToken }) {
    const { userId } = user;
    if (keyStore.refreshTokensUsed.includes(refreshToken)) {
      await deleteKeyTokenByUserId({ userId });
      throw new ForbiddenError("Something wrong happed! Please re-login");
    }

    // Create new refresh and access token
    const { accessToken, refreshToken } = await createTokenPair(
      { userId },
      keyStore.accessTokenSecret,
      keyStore.refeshTokenSecret
    );

    const updateRefreshToken = await updateRefreshToken({
      token: keyStore,
      newRefreshToken: refreshToken,
    });

    if (!updateRefreshToken) {
      throw IternalServerError();
    }

    return { accessToken, refreshToken };
  }

  static async logOut({ user }) {
    const deleteToken = await deleteKeyTokenByUserId({ userId: user.userId });
    if (!deleteToken) {
      throw IternalServerError();
    }
    return deleteToken;
  }
}
module.exports = AuthService;
