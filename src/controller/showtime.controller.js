"use strict";
const { OK } = require("../core/success.response");
const ShowtimeService = require("../service/showtime.service");

class ShowtimeController {
  getAllShowtime = async (req, res, next) => {
    new OK({
      message: "Get showtime successfully!",
      metadata: await ShowtimeService.getAllShowtime(req.query),
    }).send(res);
  };

  getShowtime = async (req, res, next) => {
    new OK({
      message: "Get showtime successfully!",
      metadata: await ShowtimeService.getShowtime(req.query),
    }).send(res);
  };

  getAllShowtimeDates = async (req, res, next) => {
    new OK({
      message: "Get showtime dates successfully!",
      metadata: await ShowtimeService.getAllShowtimeDates(),
    }).send(res);
  };

  getAllShowtimeByDate = async (req, res, next) => {
    new OK({
      message: "Get showtime by date successfully!",
      metadata: await ShowtimeService.getAllShowtimeByDate(req.params),
    }).send(res);
  };

  getAllShowtimeByMovieId = async (req, res, next) => {
    new OK({
      message: "Get showtime by movieId successfully!",
      metadata: await ShowtimeService.getAllShowtimeByMovieId(req.params),
    }).send(res);
  };

  getAllShowtimeByAdmin = async (req, res, next) => {
    new OK({
      message: "Get showtime successfully!",
      metadata: await ShowtimeService.getAllShowtimeByAdmin(req.query),
    }).send(res);
  };

  getShowtimeCountByMovieAndDate = async (req, res, next) => {
    new OK({
      message: "Get showtime day count successfully!",
      metadata: await ShowtimeService.getShowtimeCountByMovieAndDate(
        req.params
      ),
    }).send(res);
  };
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
