"use strict";
const express = require("express");
const router = express.Router();

const { authentication, checkUserRole } = require("../middleware/checkAuth");
const { UserRoleEnum } = require("../model/user/user.enum");
const {
  getAllTypes,
  createProduct,
} = require("../controller/product.controller");
const { asyncHandler } = require("../helper/asyncHandler");

router.get("/allTypes", asyncHandler(getAllTypes));

router.use(authentication);
router.use(checkUserRole([UserRoleEnum.ADMIN]));

router.post("/new", asyncHandler(createProduct));

module.exports = router;
