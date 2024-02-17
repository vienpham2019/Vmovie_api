"use strict";

const { OK, CREATED } = require("../core/success.response");
const AuthService = require("../service/auth.service");

class AuthController {
  logIn = async (req, res, next) => {
    new OK({
      message: "Login Success!",
      metadata: await AuthService.logIn(req.body),
    }).send(res);
  };

  signUp = async (req, res, next) => {
    new CREATED({
      message: "Register Success!",
      metadata: await AuthService.signUp(req.body),
    }).send(res);
  };
}

module.exports = new AuthController();
