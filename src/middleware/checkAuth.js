"use strict";
const { BadRequestError, AuthFailureError } = require("../core/error.response");
const asyncHandler = require("../helper/asyncHandler");

const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "athorization",
  REFRESHTOKEN: "refreshtoken",
};

const checkUserRole = (role) => {
  return asyncHandler(async (req, res, next) => {
    try {
      const foundUser = await getUserById({ userId: req.user.userId });
      const validUserRole = foundUser.user_roles.includes(role);
      if (!validUserRole) {
        throw new BadRequestError("Request denied");
      }
      return next();
    } catch (error) {
      throw error;
    }
  });
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

module.exports = { checkUserRole, authentication };
