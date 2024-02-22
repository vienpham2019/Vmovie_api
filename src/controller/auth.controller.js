"use strict";

const { OK, CREATED } = require("../core/success.response");
const AuthService = require("../service/auth.service");
const { daysToMilliseconds } = require("../util");

const setJwtCookie = (res, refreshToken) => {
  res.cookie("jwt", refreshToken, {
    httpOnly: true, // accessible only by web server
    secure: false, // https
    sameSite: "None", // cross-site cookie
    maxAge: daysToMilliseconds(7), // 7 days
  });
};

const clearJwtCookie = (res) => {
  res.clearCookie("jwt", { httpOnly: true, secure: false, sameSite: "None" });
};

class AuthController {
  logIn = async (req, res, next) => {
    const { accessToken, refreshToken } = await AuthService.logIn(req.body);
    setJwtCookie(res, refreshToken);
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

  refresh = async (req, res, next) => {
    clearJwtCookie(res);
    const { accessToken, refreshToken } = await AuthService.handleRefreshToken({
      user: req.user,
      refreshToken: req.refreshToken,
    });
    setJwtCookie(res, refreshToken);
    new OK({
      message: "Login Success!",
      metadata: { accessToken },
    }).send(res);
  };

  logOut = async (req, res, next) => {
    clearJwtCookie(res);
    new OK({
      message: "Login Success!",
      metadata: { message: "" },
    }).send(res);
  };
}

module.exports = new AuthController();
