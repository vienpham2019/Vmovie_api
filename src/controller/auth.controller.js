"use strict";

const { UnauthorizedError } = require("../core/error.response");
const { OK, CREATED } = require("../core/success.response");
const AuthService = require("../service/auth.service");
const { daysToMilliseconds } = require("../util");

const setJwtCookie = (res, refreshToken) => {
  res.cookie("jwt", refreshToken, {
    httpOnly: true, // accessible only by web server
    secure: process.env.NODE_ENV === "production", // https
    sameSite: "Strict", // cross-site cookie
    maxAge: daysToMilliseconds(7), // 7 days
  });
};

console.log(process.env.NODE_ENV === "production");

const setUserIdCookie = (res, memberId) => {
  res.cookie("UserId", memberId, {
    httpOnly: true, // accessible only by web server
    secure: process.env.NODE_ENV === "production", // https
    sameSite: "Strict", // cross-site cookie
  });
};

const clearJwtCookie = (res) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });
};

const clearUserIdCookie = (res) => {
  res.clearCookie("UserId", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });
};

class AuthController {
  logIn = async (req, res, next) => {
    const { accessToken, refreshToken, userId } = await AuthService.logIn(
      req.body
    );
    setJwtCookie(res, refreshToken);
    setUserIdCookie(res, userId.toString());
    new OK({
      message: "Login Success!",
      metadata: { accessToken },
    }).send(res);
  };

  resetPassword = async (req, res, next) => {
    new OK({
      message: "Reset Password Valid",
      metadata: await AuthService.resetPassword(req.body),
    }).send(res);
  };

  forgotPassword = async (req, res, next) => {
    new OK({
      message: "Send Reset Password Success!",
      metadata: await AuthService.forgotPassword(req.body),
    }).send(res);
  };

  signUp = async (req, res, next) => {
    new CREATED({
      message: "Register Success!",
      metadata: await AuthService.signUp(req.body),
    }).send(res);
  };

  refresh = async (req, res, next) => {
    const { cookies } = req;
    const { jwt, UserId } = cookies;
    if (!jwt || !UserId) {
      throw new UnauthorizedError(
        "Your login session has expired. Please log in again to continue."
      );
    }

    const { accessToken, refreshToken } = await AuthService.handleRefreshToken({
      user: { userId: UserId },
      refreshToken: jwt,
    });
    setJwtCookie(res, refreshToken);
    new OK({
      message: "Refesh Token Success!",
      metadata: { accessToken },
    }).send(res);
  };

  logOut = async (req, res, next) => {
    clearJwtCookie(res);
    clearUserIdCookie(res);
    const { UserId } = req.cookies;
    new OK({
      message: "LogOut Success!",
      metadata: await AuthService.logOut({ userId: UserId }),
    }).send(res);
  };
}

module.exports = new AuthController();
