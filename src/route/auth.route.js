"use strict";
const express = require("express");
const router = express.Router();

const {
  logIn,
  signUp,
  refresh,
  logOut,
  forgotPassword,
  resetPassword,
} = require("../controller/auth.controller");

const { asyncHandler } = require("../helper/asyncHandler");
const {
  loginLimiter,
  registerLimiter,
  forgotPasswordLimiter,
  resendForgotPasswordLimiter,
} = require("../middleware/checkLimiter");
const { authentication } = require("../middleware/checkAuth");

router.post("/logIn", loginLimiter, asyncHandler(logIn));
router.post("/signUp", registerLimiter, asyncHandler(signUp));
router.post(
  "/forgotPassword",
  forgotPasswordLimiter,
  asyncHandler(forgotPassword)
);
router.post(
  "/resendForgotPassword",
  resendForgotPasswordLimiter,
  asyncHandler(forgotPassword)
);
router.post("/resetPassword", asyncHandler(resetPassword));
router.get("/refresh", asyncHandler(refresh));

// authentication
router.use(authentication);
router.get("/logOut", asyncHandler(logOut));

module.exports = router;
