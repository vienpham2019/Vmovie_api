"use strict";

const {
  InternalServerError,
  BadRequestError,
} = require("../core/error.response");
const {
  createTheater,
  findTheaterByName,
  getAllTheaters,
} = require("../model/theater/theater.repo");

class TheaterService {
  // Get
  static async getAllTheaterByAdmin({
    limit = 50,
    page = 1,
    sortBy = "updatedAt",
    search = "",
    sortDir = 1,
  }) {
    const regex = new RegExp(search, "i"); // "i" flag for case-insensitive matching
    const query = {
      name: { $regex: regex },
    };

    try {
      return await getAllTheaters({
        query,
        page,
        limit,
        sortBy,
        sortDir,
        select: ["_id", "updatedAt", "createdAt", "name", "grid"],
      });
    } catch (error) {
      throw new InternalServerError(error);
    }
  }

  // Create
  static async createTheater(payload) {
    try {
      if (!payload.name) {
        throw new BadRequestError("Name is required");
      }
      if (!payload?.grid.length) {
        throw new BadRequestError("Grid is required");
      }
      const foundTheater = await findTheaterByName(payload.name);
      if (foundTheater) {
        throw new BadRequestError(`Theater with name: ${payload.name} exists`);
      }
      return await createTheater({ payload });
    } catch (error) {
      throw new InternalServerError(error);
    }
  }
  // Update
  // Delete
}

module.exports = TheaterService;
