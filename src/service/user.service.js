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
const { validateEmail, validatePassword } = require("../util/validate");

class UserService {
  // Get
  // Create
  static async createUser({ name, email, password }) {
    validateEmail(email);
    validatePassword(password);
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
    return { message: "SignUp successful" };
  }
  // Update
  static async updateUserById({ _id, name, email, password }) {
    if (email) {
      validateEmail(email);
      const foundDuplicateEmail = await getUserByEmail({ email });
      if (foundDuplicateEmail && foundDuplicateEmail?._id.toString() !== _id) {
        throw new ConflictRequestError("Email already registered!");
      }
    }

    const foundUser = await getUserById({ _id });
    if (!foundUser) {
      throw new BadRequestError("User not found");
    }

    if (password) {
      validatePassword(password);
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
    return { message: "Update successful" };
  }
}

module.exports = UserService;
