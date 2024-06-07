"use strict";
const express = require("express");
const router = express.Router();

const { authentication, checkUserRole } = require("../middleware/checkAuth");
const { UserRoleEnum } = require("../model/user/user.enum");
const {
  getAllTypes,
  createProduct,
  getAllProductByAdmin,
  getProductDetails,
  updateProduct,
  deleteProductById,
} = require("../controller/product.controller");
const { asyncHandler } = require("../helper/asyncHandler");

router.get("/allTypes", asyncHandler(getAllTypes));
router.get("/details/:_id", asyncHandler(getProductDetails));

router.use(authentication);
router.use(checkUserRole([UserRoleEnum.ADMIN]));
router.patch("/edit/:_id", asyncHandler(updateProduct));
router.get("/allProductByAdmin", asyncHandler(getAllProductByAdmin));
router.post("/new", asyncHandler(createProduct));
router.delete("/:_id", asyncHandler(deleteProductById));

module.exports = router;
