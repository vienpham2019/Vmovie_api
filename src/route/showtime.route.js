"use strict";
const express = require("express");
const router = express.Router();

const { authentication, checkUserRole } = require("../middleware/checkAuth");

const { asyncHandler } = require("../helper/asyncHandler");
const { UserRoleEnum } = require("../model/user/user.enum");
const {
  getAllShowtimeTimeline,
  createShowtime,
  deleteShowtime,
} = require("../controller/showtime.controller");

router.use(authentication);
router.use(checkUserRole([UserRoleEnum.ADMIN]));
router.get("/timeline", asyncHandler(getAllShowtimeTimeline));
router.post("/new", asyncHandler(createShowtime));
router.delete("/:_id", asyncHandler(deleteShowtime));

module.exports = router;
