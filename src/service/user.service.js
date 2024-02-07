"use strict";
const byscrypt = require("bcrypt");

const { BadRequestError, ForbiddenError } = require("../core/error.response");
const { getUserByEmail, createUser } = require("../model/user/user.repo");

class UserService {
  // Get
  // Create
  static async createUser({ name, email, password }) {
    const existsEmail = await getUserByEmail({ user_email: email });

    if (existsEmail) {
      throw new BadRequestError("Email already registered!");
    }
    const passwordHash = await byscrypt.hash(password, 10);

    const newUser = await createUser({
      payload: {
        user_name: name,
        user_email: email,
        user_password: passwordHash,
      },
    });

    if (!newUser) {
      throw new ForbiddenError(`Can't registered`);
    }
    return newUser;
  }
  // Update
  // Delete
}
module.exports = UserService;
