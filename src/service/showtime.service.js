"use strict";

const {
  BadRequestError,
  InternalServerError,
} = require("../core/error.response");
const {
  getPublicMovieById,
  getMovieById,
  getAllMoviesByQuery,
  getAllMovieByIds,
} = require("../model/movie/movie.repo");
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
  findShowtime,
  updateTakenSeats,
  getAllMoviesInShowtime,
  deleteAllShowtimes,
} = require("../model/showtime/showtime.repo");
const {
  findTheaterByName,
  checkAllTheaterIdsExist,
  getAllTheaterByIds,
} = require("../model/theater/theater.repo");
const { isTimeBetween, getRandomNumberBetween } = require("../util");
const { shuffleArray } = require("../util/array");
const { generateUniqueCode } = require("../util/code");
const {
  countDaysBetween,
  formatDate,
  DateFormatTypeEnum,
} = require("../util/day");
const {
  timeToMinutes,
  subtractTimesStr,
  convertMillisecondsTo24Hour,
} = require("../util/time");
const EmailService = require("./email.service");

class ShowtimeService {
  // Get
  static async getAllShowtimeDates() {
    try {
      return await getAllShowtimeDates();
    } catch (error) {
      throw new InternalServerError(error);
    }
  }

  static async getAllMoviesInShowtime() {
    try {
      return await getAllMoviesInShowtime();
    } catch (error) {
      throw new InternalServerError(error);
    }
  }

