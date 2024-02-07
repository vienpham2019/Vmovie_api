"use strict";

const express = require("express");
const router = express.Router();
const { asyncHandler } = require("../helper/asyncHandler");
const { signUp } = require("../controller/user.controller");

router.post("/signup", asyncHandler(signUp));
module.exports = router;
