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
  getAllShowtimeDates,
  getAllShowtimeByDate,
  getAllShowtimeByMovieId,
  getShowtime,
  checkout,
  getAllMoviesInShowtime,
} = require("../controller/showtime.controller");

router.get("/allDates", asyncHandler(getAllShowtimeDates));
router.get("/allMovies", asyncHandler(getAllMoviesInShowtime));
router.get("/all/:date", asyncHandler(getAllShowtimeByDate));
router.get("/allByMovie/:movieId", asyncHandler(getAllShowtimeByMovieId));
router.get("/byDateAndTime", asyncHandler(getShowtime));
router.patch("/checkout", asyncHandler(checkout));
router.use(authentication);
router.use(checkUserRole([UserRoleEnum.ADMIN]));
router.get("/all", asyncHandler(getAllShowtime));
router.get("/allByAdmin", asyncHandler(getAllShowtimeByAdmin));
router.get("/timeline", asyncHandler(getAllShowtimeTimeline));
router.get(
  "/countShowtimeDay/:movieId",
  asyncHandler(getShowtimeCountByMovieAndDate)
);
router.post("/new", asyncHandler(createShowtime));
router.delete("/:_id", asyncHandler(deleteShowtime));

module.exports = router;
