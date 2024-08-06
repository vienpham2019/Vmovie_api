"use strict";

const {
  InternalServerError,
  BadRequestError,
} = require("../../core/error.response");
const {
  getUnSelectData,
  convertToObjectIdMongoDB,
  getSkip,
  getSelectData,
} = require("../../util");
const showtimeModel = require("./showtime.model");

// Get
const getAllMoviesInShowtime = async () => {
  try {
    const results = await showtimeModel.aggregate([
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
        $match: {
          "movieDetails.isPublished": true,
        },
      },
      {
        $group: {
          _id: "$movieId",
          title: { $first: "$movieDetails.title" },
          runtime: { $first: "$movieDetails.runtime" },
          posterUrl: { $first: "$movieDetails.poster.url" },
          trailer: { $first: "$movieDetails.trailer" },
          genre: { $first: "$movieDetails.genre" },
          dateRelease: { $first: "$movieDetails.dateRelease" },
          rating: { $first: "$movieDetails.rating" },
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          runtime: 1,
          posterUrl: 1,
          trailer: 1,
          genre: 1,
          dateRelease: 1,
          rating: 1,
        },
      },
    ]);
    return results.sort((a, b) => a.title.localeCompare(b.title));
  } catch (error) {
    throw new InternalServerError(error);
  }
};
const getAllShowtime = async ({ page, limit, sortBy, sortDir, query }) => {
  try {
    const totalShowtimes = await showtimeModel.countDocuments(query);

    const results = await showtimeModel.aggregate([
      {
        $match: query,
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
        $lookup: {
          from: "Theaters", // Name of the theater collection
          localField: "theaterId",
          foreignField: "_id",
          as: "theaterDetails",
        },
      },
      {
        $unwind: "$theaterDetails",
      },

      {
        $sort: { [sortBy]: +sortDir },
      },
      {
        $project: {
          _id: 1,
          date: 1,
          startTime: 1,
          endTime: 1,
          createdAt: 1,
          updatedAt: 1,
          "movieDetails.title": 1,
          "movieDetails.runtime": 1,
          "movieDetails.poster.url": 1,
          "movieDetails._id": 1,
          "movieDetails.isPublished": 1,
          "theaterDetails.name": 1,
          "theaterDetails._id": 1,
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
      totalShowtimes,
      showtimes: results,
    };
  } catch (error) {
    throw new InternalServerError(error);
  }
};

const findShowtime = async (
  { movieId, date, time, theaterId },
  select = [
    "childPrice",
    "generalAdmissionPrice",
    "seniorPrice",
    "takenSeats",
    "theaterId",
  ]
) => {
  try {
    return await showtimeModel
      .findOne({
        movieId: convertToObjectIdMongoDB(movieId),
        date,
        startTime: time,
        theaterId: convertToObjectIdMongoDB(theaterId),
      })
      .populate({
        path: "theaterId",
        select: "grid name",
      })
      .select(getSelectData(select))
      .lean()
      .exec();
  } catch (error) {
    throw new InternalServerError(error);
  }
};

const getAllShowtimeByDate = async ({ date }) => {
  try {
    // const results = await showtimeModel.aggregate([
    //   {
    //     $match: { date },
    //   },
    //   {
    //     $lookup: {
    //       from: "Movies", // Name of the movie collection
    //       localField: "movieId",
    //       foreignField: "_id",
    //       as: "movieDetails",
    //     },
    //   },
    //   {
    //     $unwind: "$movieDetails",
    //   },
    //   {
    //     $group: {
    //       _id: {
    //         movieId: "$movieId",
    //         title: "$movieDetails.title",
    //         runtime: "$movieDetails.runtime",
    //         rating: "$movieDetails.rating",
    //         posterUrl: "$movieDetails.poster.url",
    //         trailer: "$movieDetails.trailer",
    //       },
    //       showtimes: {
    //         $push: {
    //           startTime: "$startTime",
    //         },
    //       },
    //     },
    //   },
    //   {
    //     $project: {
    //       _id: 0,
    //       movieId: "$_id.movieId",
    //       title: "$_id.title",
    //       runtime: "$_id.runtime",
    //       rating: "$_id.rating",
    //       posterUrl: "$_id.posterUrl",
    //       trailer: "$_id.trailer",
    //       showtimes: 1,
    //     },
    //   },
    // ]);

    const results = await showtimeModel.aggregate([
      {
        $match: { date }, // Match the specified date
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
        $lookup: {
          from: "Theaters", // Name of the theaters collection
          localField: "theaterId",
          foreignField: "_id",
          as: "theaterDetails",
        },
      },
      {
        $unwind: "$theaterDetails",
      },
      {
        $group: {
          _id: {
            movieId: "$movieId",
            title: "$movieDetails.title",
            runtime: "$movieDetails.runtime",
            rating: "$movieDetails.rating",
            posterUrl: "$movieDetails.poster.url",
            trailer: "$movieDetails.trailer",
          },
          showtimes: {
            $push: {
              startTime: "$startTime",
              theaterId: "$theaterId",
              theaterName: "$theaterDetails.name",
            },
          },
        },
      },
      {
        $addFields: {
          showtimes: {
            $sortArray: {
              input: "$showtimes",
              sortBy: { startTime: 1 }, // Sort by startTime in ascending order
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          movieId: "$_id.movieId",
          title: "$_id.title",
          runtime: "$_id.runtime",
          rating: "$_id.rating",
          posterUrl: "$_id.posterUrl",
          trailer: "$_id.trailer",
          showtimes: 1,
        },
      },
    ]);

    return results;
  } catch (error) {
    throw new InternalServerError(error);
  }
};

const getAllShowtimeByMovieId = async ({ movieId }) => {
  try {
    const results = await showtimeModel.aggregate([
      {
        $match: { movieId: convertToObjectIdMongoDB(movieId) }, // Match the specified movieId
      },
      {
        $lookup: {
          from: "Theaters", // Name of the theaters collection
          localField: "theaterId", // Field in showtimeModel that references the theater
          foreignField: "_id", // Field in theaterModel that is referenced
          as: "theater", // Output array field
        },
      },
      {
        $unwind: "$theater", // Deconstruct the array to include theater document fields
      },
      {
        $group: {
          _id: "$date",
          showtimes: {
            $push: {
              startTime: "$startTime",
              theaterId: "$theaterId",
              theaterName: "$theater.name",
            },
          },
        },
      },
      {
        $addFields: {
          showtimes: {
            $sortArray: {
              input: "$showtimes",
              sortBy: { startTime: 1 }, // Sort by startTime in ascending order
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          showtimes: 1,
        },
      },
      {
        $sort: { date: 1 }, // Optional: Sort by date
      },
    ]);

    return results;
  } catch (error) {
    throw new InternalServerError(error);
  }
};

const getAllShowtimeDates = async () => {
  try {
    const dates = await showtimeModel.aggregate([
      {
        $group: {
          _id: "$date",
        },
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
        },
      },
    ]);

    return dates;
  } catch (error) {
    throw new InternalServerError(error);
  }
};

const getShowtimeCountByMovieAndDate = async (movieId) => {
  const results = await showtimeModel.aggregate([
    {
      $match: { movieId: convertToObjectIdMongoDB(movieId) },
    },
    {
      $lookup: {
        from: "Theaters", // Replace with the actual name of your theater collection
        localField: "theaterId",
        foreignField: "_id",
        as: "theaterDetails",
      },
    },
    {
      $unwind: "$theaterDetails",
    },
    {
      $group: {
        _id: "$date",
        times: {
          $push: {
            startTime: "$startTime",
            endTime: "$endTime",
            theaterName: "$theaterDetails.name",
          },
        },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        date: "$_id",
        times: 1,
        count: 1,
      },
    },
  ]);

  return results;
};

const getAllShowTimeByQuery = async ({ query, unSelect }) => {
  try {
    return await showtimeModel
      .find(query)
      .populate({
        path: "theaterId",
        select: "name",
      })
      .populate({
        path: "movieId",
        select: "title runtime poster",
      })
      .select(getUnSelectData(unSelect))
      .lean()
      .exec();
  } catch (error) {
    throw new InternalServerError(error);
  }
};

const getShowTimeById = async ({ _id, unSelect }) => {
  try {
    return await showtimeModel
      .findById(_id)
      .populate({
        path: "theaterId",
        select: "name",
      })
      .populate({
        path: "movieId",
        select: "title runtime poster",
      })
      .select(getUnSelectData(unSelect))
      .lean()
      .exec();
  } catch (error) {
    throw new InternalServerError(error);
  }
};
// Create
const createShowtime = async ({ payload }) => {
  try {
    return await showtimeModel.create(payload);
  } catch (error) {
    throw new InternalServerError(error);
  }
};
// Update
const updateTakenSeats = async ({ _id, seats }) => {
  try {
    return await showtimeModel.findOneAndUpdate(
      { _id },
      { $addToSet: { takenSeats: { $each: seats } } }
    );
  } catch (error) {
    throw new InternalServerError(error);
  }
};
// Delete
const deleteShowtime = async ({ _id }) => {
  try {
    return await showtimeModel.findOneAndDelete({
      _id: convertToObjectIdMongoDB(_id),
    });
  } catch (error) {
    throw new InternalServerError(error);
  }
};

const deleteShowtimesBetweenDates = async (startDate, endDate) => {
  if (!startDate || !endDate) {
    throw new BadRequestError("Please provide both start date and end date");
  }

  try {
    const result = await showtimeModel.deleteMany({
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    });
    return result;
  } catch (error) {
    throw new Error("Error deleting showtimes: " + error.message);
  }
};

const deleteAllShowtimes = async () => {
  try {
    return await showtimeModel.deleteMany({});
  } catch (error) {
    console.error("Error deleting showtimes:", error);
  }
};

module.exports = {
  getAllShowtime,
  getAllMoviesInShowtime,
  findShowtime,
  updateTakenSeats,
  getAllShowtimeDates,
  getAllShowtimeByMovieId,
  getShowtimeCountByMovieAndDate,
  getAllShowtimeByDate,
  getAllShowTimeByQuery,
  createShowtime,
  getShowTimeById,
  deleteShowtime,
  deleteShowtimesBetweenDates,
  deleteAllShowtimes,
};