  static async getShowtime({ date, time, movieId, theaterId }) {
    try {
      const foundShowtime = await findShowtime({
        date,
        time,
        movieId,
        theaterId,
      });
      if (!foundShowtime) {
        throw new BadRequestError("Showtime not found");
      }
      return foundShowtime;
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

    const movieIds = await getAllMoviesByQuery({
      query: { title: { $regex: regex } },
      select: ["_id"],
    });

    const query = {
      movieId: { $in: movieIds.map(({ _id }) => _id) },
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
        query,
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

    const movieIds = await getAllMoviesByQuery({
      query: { title: { $regex: regex }, isPublished: true },
      select: ["_id"],
    });

    const query = {
      movieId: { $in: movieIds.map(({ _id }) => _id) },
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
        query,
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
      payload.generalAdmissionPrice = foundMovie.generalAdmissionPrice;
      payload.childPrice = foundMovie.childPrice;
      payload.seniorPrice = foundMovie.seniorPrice;
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

  static async createMultipleShowtime({
    selectDay,
    showTime,
    selectedMovies,
    selectedTheaters,
    breakTime,
  }) {
    try {
      if (countDaysBetween(selectDay[0], selectDay[1]) > 7) {
        throw new BadRequestError(
          "Can't generate more than 7 days of showtimes"
        );
      }

      if (timeToMinutes(showTime.startTime) > timeToMinutes(showTime.endTime)) {
        throw new BadRequestError("Start time can't be after end time");
      }
      const { hours: hourDiff } = subtractTimesStr(
        showTime.endTime,
        showTime.startTime
      );
      if (hourDiff < 5) {
        throw new BadRequestError(
          "Time between start time and end time needs to be greater than 5 hours"
        );
      }
      if (!Array.isArray(selectedMovies) || selectedMovies.length === 0) {
        throw new BadRequestError("Please select movie");
      }
      const movies = await getAllMovieByIds({
        ids: selectedMovies,
        selected: [
          "_id",
          "runtime",
          "generalAdmissionPrice",
          "childPrice",
          "seniorPrice",
        ],
      });
      if (movies.length !== selectedMovies.length) {
        throw new BadRequestError("Some movie is not exist");
      }

      if (!Array.isArray(selectedTheaters) || selectedTheaters.length === 0) {
        throw new BadRequestError("Please select theater");
      }

      const theaters = await getAllTheaterByIds({
        ids: selectedTheaters,
        selected: ["_id", "name"],
      });
      if (theaters.length !== selectedTheaters.length) {
        throw new BadRequestError("Some theater is not exist");
      }

      // Helper function to add days to a date
      const addDays = (date, days) => {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
      };

      // Helper function to create Date objects for specific times on a given date
      const createTimeOnDate = (date, time) => {
        const [hours, minutes] = time.split(":").map(Number);
        const result = new Date(date);
        result.setHours(hours, minutes, 0, 0); // Set hours and minutes, reset seconds and milliseconds
        return result;
      };

      // Initialize the start and end dates
      const [startDate, endDate] = selectDay;
      await deleteAllShowtimes();
      const start = new Date(startDate);
      const end = new Date(endDate);
      const { startTime, endTime } = showTime;
      let timeDiff = timeToMinutes(endTime) - timeToMinutes(startTime);
      let shuffledMovies = shuffleArray([...movies]);
      let createShowtimePromises = [];
      // Loop through each date in the specified range
      for (let date = start; date <= end; date = addDays(date, 1)) {
        // Loop through each theater
        for (const theater of theaters) {
          let currentTime = createTimeOnDate(date, startTime);
          const endTimeOnDate = createTimeOnDate(date, endTime);
          let remainTime = timeDiff;
          // Loop through each shuffled movie to schedule showtimes
          while (shuffledMovies.length > 0) {
            const movie = shuffledMovies[0];
            const movieRuntime = Math.ceil(parseInt(movie.runtime)); // Round up runtime to the nearest minute
            const movieEndTime = new Date(
              currentTime.getTime() + movieRuntime * 60000
            ); // Multiply by 60000 to convert minutes to milliseconds
            const resStartTime = convertMillisecondsTo24Hour(
              currentTime.getTime()
            );
            const resEndTime = convertMillisecondsTo24Hour(
              movieEndTime.getTime()
            );
            if (
              movieEndTime > endTimeOnDate ||
              +resStartTime.split(":")[0] < +startTime.split(":")[0] ||
              +resStartTime.split(":")[0] > +resEndTime.split(":")[0]
            ) {
              break;
            }

            shuffledMovies.shift();
            if (shuffledMovies.length === 0) {
              shuffledMovies = shuffleArray([...movies]);
            }

            // Add the showtime to the list
            createShowtimePromises.push(
              createShowtime({
                payload: {
                  theaterId: theater._id,
                  movieId: movie._id,
                  date: formatDate({
                    date: currentTime,
                    formatType: DateFormatTypeEnum.MM_DD_YYYY,
                  }), // Create a new Date object to avoid reference issues
                  startTime: resStartTime,
                  endTime: resEndTime,
                  generalAdmissionPrice: movie.generalAdmissionPrice,
                  childPrice: movie.childPrice,
                  seniorPrice: movie.seniorPrice,
                },
              })
            );

            // Update the current time to the end time of the current movie
            currentTime = new Date(movieEndTime);

            // Add a break time (optional)
            currentTime.setMinutes(currentTime.getMinutes() + breakTime);
          }
        }
      }

      const results = await Promise.allSettled(createShowtimePromises);
      const successfulCreations = results.filter(
        (result) => result.status === "fulfilled"
      ).length;
      const failedCreations = results.filter(
        (result) => result.status === "rejected"
      ).length;

      return {
        success: failedCreations === 0,
        successfulCreations,
        failedCreations,
      };
    } catch (error) {
      throw new InternalServerError(error);
    }
  }
  // Update
  static async checkout(payload) {
    try {
      const { tickets, selectedMovie, foodAndDrink, toEmail } = payload;
      const foundShowtime = await findShowtime({
        movieId: selectedMovie._id,
        date: tickets.date,
        time: tickets.time,
      });
      if (!foundShowtime) {
        throw new BadRequestError("showtime not found");
      }
      const foundMovie = await getMovieById({ movieId: selectedMovie._id });
      if (!foundMovie) {
        throw new BadRequestError("movie not found");
      }
      const takenSeats = await tickets.seats.filter((seat) =>
        foundShowtime.takenSeats.includes(seat)
      );
      if (takenSeats.length !== 0) {
        throw new BadRequestError(
          `Seat${takenSeats.length > 1 && "s"}: ${takenSeats.join(
            ","
          )} already taken. Please go back to confirm.`
        );
      }
      await updateTakenSeats({
        _id: foundShowtime._id,
        seats: tickets.seats,
      });
      const { title, poster, runtime, rating, _id } = foundMovie;
      payload.bookingId = generateUniqueCode(10);
      payload.selectedMovie = { title, poster, runtime, rating, _id };
      payload.tickets.theaterName = foundShowtime.theaterId.name;
      payload.tickets.subTotal = Object.entries(tickets.prices).reduce(
        (acc, [_, { price, count }]) => (acc += price * count),
        0
      );
      payload.foodAndDrink.subTotal = foodAndDrink.products.reduce(
        (acc, p) => (acc += p.price * p.amount),
        0
      );

      payload.subTotal =
        payload.tickets.subTotal + payload.foodAndDrink.subTotal;
      payload.feed = 5.67;
      payload.tax = payload.subTotal * 0.3;
      payload.total = payload.feed + payload.tax + payload.subTotal;

      await EmailService.sendEmailTicket({
        toEmail,
        ticketDetail: payload,
      });

      return payload;
    } catch (error) {
      throw new InternalServerError(error);
    }
  }
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
