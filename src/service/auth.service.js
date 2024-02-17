"use strict";
const byscrypt = require("bcrypt");

const { BadRequestError, AuthFailureError } = require("../core/error.response");
const { getUserByEmail } = require("../model/user/user.repo");
const { getInfoData } = require("../util");
const UserService = require("./User.service");

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

    return {
      user: getInfoData({
        fields: ["_id", "name", "email"],
        object: foundUser,
      }),
    };
  }

  static async signUp(payload) {
    return await UserService.createUser(payload);
  }
}
module.exports = AuthService;
