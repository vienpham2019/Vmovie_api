"use strict";

const { OK, CREATED } = require("../core/success.response");
const AuthService = require("../service/auth.service");
const { daysToMilliseconds } = require("../util");

class AuthController {
  logIn = async (req, res, next) => {
    const { accessToken, refreshToken } = await AuthService.logIn(req.body);
    res.cookie("jwt", refreshToken, {
      httpOnly: true, // accessible only by web server
      secure: false, // https
      sameSite: "None", // cross-site cookie
      maxAge: daysToMilliseconds(7), // 7 days
    });
    new OK({
      message: "Login Success!",
      metadata: { accessToken },
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
