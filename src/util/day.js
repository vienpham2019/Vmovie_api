"use strict";

const { BadRequestError } = require("../core/error.response");

const countDaysBetween = (startDay, endDay) => {
  // Convert date strings to Date objects
  const startDate = new Date(startDay);
  const endDate = new Date(endDay);

  // Check if the given dates are valid
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    throw new BadRequestError("Invalid start date or end date");
  }

  // Calculate the difference in time between the two dates
  const differenceInTime = endDate.getTime() - startDate.getTime();

  // Convert the difference in time from milliseconds to days
  const differenceInDays = differenceInTime / (1000 * 3600 * 24);

  // Return the difference in days, adding 1 to include the end day
  return Math.floor(differenceInDays) + 1;
};

const DateFormatTypeEnum = Object.freeze({
  MM_DD_YYYY: "MM/DD/YYYY",
  DD_MM_YYYY: "DD/MM/YYYY",
  YYYY_MM_DD: "YYYY/MM/DD",
  VERBOSE: "Verbose",
  SHORT: "Short",
});

const formatDate = ({ date, formatType }) => {
  switch (formatType) {
    case DateFormatTypeEnum.MM_DD_YYYY:
      return `${(date.getMonth() + 1).toString().padStart(2, "0")}/${date
        .getDate()
        .toString()
        .padStart(2, "0")}/${date.getFullYear()}`;

    case DateFormatTypeEnum.DD_MM_YYYY:
      return `${date.getDate().toString().padStart(2, "0")}/${(
        date.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}/${date.getFullYear()}`;

    case DateFormatTypeEnum.YYYY_MM_DD:
      return `${date.getFullYear()}/${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}/${date.getDate().toString().padStart(2, "0")}`;

    case DateFormatTypeEnum.VERBOSE:
      const options = {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      };
      return date.toLocaleDateString(undefined, options);

    case DateFormatTypeEnum.SHORT:
      return `${(date.getMonth() + 1).toString()}/${date
        .getDate()
        .toString()}/${date.getFullYear()}`;

    default:
      throw new Error("Unsupported format type");
  }
};

module.exports = {
  DateFormatTypeEnum,
  formatDate,
  countDaysBetween,
};
