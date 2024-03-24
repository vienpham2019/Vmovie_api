"use strict";
const userController = require("../controller/user.controller");
const {
  InternalServerError,
  BadRequestError,
} = require("../core/error.response");
const {
  updateMovieByUserId,
  getUncompletedMovie,
  createMovieByUserId,
  addMoviePhotos,
  removeMoviePhotos,
} = require("../model/movie/movie.repo");

class MovieService {
  static async getUncompletedMovie({ user }) {
    try {
      const { userId } = user;
      const unSelect = [
        "__v",
        "_id",
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
      throw InternalServerError(error);
    }
  }

  static async updateUncompletedMovie({ payload, user }) {
    delete payload["photos"];
    delete payload["poster"];
    delete payload["background"];
    for (const key in payload) {
      if (
        payload[key] === "" ||
        payload[key]?.length === 0 ||
        Object.keys(payload[key]).length === 0
      ) {
        console.log(payload);
        throw new BadRequestError("All fields are required.");
      }
    }
    const { userId } = user;
    payload["isCompleted"] = true;
    const movie = await updateMovieByUserId({ userId, payload });
    if (!movie) {
      throw new InternalServerError(`Can't update movie`);
    }
    return { message: "" };
  }

  static async handleAddMovieImage({ user, payload, field }) {
    if (field === "photos") {
      await addMoviePhotos({ userId: user.userId, photo: payload });
    } else {
      await updateMovieByUserId({
        userId: user.userId,
        payload: { [field]: payload },
      });
    }
  }

  static async handleRemoveMovieImage({ user, fileName, field }) {
    if (field === "photos") {
      await removeMoviePhotos({ userId: user.userId, fileName });
    } else {
      await updateMovieByUserId({
        userId: user.userId,
        payload: { [field]: {} },
      });
    }
  }
}

module.exports = MovieService;
