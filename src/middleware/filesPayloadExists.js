const { BadRequestError } = require("../core/error.response");
const { asyncHandler } = require("../helper/asyncHandler");

const filesPayloadExists = (req, res, next) => {
  if (!req.files) {
    throw new BadRequestError("Missing file");
  }
  next();
};

module.exports = filesPayloadExists;
