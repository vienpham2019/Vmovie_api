"use strict";

const { OK } = require("../core/success.response");
const TheaterService = require("../service/theater.service");

class TheaterController {
  // get
  getAllTheaterByAdmin = async (req, res, next) => {
    new OK({
      message: "Get theater successfully!",
      metadata: await TheaterService.getAllTheaterByAdmin(req.query),
    }).send(res);
  };
  // create
  createTheater = async (req, res, next) => {
    new OK({
      message: "Create Theater Success!",
      metadata: await TheaterService.createTheater(req.body),
    }).send(res);
  };
  // update
  // delete
}

module.exports = new TheaterController();
