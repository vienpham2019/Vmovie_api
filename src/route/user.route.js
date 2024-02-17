"use strict";

const express = require("express");
const router = express.Router();
const { asyncHandler } = require("../helper/asyncHandler");
const { updateUserById } = require("../controller/user.controller");

router.patch("/update", asyncHandler(updateUserById));
module.exports = router;
