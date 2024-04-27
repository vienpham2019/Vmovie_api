"use strict";

const express = require("express");
const router = express.Router();

router.use("/auth", require("./auth.route"));
router.use("/user", require("./user.route"));
router.use("/image", require("./image.route"));
router.use("/movie", require("./movie.route"));
router.use("/productOption", require("./productOption.route"));

module.exports = router;
