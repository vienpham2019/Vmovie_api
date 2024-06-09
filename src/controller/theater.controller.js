"use strict";

const { OK } = require("../core/success.response");
const TheaterService = require("../service/theater.service");

class TheaterController {
  // get
  getTheaterDetails = async (req, res, next) => {
    new OK({
      message: "Get product details successfully!",
      metadata: await TheaterService.getTheaterDetails(req.params),
    }).send(res);
  };
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
  updateTheater = async (req, res, next) => {
    new OK({
      message: "Update Theater successfully!",
      metadata: await TheaterService.updateTheater({
        payload: req.body,
        _id: req.params._id,
      }),
    }).send(res);
  };
  // delete
  deleteTheaterById = async (req, res, next) => {
    new OK({
      message: "Delete Theater successfully!",
      metadata: await TheaterService.deleteTheaterById({
        _id: req.params._id,
      }),
    }).send(res);
  };
}

module.exports = new TheaterController();
