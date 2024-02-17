const { BadRequestError } = require("../core/error.response");

const emailRegex = /^\S+@\S+\.\S+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;

const validateEmail = (email) => {
  if (!emailRegex.test(email)) {
    throw new BadRequestError("Email is not in a valid format.");
  }
};

const validatePassword = (password) => {
  if (!passwordRegex.test(password)) {
    throw new BadRequestError("Password does not meet the requirements.");
  }
};

module.exports = { validateEmail, validatePassword };
