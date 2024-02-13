"use strict";

const express = require("express");
const router = express.Router();
const { asyncHandler } = require("../helper/asyncHandler");
const { signUp, updateUserById } = require("../controller/user.controller");

router.post("/signup", asyncHandler(signUp));

router.patch("/update", asyncHandler(updateUserById));
module.exports = router;
