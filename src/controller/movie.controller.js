"use strict";

const { OK } = require("../core/success.response");
const MovieService = require("../service/movie.service");

class MovieController {
  getAllMovieByAdmin = async (req, res, next) => {
    new OK({
      message: "Get movie successfully!",
      metadata: await MovieService.getAllMovieByAdmin(req.query),
    }).send(res);
  };

  getAllPublicMovieByAdmin = async (req, res, next) => {
    new OK({
      message: "Get movie successfully!",
      metadata: await MovieService.getAllPublicMovieByAdmin(req.query),
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

  publishedMovie = async (req, res, next) => {
    new OK({
      message: "Published movie successfully!",
      metadata: await MovieService.publishedMovie(req.body),
    }).send(res);
  };

  draftMovie = async (req, res, next) => {
    new OK({
      message: "Draft movie successfully!",
      metadata: await MovieService.draftMovie(req.body),
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

  deleteMovieById = async (req, res, next) => {
    new OK({
      message: "Delete movie successfully!",
      metadata: await MovieService.deleteMovieById(req.params),
    }).send(res);
  };
}

module.exports = new MovieController();
