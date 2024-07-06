"use strict";

const {
  BadRequestError,
  InternalServerError,
} = require("../core/error.response");
const { getPublicMovieById } = require("../model/movie/movie.repo");
const {
  getAllShowTimeByQuery,
  createShowtime,
  getShowTimeById,
  deleteShowtime,
  getShowtimeCountByMovieAndDate,
  getAllShowtime,
  getAllShowtimeDates,
  getAllShowtimeByDate,
  getAllShowtimeByMovieId,
} = require("../model/showtime/showtime.repo");
const { findTheaterByName } = require("../model/theater/theater.repo");
const { isTimeBetween } = require("../util");

class ShowtimeService {
  // Get
  static async getAllShowtimeDates() {
    try {
      return await getAllShowtimeDates();
    } catch (error) {
      throw new InternalServerError(error);
    }
  }
  static async getAllShowtimeByDate({ date }) {
    try {
      return await getAllShowtimeByDate({ date: date.split("-").join("/") });
    } catch (error) {
      throw new InternalServerError(error);
    }
  }

  static async getAllShowtimeByMovieId({ movieId }) {
    try {
      return await getAllShowtimeByMovieId({ movieId });
    } catch (error) {
      throw new InternalServerError(error);
    }
  }

  static async getAllShowtimeByAdmin({
    limit = 20,
    page = 1,
    sortBy = "updatedAt",
    search = "",
    sortDir = 1,
  }) {
    const regex = new RegExp(search, "i"); // "i" flag for case-insensitive matching

    const searchQuery = {
      "movieDetails.title": { $regex: regex },
    };

    if (sortBy === "movieDetails") {
      sortBy = "movieDetails.title";
    } else if (sortBy === "theaterDetails") {
      sortBy = "theaterDetails.name";
    }

    try {
      return await getAllShowtime({
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

  static async getAllShowtime({
    limit = 20,
    page = 1,
    sortBy = "updatedAt",
    search = "",
    sortDir = 1,
  }) {
    const regex = new RegExp(search, "i"); // "i" flag for case-insensitive matching

    const searchQuery = {
      "movieDetails.title": { $regex: regex },
      "movieDetails.isPublished": true,
    };

    if (sortBy === "movieDetails") {
      sortBy = "movieDetails.title";
    } else if (sortBy === "theaterDetails") {
      sortBy = "theaterDetails.name";
    }

    try {
      return await getAllShowtime({
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

  static async getShowtimeCountByMovieAndDate({ movieId }) {
    try {
      return await getShowtimeCountByMovieAndDate(movieId);
    } catch (error) {
      throw new InternalServerError(error);
    }
  }
  static async getAllShowtimeTimeline({ theaterName, date }) {
    try {
      const foundTheater = await findTheaterByName(theaterName);
      if (!foundTheater) {
        throw new BadRequestError("Invalid Theater Name");
      }
      const showtimes = await getAllShowTimeByQuery({
        query: { theaterId: foundTheater._id, date },
        unSelect: ["updatedAt", "createdAt", "__v"],
      });

      return await Promise.all(
        showtimes.map(async (showtime) => {
          return {
            ...(await this.modifyData(showtime)),
          };
        })
      );
    } catch (error) {
      throw new InternalServerError(error);
    }
  }
  // Create
  static async createShowtime(payload) {
    try {
      if (!payload?.theaterName || !payload?.movieId) {
        throw new BadRequestError("Missing params");
      }
      const foundTheater = await findTheaterByName(payload.theaterName);
      if (!foundTheater) {
        throw new BadRequestError("Theater not found");
      }

      const foundMovie = await getPublicMovieById({
        movieId: payload.movieId,
        unSelect: ["updatedAt", "createdAt", "__v"],
      });
      if (!foundMovie) {
        throw new BadRequestError("Movie not found");
      }
      const showtimes = await getAllShowTimeByQuery({
        query: { theaterId: foundTheater._id, date: payload.date },
        unSelect: ["updatedAt", "createdAt", "__v"],
      });

      delete payload.theaterName;
      payload.theaterId = foundTheater._id;
      if (showtimes && showtimes.length > 0) {
        showtimes.forEach(({ startTime, endTime }) => {
          if (
            isTimeBetween({
              startTime: startTime,
              endTime: endTime,
              checkTime: payload.startTime,
            }) ||
            isTimeBetween({
              startTime: startTime,
              endTime: endTime,
              checkTime: payload.endTime,
            })
          ) {
            throw new BadRequestError(
              "Selected time overlaps with an existing showtime."
            );
          }
        });
      }

      const newShowtime = await createShowtime({
        payload,
        unSelect: ["updatedAt", "createdAt", "__v"],
      });
      const resShowtime = await getShowTimeById(newShowtime._id);
      return this.modifyData(resShowtime);
    } catch (error) {
      throw new InternalServerError(error);
    }
  }
  // Update
  // Delete
  static async deleteShowtime(_id) {
    try {
      if (!_id) {
        throw new BadRequestError("Invalid id");
      }
      return await deleteShowtime(_id);
    } catch (error) {
      throw new InternalServerError(error);
    }
  }

  // util
  static async modifyData(showtime) {
    const { date, endTime, startTime, movieId, theaterId, _id } = showtime;
    return {
      date,
      endTime,
      startTime,
      _id,
      movie: {
        posterUrl: movieId.poster.url,
        duration: movieId.runtime,
        title: movieId.title,
        movieId: movieId._id,
      },
      theater: {
        name: theaterId.name,
        theaterId: theaterId._id,
      },
    };
  }
}
module.exports = ShowtimeService;
