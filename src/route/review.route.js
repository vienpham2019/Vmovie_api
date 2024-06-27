"use strict";
const express = require("express");
const router = express.Router();

const { asyncHandler } = require("../helper/asyncHandler");
const { authentication, checkUserRole } = require("../middleware/checkAuth");
const { UserRoleEnum } = require("../model/user/user.enum");
const {
  createReview,
  getAllReviews,
  deleteReview,
  getReviewDetails,
  updateReview,
} = require("../controller/review.controller");

router.get("/details/:_id", asyncHandler(getReviewDetails));
router.use(authentication);
router.use(checkUserRole([UserRoleEnum.ADMIN]));
router.get("/all", asyncHandler(getAllReviews));
router.post("/new", asyncHandler(createReview));
router.patch("/update/:_id", asyncHandler(updateReview));
router.delete("/delete/:_id", asyncHandler(deleteReview));

module.exports = router;
