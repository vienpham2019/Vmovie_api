"use strict";
const { OK } = require("../core/success.response");
const ReviewService = require("../service/review.service");

class ReviewController {
  getAllReviews = async (req, res, next) => {
    new OK({
      message: "Get all review successfully!",
      metadata: await ReviewService.getAllReviews(req.query),
    }).send(res);
  };

  getReviewDetails = async (req, res, next) => {
    new OK({
      message: "Get all review successfully!",
      metadata: await ReviewService.getReviewDetails(req.params),
    }).send(res);
  };

  createReview = async (req, res, next) => {
    new OK({
      message: "Create review successfully!",
      metadata: await ReviewService.createReview(req.body),
    }).send(res);
  };

  updateReview = async (req, res, next) => {
    new OK({
      message: "Update review successfully!",
      metadata: await ReviewService.updateReview({
        _id: req.params._id,
        payload: req.body,
      }),
    }).send(res);
  };

  deleteReview = async (req, res, next) => {
    new OK({
      message: "Delete review successfully!",
      metadata: await ReviewService.deleteReview(req.params),
    }).send(res);
  };
}

module.exports = new ReviewController();
