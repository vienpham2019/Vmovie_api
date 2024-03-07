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
}

module.exports = new ImageController();
