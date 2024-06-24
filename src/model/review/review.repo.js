"use strict";

const { InternalServerError } = require("../../core/error.response");
const { getSkip } = require("../../util");
const reviewModel = require("./review.model");

// Get
const getAllReviews = async ({
  page,
  limit,
  sortBy,
  sortDir,
  query = {},
  search,
}) => {
  try {
    const totalReviews = await reviewModel.countDocuments();

    const results = await reviewModel.aggregate([
      {
        $match: { ...query },
      },
      {
        $lookup: {
          from: "Movies", // Name of the movie collection
          localField: "movieId",
          foreignField: "_id",
          as: "movieDetails",
        },
      },
      {
        $unwind: "$movieDetails",
      },
      {
        $match: search,
      },
      {
        $sort: { [sortBy]: +sortDir },
      },
      {
        $project: {
          _id: 1,
          type: 1,
          reviewContent: 1,
          createdAt: 1,
          updatedAt: 1,
          rating: 1,
          authorName: 1,
          authorCop: 1,
          fullReviewLink: 1,
          "movieDetails.title": 1,
          "movieDetails.runtime": 1,
          "movieDetails.poster.url": 1,
          "movieDetails._id": 1,
          "movieDetails.isPublished": 1,
        },
      },
      {
        $skip: getSkip({ page, limit }),
      },
      {
        $limit: +limit,
      },
    ]);

    return {
      totalReviews,
      reviews: results,
    };
  } catch (error) {
    throw new InternalServerError(error);
  }
};
// Create
const createReview = async ({ payload }) => {
  try {
    return await reviewModel.create(payload);
  } catch (error) {
    console.log(error);
    throw new InternalServerError(error);
  }
};
// Update
// Delete

module.exports = {
  getAllReviews,
  createReview,
};
