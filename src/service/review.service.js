"use strict";

const {
  InternalServerError,
  BadRequestError,
} = require("../core/error.response");
const { getMovieById } = require("../model/movie/movie.repo");
const { createReview, getAllReviews } = require("../model/review/review.repo");
const { convertToObjectIdMongoDB } = require("../util");

class ReviewService {
  // Get
  static async getAllReviews({
    limit = 20,
    page = 1,
    sortBy = "updatedAt",
    search = "",
    sortDir = 1,
  }) {
    try {
      const regex = new RegExp(search, "i"); // "i" flag for case-insensitive matching

      const searchQuery = {
        "movieDetails.title": { $regex: regex },
      };

      if (sortBy === "movieDetails") {
        sortBy = "movieDetails.title";
      }

      return await getAllReviews({
        page,
        limit,
        sortBy,
        sortDir,
        search: searchQuery,
      });
    } catch (error) {
      throw new InternalServerError(error);
    }
  }
  // Create
  static async createReview(payload) {
    try {
      const foundMovie = await getMovieById({
        movieId: convertToObjectIdMongoDB(payload.movieId),
      });
      if (!foundMovie) {
        throw new BadRequestError("movie not found");
      }
      payload.movieId = foundMovie._id;
      return await createReview({ payload });
    } catch (error) {
      throw new InternalServerError(error);
    }
  }
  // Update

  // Delete
}

module.exports = ReviewService;
