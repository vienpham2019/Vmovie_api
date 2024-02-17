"use strict";
const express = require("express");
const router = express.Router();

const { logIn, signUp } = require("../controller/auth.controller");
const { asyncHandler } = require("../helper/asyncHandler");

router.post("/logIn", asyncHandler(logIn));
router.post("/signUp", asyncHandler(signUp));
module.exports = router;
