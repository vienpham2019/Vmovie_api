"use strict";

const express = require("express");
const { asyncHandler } = require("../helper/asyncHandler");
const { uploadImage } = require("../controller/image.controller");
const router = express.Router();
const fileUpload = require("express-fileupload");
const fileExtLimiter = require("../middleware/fileExtLimiter");
const filesPayloadExists = require("../middleware/filesPayloadExists");
const fileSizeLimiter = require("../middleware/fileSizeLimiter");

router.post(
  "/upload",
  fileUpload({ createParentPath: true }),
  filesPayloadExists,
  fileExtLimiter([".png", ".jpg", ".jpeg"]),
  fileSizeLimiter,
  asyncHandler(uploadImage)
);
module.exports = router;
