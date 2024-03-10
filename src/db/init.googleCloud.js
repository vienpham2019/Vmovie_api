"use strict";
const { Storage } = require("@google-cloud/storage");
const projectId = process.env.GOOGLE_STORAGE_PROJECT_ID;
const bucketName = process.env.GOOGLE_STORAGE_BUCKET_NAME;
const keyFilename = process.env.GOOGLE_STORAGE_KEY_FILE_NAME;

const storage = new Storage({ projectId, keyFilename });
const cloudBucket = storage.bucket(bucketName);

module.exports = cloudBucket;
