"use strict";

const express = require("express");
const router = express.Router();

const { authentication, checkUserRole } = require("../middleware/checkAuth");
const { asyncHandler } = require("../helper/asyncHandler");
const {
  createTheater,
  getAllTheaterByAdmin,
  updateTheater,
  deleteTheaterById,
  getTheaterDetails,
} = require("../controller/theater.controller");
const { UserRoleEnum } = require("../model/user/user.enum");

router.use(authentication);
router.use(checkUserRole([UserRoleEnum.ADMIN]));
router.get("/allTheaterByAdmin", asyncHandler(getAllTheaterByAdmin));
router.get("/details/:_id", asyncHandler(getTheaterDetails));
router.patch("/edit/:_id", asyncHandler(updateTheater));
router.post("/new", asyncHandler(createTheater));
router.delete("/:_id", asyncHandler(deleteTheaterById));
module.exports = router;
