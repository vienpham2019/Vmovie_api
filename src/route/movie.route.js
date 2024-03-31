"use strict";

const express = require("express");
const router = express.Router();
const { asyncHandler } = require("../helper/asyncHandler");
const {
  updateUncompletedMovie,
  getUncompletedMovie,
  getAllMovieByAdmin,
  getMovieById,
  deleteMovieById,
} = require("../controller/movie.controller");
const { authentication, checkUserRole } = require("../middleware/checkAuth");
const { UserRoleEnum } = require("../model/user/user.enum");

router.get("/details/:movieId", asyncHandler(getMovieById));
router.use(authentication);
router.use(checkUserRole([UserRoleEnum.ADMIN]));
router.get("/allMovieByAdmin", asyncHandler(getAllMovieByAdmin));
router.get("/uncompletedMovie", asyncHandler(getUncompletedMovie));

router.patch("/uncompletedMovie", asyncHandler(updateUncompletedMovie));
router.delete("/:movieId", asyncHandler(deleteMovieById));

module.exports = router;
