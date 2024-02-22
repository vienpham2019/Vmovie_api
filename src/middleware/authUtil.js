const JWT = require("jsonwebtoken");

const createTokenPair = async (payload) => {
  try {
    // access token
    const accessToken = await JWT.sign(
      payload,
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "15 mins",
      }
    );

    // refresh token
    const refreshToken = await JWT.sign(
      payload,
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "7 days",
      }
    );

    return { accessToken, refreshToken };
  } catch (error) {
    return error;
  }
};

module.exports = {
  createTokenPair,
};
