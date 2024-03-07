"use strict";
const { createImage } = require("../model/image/image.repo");
const {
  IternalServerError,
  BadRequestError,
} = require("../core/error.response");
const path = require("path");
const googleDrive = require("../db/init.googleDrive");
const fs = require("fs");
const { Readable } = require("stream");

class ImageService {
  static async createImage({ files }) {
    const file = files["file"];
    try {
      const imageStream = new Readable();
      imageStream.push(file.data);
      imageStream.push(null); // Signal the end of the stream
      const createFileResponse = await googleDrive.files.create({
        requestBody: {
          name: file.name,
          mimeType: file.mimetype,
        },
        media: {
          mimeType: file.mimetype,
          body: imageStream,
        },
      });

      // Set permissions for the created file
      const setPermit = await googleDrive.permissions.create({
        fileId: createFileResponse.data.id,
        requestBody: {
          role: "reader",
          type: "anyone",
        },
      });

      if (!setPermit) {
        throw new IternalServerError(`Failed to set image permit`);
      }

      // Get the web view link for the created file
      const webViewLinkResponse = await googleDrive.files.get({
        fileId: createFileResponse.data.id,
        fields: "webViewLink",
      });

      if (!webViewLinkResponse) {
        throw new IternalServerError(`Failed to get image URL`);
      }

      const url = webViewLinkResponse.data.webViewLink;

      return { ...createFileResponse.data, url };
    } catch (error) {
      console.error("Error uploading image to Google Drive:", error);
      throw new IternalServerError("Failed to upload image to Google Drive");
    }
  }
}

module.exports = ImageService;
