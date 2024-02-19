"use strict";
const express = require("express");
const router = express.Router();

const {
  logIn,
  signUp,
  refresh,
  logOut,
} = require("../controller/auth.controller");
const { asyncHandler } = require("../helper/asyncHandler");
const { loginLimiter, registerLimiter } = require("../middleware/checkLimiter");
const { authentication } = require("../middleware/checkAuth");

router.post("/logIn", loginLimiter, asyncHandler(logIn));
router.post("/signUp", registerLimiter, asyncHandler(signUp));

// authentication
router.use(authentication);

router.post("/refresh", asyncHandler(refresh));
router.post("/logOut", asyncHandler(logOut));

module.exports = router;
