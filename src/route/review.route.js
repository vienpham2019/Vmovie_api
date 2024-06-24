"use strict";
const express = require("express");
const router = express.Router();

const { asyncHandler } = require("../helper/asyncHandler");
const { authentication, checkUserRole } = require("../middleware/checkAuth");
const { UserRoleEnum } = require("../model/user/user.enum");
const {
  createReview,
  getAllReviews,
} = require("../controller/review.controller");

router.use(authentication);
router.use(checkUserRole([UserRoleEnum.ADMIN]));
router.get("/all", asyncHandler(getAllReviews));
router.post("/new", asyncHandler(createReview));

module.exports = router;
