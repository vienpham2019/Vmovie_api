"use strict";
const byscrypt = require("bcrypt");

const {
  BadRequestError,
  AuthFailureError,
  ForbiddenError,
  IternalServerError,
} = require("../core/error.response");
const { getUserByEmail } = require("../model/user/user.repo");
const { createTokenCode } = require("../util");
const UserService = require("./User.service");
const { createTokenPair } = require("../middleware/authUtil");
const { createKeyToken } = require("../model/keyToken/keyToken.repo");

class AuthService {
  static async logIn({ email, password }) {
    const foundUser = await getUserByEmail({ email });
    if (!foundUser) {
      throw new BadRequestError("User not found");
    }

    // Check password in DB
    const matchPassword = byscrypt.compare(password, foundUser.password);
    if (!matchPassword) {
      throw new AuthFailureError("Authentication Error");
    }
    const accessTokenSecret = createTokenCode();
    const refeshTokenSecret = createTokenCode();

    const { accessToken, refreshToken } = await createTokenPair(
      {
        userId: foundUser._id,
        email,
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
}
module.exports = AuthService;
