"use strict";

const { InternalServerError } = require("../../core/error.response");
const {
  getUnSelectData,
  convertToObjectIdMongoDB,
  getSkip,
  getSelectData,
} = require("../../util");
const showtimeModel = require("./showtime.model");

// Get
const getAllShowtime = async ({ page, limit, sortBy, sortDir, search }) => {
  try {
    const totalShowtimes = await showtimeModel.countDocuments();

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
        $match: search,
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
  { movieId, date, time },
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
    const results = await showtimeModel.aggregate([
      {
        $match: { date },
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
        $group: {
          _id: "$date",
          showtimes: { $push: "$startTime" },
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

module.exports = {
  getAllShowtime,
  findShowtime,
  getAllShowtimeDates,
  getAllShowtimeByMovieId,
  getShowtimeCountByMovieAndDate,
  getAllShowtimeByDate,
  getAllShowTimeByQuery,
  createShowtime,
  getShowTimeById,
  deleteShowtime,
};
