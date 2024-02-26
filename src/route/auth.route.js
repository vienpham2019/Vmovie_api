"use strict";
const express = require("express");
const router = express.Router();

const {
  logIn,
  signUp,
  refresh,
  logOut,
  forgotPassword,
  checkResetPasswordToken,
} = require("../controller/auth.controller");

const { asyncHandler } = require("../helper/asyncHandler");
const {
  loginLimiter,
  registerLimiter,
  forgotPasswordLimiter,
} = require("../middleware/checkLimiter");
const { authentication } = require("../middleware/checkAuth");

router.post("/logIn", loginLimiter, asyncHandler(logIn));
router.post("/signUp", registerLimiter, asyncHandler(signUp));
router.post("/forgotPassword", asyncHandler(forgotPassword));
router.post(
  "/resendForgotPassword",
  forgotPasswordLimiter,
  asyncHandler(forgotPassword)
);
router.post("/checkValidResetToken", asyncHandler(checkResetPasswordToken));

// authentication
router.use(authentication);

router.get("/refresh", asyncHandler(refresh));
router.get("/logOut", asyncHandler(logOut));

module.exports = router;
