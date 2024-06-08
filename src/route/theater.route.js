"use strict";

const express = require("express");
const router = express.Router();

const { authentication, checkUserRole } = require("../middleware/checkAuth");
const { asyncHandler } = require("../helper/asyncHandler");
const {
  createTheater,
  getAllTheaterByAdmin,
} = require("../controller/theater.controller");
const { UserRoleEnum } = require("../model/user/user.enum");

router.use(authentication);
router.use(checkUserRole([UserRoleEnum.ADMIN]));
router.get("/allTheaterByAdmin", asyncHandler(getAllTheaterByAdmin));
router.post("/new", asyncHandler(createTheater));

module.exports = router;
