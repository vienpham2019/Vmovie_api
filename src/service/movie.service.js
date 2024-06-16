"use strict";
const {
  InternalServerError,
  BadRequestError,
} = require("../core/error.response");
const cloudBucket = require("../db/init.googleCloud");
const {
  updateMovieByMovieId,
  getUncompletedMovie,
  createMovieByUserId,
  addMoviePhotos,
  removeMoviePhotos,
  getAllMovies,
  getMovieById,
  deleteMovieById,
} = require("../model/movie/movie.repo");

class MovieService {
  static async getAllMovieByAdmin({
    limit = 50,
    page = 1,
    sortBy = "updatedAt",
    filter = "All",
    search = "",
    sortDir = 1,
  }) {
    const regex = new RegExp(search, "i"); // "i" flag for case-insensitive matching
    const query = { title: { $regex: regex } };
    if (filter === "Draft") query["isDraft"] = true;
    else if (filter === "Published") query["isPublished"] = true;

    try {
      return await getAllMovies({
        query,
        page,
        limit,
        sortBy,
        sortDir,
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

  static async getAllPublicMovieByAdmin({
    limit = 50,
    page = 1,
    sortBy = "updatedAt",
    search = "",
    sortDir = 1,
  }) {
    const regex = new RegExp(search, "i"); // "i" flag for case-insensitive matching
    const query = { title: { $regex: regex } };
    query["isPublished"] = true;

    try {
      return await getAllMovies({
        query,
        page,
        limit,
        sortBy,
        sortDir,
        select: [
          "_id",
          "ratingScores",
          "isPublished",
          "updatedAt",
          "createdAt",
          "poster",
          "title",
          "runtime",
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

  static async publishedMovie({ movieId }) {
    try {
      const movie = await getMovieById({
        movieId,
        unSelect: [
          "_id",
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
      for (const key in movie) {
        if (movie.hasOwnProperty(key)) {
          if (
            movie[key] === "" ||
            movie[key]?.length === 0 ||
            Object.keys(movie[key]).length === 0
          ) {
            throw new BadRequestError(
              `Can't publish movie because some required fields are missing`
            );
          }
        }
      }
      return await updateMovieByMovieId({
        movieId,
        payload: { isPublished: true, isDraft: false },
      });
    } catch (error) {
      throw new InternalServerError(error);
    }
  }

  static async draftMovie({ movieId }) {
    try {
      await updateMovieByMovieId({
        movieId,
        payload: { isPublished: false, isDraft: true },
      });
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

  static async deleteMovieById({ movieId }) {
    try {
      const foundMovie = await getMovieById({ movieId });
      if (!foundMovie) {
        throw new BadRequestError("Movie not found");
      }
      const { photos, poster, thumbnail, isPublished } = foundMovie;
      if (isPublished) {
        throw new BadRequestError(
          `Cannot delete movie that is not unpublished`
        );
      }
      await Promise.all(
        [...photos, poster, thumbnail].map(
          async (photo) => await this.deleteImageIfNeeded(photo)
        )
      );

      await deleteMovieById({ movieId });
      return { message: "Delete movie Success" };
    } catch (error) {
      throw new InternalServerError(error);
    }
  }

  // Private function
  static deleteImageIfNeeded = async (image) => {
    if (
      !image.name ||
      !image?.url.startsWith("https://storage.googleapis.com/")
    )
      return;
    const file = cloudBucket.file(image.name);
    const [exists] = await file.exists();
    if (exists) await file.delete();
  };
}

module.exports = MovieService;
