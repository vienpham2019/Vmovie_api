"use strict";

const timeToMinutes = (timeStr) => {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
};

const subtractTimesStr = (timeStr1, timeStr2) => {
  // Convert times to minutes
  const minutes1 = timeToMinutes(timeStr1);
  const minutes2 = timeToMinutes(timeStr2);

  // Calculate the difference in minutes
  const differenceInMinutes = Math.abs(minutes1 - minutes2);

  // Convert the difference back to hours and minutes
  const hours = Math.floor(differenceInMinutes / 60);
  const minutes = differenceInMinutes % 60;

  return { hours, minutes };
};

const convertMillisecondsTo24Hour = (milliseconds) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);

  const hours = totalHours % 24;
  const minutes = totalMinutes % 60;

  const formattedHours = hours.toString().padStart(2, "0");
  const formattedMinutes = minutes.toString().padStart(2, "0");

  return `${formattedHours}:${formattedMinutes}`;
};

module.exports = {
  timeToMinutes,
  subtractTimesStr,
  convertMillisecondsTo24Hour,
};
