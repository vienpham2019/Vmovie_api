const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowMs: 60 * 1000, // 1min
  max: 5, // Limit each Ip to 5 login requests per `window` per minute
  message: {
    message:
      "Too many login attempts from this IP, please try again after a 60 second pause",
  },
  handler: (req, res, next, options) => {
    res.status(options.statusCode).send(options.message);
  },
  standardHeaders: true, // Return rate limit info in the `ratelimit - *` headers
  legacyHeaders: false, // Disable the `X-Ratelimit-*` headers
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each Ip to 5 login requests per `window` per minute
  message: {
    message:
      "Too many register attempts from this IP, please try again after a 1 hour pause",
  },
  handler: (req, res, next, options) => {
    res.status(options.statusCode).send(options.message);
  },
  standardHeaders: true, // Return rate limit info in the `ratelimit - *` headers
  legacyHeaders: false, // Disable the `X-Ratelimit-*` headers
});

module.exports = { loginLimiter, registerLimiter };
