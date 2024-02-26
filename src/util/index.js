const crypto = require("crypto");
const _ = require("lodash");
const { Types } = require("mongoose");
const convertToObjectIdMongoDB = (id) => new Types.ObjectId(id);
const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 1]));
};
const getUnSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 0]));
};

const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};

const getSkip = ({ limit, page }) => {
  const limitValue = +limit;
  const pageValue = +page;

  if (Number.isNaN(limitValue) || Number.isNaN(pageValue)) {
    // Handle the case where the values are not valid numbers
    // For example, throw an error or set default values
    throw new Error("Invalid page or limit value");
    // OR
    // return a default skip value
    // return 0;
  }
  return (pageValue - 1) * limitValue;
};

const getSortBy = (sortType) => {
  return sortType === "ctime" ? { _id: -1 } : { _id: 1 };
};

const daysToMilliseconds = (days) => days * 24 * 60 * 60 * 1000;
const hoursToMilliseconds = (hours) => hours * 60 * 60 * 1000;
const minsToMilliseconds = (mins) => mins * 60 * 1000;
const daysToSeconds = (days) => days * 24 * 60 * 60;
const hoursToSeconds = (hours) => hours * 60 * 60;
const minsToSeconds = (mins) => mins * 60;

const createTokenCode = () => crypto.randomBytes(64).toString("hex");

const removeUndefinedNull = (obj) => {
  for (const key in obj) {
    if (obj[key] && typeof obj[key] === "object") {
      obj[key] = removeUndefinedNull(obj[key]); // Recursively check nested objects
      Object.keys(obj[key]).forEach((a) => {
        obj[`${key}.${a}`] = obj[key][a];
      });
      delete obj[key];
    } else if (obj[key] === undefined || obj[key] === null || obj[key] === "") {
      delete obj[key]; // Delete keys with undefined or null values
    }
  }
  return obj;
};

const removeDuplicatesInArray = (array) => [...new Set(array)];

module.exports = {
  convertToObjectIdMongoDB,
  getSelectData,
  getUnSelectData,
  getInfoData,
  getSkip,
  getSortBy,
  daysToMilliseconds,
  hoursToMilliseconds,
  minsToMilliseconds,
  daysToSeconds,
  hoursToSeconds,
  minsToSeconds,
  createTokenCode,
  removeUndefinedNull,
  removeDuplicatesInArray,
};
