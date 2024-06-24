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
  getShowtimeCountByMovieAndDate,
  getAllShowtime,
  getAllShowtimeByAdmin,
} = require("../controller/showtime.controller");

router.get("/all", asyncHandler(getAllShowtime));
router.use(authentication);
router.use(checkUserRole([UserRoleEnum.ADMIN]));
router.get("/allByAdmin", asyncHandler(getAllShowtimeByAdmin));
router.get("/timeline", asyncHandler(getAllShowtimeTimeline));
router.get(
  "/countShowtimeDay/:movieId",
  asyncHandler(getShowtimeCountByMovieAndDate)
);
router.post("/new", asyncHandler(createShowtime));
router.delete("/:_id", asyncHandler(deleteShowtime));

module.exports = router;
