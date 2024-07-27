"use strict";

const { google } = require("googleapis");
const nodemailer = require("nodemailer");

const {
  NODEMAILER_CLIENT_ID,
  NODEMAILER_CLIENT_SECRET,
  NODEMAILER_REDIRECT_URL,
  NODEMAILER_REFRESH_TOKEN,
} = process.env;

const oAuth2Client = new google.auth.OAuth2(
  NODEMAILER_CLIENT_ID,
  NODEMAILER_CLIENT_SECRET,
  NODEMAILER_REDIRECT_URL
);
oAuth2Client.setCredentials({ refresh_token: NODEMAILER_REFRESH_TOKEN });

const getTransport = async () => {
  try {
    const accessToken = await oAuth2Client.getAccessToken();
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "vienpham2019@gmail.com",
        clientId: NODEMAILER_CLIENT_ID,
        clientSecret: NODEMAILER_CLIENT_SECRET,
        refreshToken: NODEMAILER_REFRESH_TOKEN,
        accessToken,
      },
    });
    return transport;
  } catch (error) {
    console.error("Error creating transport:", error);
    throw new Error("Failed to create transport");
  }
};

module.exports = { getTransport };
