const rateLimit = require("express-rate-limit");
const { minsToMilliseconds, hoursToMilliseconds } = require("../util");

const createLimiter = ({ windowMs, max, duration }) => {
  return rateLimit({
    windowMs,
    max, // Limit each Ip to 5 login requests per `window` per minute
    message: {
      message: `Too many requests from this IP, please try again after a ${duration}.`,
    },
    handler: (req, res, next, options) => {
      res.status(options.statusCode).send(options.message);
    },
    standardHeaders: true, // Return rate limit info in the `ratelimit - *` headers
    legacyHeaders: false, // Disable the `X-Ratelimit-*` headers
  });
};

const loginLimiter = createLimiter({
  windowMs: minsToMilliseconds(1),
  max: 5,
  duration: "1 min.",
});

const registerLimiter = createLimiter({
  windowMs: hoursToMilliseconds(1),
  max: 5,
  duration: "1 hour.",
});

const forgotPasswordLimiter = createLimiter({
  windowMs: minsToMilliseconds(1),
  max: 1,
  duration: "1 min",
});

module.exports = { loginLimiter, registerLimiter, forgotPasswordLimiter };
