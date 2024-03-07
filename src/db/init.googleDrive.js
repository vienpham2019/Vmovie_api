"use strict";

const { google } = require("googleapis");

const CLIENT_ID = process.env.GOOGLE_DRIVE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_DRIVE_CLIENT_SECRET;
const REFRESHTOKEN = process.env.GOOGLE_DRIVE_REFRESHTOKEN;
const REDIRECT_URI = process.env.GOOGLE_DRIVE_REDIRECT_URI;

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oauth2Client.setCredentials({ refresh_token: REFRESHTOKEN });

const drive = google.drive({
  version: "v3",
  auth: oauth2Client,
});

module.exports = drive;
