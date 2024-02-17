"use strict";
const byscrypt = require("bcrypt");

const {
  ConflictRequestError,
  BadRequestError,
} = require("../core/error.response");
const {
  getUserByEmail,
  createUser,
  getUserById,
  updateUserById,
  deleteUserById,
} = require("../model/user/user.repo");

class UserService {
  // Get
  // Create
  static async createUser({ name, email, password }) {
    const existsEmail = await getUserByEmail({ email });

    if (existsEmail) {
      throw new ConflictRequestError("Email already registered!");
    }
    password = await byscrypt.hash(password, 10);

    const newUser = await createUser({
      payload: {
        name,
        email,
        password,
      },
    });

    if (!newUser) {
      throw new BadRequestError(`Invalid user data received`);
    }
    return newUser;
  }
  // Update
  static async updateUserById({ _id, name, email, password }) {
    const foundUser = await getUserById({ _id });
    if (!foundUser) {
      throw new BadRequestError("User not found");
    }
    const foundDuplicateEmail = await getUserByEmail({ email });
    if (foundDuplicateEmail && foundDuplicateEmail?._id.toString() !== _id) {
      throw new ConflictRequestError("Email already registered!");
    }

    if (password) {
      password = await byscrypt.hash(password, 10);
    }

    const payload = {
      name,
      email,
      password,
    };

    const updateUser = await updateUserById({ _id, payload });
    if (!updateUser) {
      throw new BadRequestError(`Invalid user data received`);
    }
    return updateUser;
  }
  // Delete
  static async deleteUserById({ userId }) {
    const deletedUser = await deleteUserById({ _id: userId });
    if (!deletedUser) {
      throw new BadRequestError(
        "No user found matching the deletion criteria."
      );
    }
    return deletedUser;
  }
}
module.exports = UserService;
