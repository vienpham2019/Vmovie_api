"use strict";
const {
  InternalServerError,
  BadRequestError,
} = require("../core/error.response");
const { formatFileSize } = require("../util");
const cloudBucket = require("../db/init.googleCloud");

class ImageService {
  static async createImage({ file }) {
    if (!file) {
      throw new BadRequestError("No file uploaded");
    }

    if (!file.mimetype.startsWith("image/")) {
      throw new BadRequestError("Only images are allowed");
    }

    if (!["image/jpeg", "image/png", "image/jpg"].includes(file.mimetype)) {
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
          const url = `https://storage.cloud.google.com/${bucket}/${name}?authuser=0`;
          const data = {
            name,
            mimeType: contentType,
            size: formatFileSize(size - 0),
            url,
          };
          resolve(data);
        } catch (error) {
          reject(error);
        }
      });

      blobStream.end(file.buffer);
    });
  }

  static async deleteImage({ fileName }) {
    try {
      if (!fileName) {
        throw new BadRequestError("No file name");
      }
      await cloudBucket.file(fileName).delete();
      return { message: `File ${fileName} deleted successfully` };
    } catch (error) {
      throw new InternalServerError(`Failed to delete file ${fileName}`);
    }
  }
}

module.exports = ImageService;
