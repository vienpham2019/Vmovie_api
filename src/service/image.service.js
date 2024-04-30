"use strict";
const {
  InternalServerError,
  BadRequestError,
} = require("../core/error.response");
const { formatFileSize } = require("../util");
const cloudBucket = require("../db/init.googleCloud");
const MovieService = require("./movie.service");

class ImageService {
  static async createImage({ file, query }) {
    const { field, db, id } = query;
    if (!file) {
      throw new BadRequestError("No file uploaded");
    }

    if (!file.mimetype.startsWith("image/")) {
      throw new BadRequestError("Only images are allowed");
    }

    if (
      !["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(
        file.mimetype
      )
    ) {
      throw new BadRequestError(
        `${file.mimetype.split("/")[1]} is not allowed`
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new BadRequestError("File size exceeds the limit");
    }

    return new Promise((resolve, reject) => {
      const blob = cloudBucket.file(file.originalname);
      const blobStream = blob.createWriteStream();

      blobStream.on("error", (error) => {
        reject(error);
      });

      blobStream.on("finish", async () => {
        try {
          // Retrieve metadata of the uploaded file
          const [{ bucket, name, contentType, size }] =
            await blob.getMetadata();
          const url = `https://storage.googleapis.com/${bucket}/${name}`;
          const data = {
            name,
            mimeType: contentType,
            size: formatFileSize(size - 0),
            url,
          };
          switch (db) {
            case "movie":
              await MovieService.handleAddMovieImage({
                movieId: id,
                payload: data,
                field,
              });
              break;
          }
          resolve(data);
        } catch (error) {
          reject(error);
        }
      });

      blobStream.end(file.buffer);
    });
  }

  static async deleteImageByFileName({ fileName }) {
    const file = cloudBucket.file(fileName);
    const [exists] = await file.exists();
    if (exists) await file.delete();
  }

  static async deleteImage({ query, params }) {
    const { fileName } = params;
    const { field, db, id } = query;
    try {
      if (!fileName) {
        throw new BadRequestError("No file name");
      }

      await this.deleteImageByFileName({ fileName });

      switch (db) {
        case "movie":
          await MovieService.handleRemoveMovieImage({
            movieId: id,
            fileName,
            field,
          });
          break;
      }
      return { message: `File ${fileName} deleted successfully` };
    } catch (error) {
      throw new InternalServerError(`Failed to delete file ${fileName}`);
    }
  }
}

module.exports = ImageService;
