"use strict";
const {
  BadRequestError,
  UnauthorizedError,
} = require("../core/error.response");
const { asyncHandler } = require("../helper/asyncHandler");

const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "athorization",
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
  const cookies = req.cookies;
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!cookies?.jwt || !userId) {
    throw new UnauthorizedError();
  }

  const keyStore = await getKeyTokenByUserId({ userId });
  // verify access token
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!keyStore || !accessToken || !accessToken?.startsWith("Bearer ")) {
    throw new UnauthorizedError();
  }

  if (keyStore.refreshToken !== cookies.jwt) {
    throw new UnauthorizedError();
  }

  try {
    // check keyStore with user id
    const decodeUser = JWT.verify(
      accessToken.split(" ")[1],
      keyStore.publicKey
    );
    if (userId != decodeUser.userId) {
      throw new UnauthorizedError();
    }
    // Ok all then return next
    req.keyStore = keyStore;
    req.user = decodeUser;
    req.refreshToken = cookies.jwt;
    return next();
  } catch (error) {
    throw error;
  }
});

module.exports = { checkUserRole, authentication };
