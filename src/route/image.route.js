"use strict";

const express = require("express");
const { asyncHandler } = require("../helper/asyncHandler");
const { uploadImage, deleteImage } = require("../controller/image.controller");
const router = express.Router();
const { authentication } = require("../middleware/checkAuth");

const Multer = require("multer");
const uploadMulter = Multer({
  storage: Multer.memoryStorage(),
}).single("imgFile");

router.use(authentication);
router.post("/upload", uploadMulter, asyncHandler(uploadImage));
router.delete("/:fileName", asyncHandler(deleteImage));
module.exports = router;
