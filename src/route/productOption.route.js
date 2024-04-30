"use strict";
const express = require("express");
const router = express.Router();

const { asyncHandler } = require("../helper/asyncHandler");
const { authentication, checkUserRole } = require("../middleware/checkAuth");
const { UserRoleEnum } = require("../model/user/user.enum");

const {
  getAllProductOptionTypes,
  createProductOption,
  createProductSubOption,
  getAllOptionsByType,
  updateProductOption,
  deleteProductOptionById,
  deleteAllProductOptionByType,
} = require("../controller/productOption.controller");

router.get("/types", asyncHandler(getAllProductOptionTypes));
router.get("/options/:type", asyncHandler(getAllOptionsByType));
router.use(authentication);
router.use(checkUserRole([UserRoleEnum.ADMIN]));

router.post("/createOption", asyncHandler(createProductOption));
router.patch("/updateOption", asyncHandler(updateProductOption));
router.post("/createSubOption", asyncHandler(createProductSubOption));

router.delete("/allType/:type", asyncHandler(deleteAllProductOptionByType));
router.delete("/:_id", asyncHandler(deleteProductOptionById));

module.exports = router;
