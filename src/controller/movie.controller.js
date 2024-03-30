"use strict";

const { OK } = require("../core/success.response");
const MovieService = require("../service/movie.service");

class MovieController {
  getAllMovieByAdmin = async (req, res, next) => {
    new OK({
      message: "Get movie successfully!",
      metadata: await MovieService.getAllMovieByAdmin(req),
    }).send(res);
  };

  getMovieById = async (req, res, next) => {
    new OK({
      message: "Get movie successfully!",
      metadata: await MovieService.getMovieById(req.params),
    }).send(res);
  };

  getUncompletedMovie = async (req, res, next) => {
    new OK({
      message: "Get movie successfully!",
      metadata: await MovieService.getUncompletedMovie(req),
    }).send(res);
  };

  updateUncompletedMovie = async (req, res, next) => {
    new OK({
      message: "Upload movie successfully!",
      metadata: await MovieService.updateUncompletedMovie({
        payload: req.body,
        user: req.user,
      }),
    }).send(res);
  };
}

module.exports = new MovieController();
