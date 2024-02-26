const JWT = require("jsonwebtoken");

const createTokenPair = async ({
  payload,
  accessTokenSecret,
  refreshTokenSecret,
}) => {
  try {
    // access token
    const accessToken = await JWT.sign(payload, accessTokenSecret, {
      expiresIn: "15 mins",
    });

    // refresh token
    const refreshToken = await JWT.sign(payload, refreshTokenSecret, {
      expiresIn: "7 days",
    });

    return { accessToken, refreshToken };
  } catch (error) {
    return error;
  }
};

module.exports = {
  createTokenPair,
};
