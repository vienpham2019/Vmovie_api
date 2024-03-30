"use strict";
const {
  InternalServerError,
  BadRequestError,
} = require("../core/error.response");
const {
  updateMovieByMovieId,
  getUncompletedMovie,
  createMovieByUserId,
  addMoviePhotos,
  removeMoviePhotos,
  getAllMovies,
  getMovieById,
} = require("../model/movie/movie.repo");

class MovieService {
  static async getAllMovieByAdmin({ limit = 50, page = 1 }) {
    try {
      return await getAllMovies({
        page,
        limit,
        select: [
          "_id",
          "ratingScores",
          "isPublished",
          "updatedAt",
          "createdAt",
          "poster",
          "title",
          "reviews",
        ],
      });
    } catch (error) {
      throw new InternalServerError(error);
    }
  }

  static async getMovieById({ movieId }) {
    try {
      return await getMovieById({
        movieId,
        unSelect: [
          "__v",
          "createBy",
          "createdAt",
          "updatedAt",
          "isCompleted",
          "isDraft",
          "isPublished",
          "ratingScores",
          "reviews",
        ],
      });
    } catch (error) {
      throw new InternalServerError(error);
    }
  }

  static async getUncompletedMovie({ user }) {
    try {
      const { userId } = user;

      const unSelect = [
        "__v",
        "createBy",
        "createdAt",
        "updatedAt",
        "isCompleted",
        "isDraft",
        "isPublished",
        "ratingScores",
        "reviews",
      ];
      let movie = await getUncompletedMovie({ userId, unSelect });

      if (!movie) {
        movie = await createMovieByUserId({ userId, unSelect });
      }
      return movie;
    } catch (error) {
      throw new InternalServerError(error);
    }
  }

  static async updateUncompletedMovie({ payload }) {
    delete payload["photos"];
    delete payload["poster"];
    delete payload["background"];
    const movieId = payload["_id"];
    delete payload["_id"];
    for (const key in payload) {
      if (
        payload[key] === "" ||
        payload[key]?.length === 0 ||
        Object.keys(payload[key]).length === 0
      ) {
        throw new BadRequestError("All fields are required.");
      }
    }
    payload["isCompleted"] = true;
    const movie = await updateMovieByMovieId({ movieId, payload });
    if (!movie) {
      throw new InternalServerError(`Can't update movie`);
    }
    return { message: "" };
  }

  static async handleAddMovieImage({ movieId, payload, field }) {
    if (field === "photos") {
      await addMoviePhotos({ movieId, photo: payload });
    } else {
      await updateMovieByMovieId({
        movieId,
        payload: { [field]: payload },
      });
    }
  }

  static async handleRemoveMovieImage({ movieId, fileName, field }) {
    try {
      if (field === "photos") {
        await removeMoviePhotos({ movieId, fileName });
      } else {
        await updateMovieByMovieId({
          movieId,
          payload: { [field]: {} },
        });
      }
    } catch (error) {
      throw new InternalServerError(error);
    }
  }
}

module.exports = MovieService;
