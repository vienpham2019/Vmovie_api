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

  createReview = async (req, res, next) => {
    new OK({
      message: "Create review successfully!",
      metadata: await ReviewService.createReview(req.body),
    }).send(res);
  };
}

module.exports = new ReviewController();
