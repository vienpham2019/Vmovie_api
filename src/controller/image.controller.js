"use strict";

const { OK } = require("../core/success.response");
const ImageService = require("../service/image.service");

class ImageController {
  uploadImage = async (req, res, next) => {
    new OK({
      message: "Image uploaded successfully!",
      metadata: await ImageService.createImage(req),
    }).send(res);
  };

  deleteImage = async (req, res, next) => {
    new OK({
      message: "Image delete successfully!",
      metadata: await ImageService.deleteImage(req.params),
    }).send(res);
  };
}

module.exports = new ImageController();
