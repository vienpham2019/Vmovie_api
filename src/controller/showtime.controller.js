"use strict";
const { OK } = require("../core/success.response");
const ShowtimeService = require("../service/showtime.service");

class ShowtimeController {
  getAllShowtimeTimeline = async (req, res, next) => {
    new OK({
      message: "Get all showtime successfully!",
      metadata: await ShowtimeService.getAllShowtimeTimeline(req.query),
    }).send(res);
  };

  createShowtime = async (req, res, next) => {
    new OK({
      message: "Create all showtime successfully!",
      metadata: await ShowtimeService.createShowtime(req.body),
    }).send(res);
  };

  deleteShowtime = async (req, res, next) => {
    new OK({
      message: "Delete showtime successfully!",
      metadata: await ShowtimeService.deleteShowtime(req.params),
    }).send(res);
  };
}

module.exports = new ShowtimeController();
