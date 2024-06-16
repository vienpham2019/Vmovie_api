"use strict";

const {
  InternalServerError,
  BadRequestError,
} = require("../core/error.response");
const {
  createTheater,
  findTheaterByName,
  getAllTheaters,
  updateTheater,
  deleteTheaterById,
  getTheaterDetails,
} = require("../model/theater/theater.repo");

class TheaterService {
  // Get
  static async getTheaterDetails({ _id }) {
    try {
      return await getTheaterDetails({
        _id,
        unSelect: ["updatedAt", "createdAt", "__v"],
      });
    } catch (error) {
      throw new InternalServerError(error);
    }
  }

  static async getAllTheaterByAdmin({ limit = 20, page = 1, search = "" }) {
    const regex = new RegExp(search, "i"); // "i" flag for case-insensitive matching
    const query = {
      name: { $regex: regex },
    };

    try {
      return await getAllTheaters({
        query,
        page,
        limit,
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
  static async updateTheater({ payload, _id }) {
    try {
      if (!payload.name) {
        throw new BadRequestError("Name is required");
      }
      if (!payload?.grid.length) {
        throw new BadRequestError("Grid is required");
      }
      const foundTheater = await findTheaterByName(payload.name);

      if (foundTheater && _id !== foundTheater._id.toString()) {
        throw new BadRequestError(`Theater with name: ${payload.name} exists`);
      }
      return await updateTheater({
        payload,
        _id,
        unSelect: ["__v", "updatedAt", "createdAt"],
      });
    } catch (error) {
      throw new InternalServerError(error);
    }
  }
  // Delete
  static async deleteTheaterById({ _id }) {
    try {
      return deleteTheaterById({ _id });
    } catch (error) {
      throw new InternalServerError(error);
    }
  }
}

module.exports = TheaterService;
