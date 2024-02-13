const JWT = require("jsonwebtoken");
const { asyncHandler } = require("../helper/asyncHandler");
const { AuthFailureError, NotFoundError } = require("../core/error.response");
const { getKeyTokenByUserId } = require("../model/keyToken/keyToken.repo");

const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "athorization",
  REFRESHTOKEN: "refreshtoken",
};

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    // access token
    const accessToken = await JWT.sign(payload, publicKey, {
      expiresIn: "2 days",
    });

    // refresh token
    const refreshToken = await JWT.sign(payload, privateKey, {
      expiresIn: "7 days",
    });

    return { accessToken, refreshToken };
  } catch (error) {
    return error;
  }
};

const authentication = asyncHandler(async (req, res, next) => {
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) {
    throw new AuthFailureError("Invalid Request");
  }

  const keyStore = await getKeyTokenByUserId({ userId });
  if (!keyStore) {
    throw new NotFoundError("Not found keyStore");
  }

  const refreshToken = req.headers[HEADER.REFRESHTOKEN];
  if (refreshToken) {
    try {
      // check keyStore with user id
      const decodeUser = JWT.verify(refreshToken, keyStore.privateKey);
      if (userId != decodeUser.userId) {
        throw new AuthFailureError("Invalid UserId");
      }
      // Ok all then return next
      req.keyStore = keyStore;
      req.user = decodeUser;
      req.refreshToken = refreshToken;
      return next();
    } catch (error) {
      throw error;
    }
  }

  // verify access token
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) {
    throw new AuthFailureError("Invalid Request");
  }

  try {
    // check keyStore with user id
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
    if (userId != decodeUser.userId) {
      throw new AuthFailureError("Invalid UserId");
    }
    // Ok all then return next
    req.keyStore = keyStore;
    req.user = decodeUser;
    req.refreshToken = refreshToken;
    return next();
  } catch (error) {
    throw error;
  }
});

module.exports = {
  createTokenPair,
  authentication,
};
