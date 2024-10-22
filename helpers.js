/*
 * Cormac Taylor
 * I pledge my honor that I have abided by the Stevens Honor System.
 */
import { ObjectId } from "mongodb";

const US_STATE_CODES = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
  "DC", // Included District of Columbia
];

const isInvalidString = (str) => {
  return typeof str !== "string" || str.trim() === 0;
};

const isInvalidInteger = (num) => {
  return (
    typeof num !== "number" ||
    isNaN(num) ||
    !isFinite(num) ||
    !Number.isInteger(num)
  );
};

const isInvalidBoolean = (bool) => {
  return typeof bool !== "boolean";
};

const isInvalidNonEmptyArray = (arr) => {
  return !Array.isArray(arr) || arr.length === 0;
};

const isInvalidObject = (obj) => {
  return Array.isArray(obj) || typeof obj !== "object";
};

const isInvalidObjectID = (id) => {
  return isInvalidString(id) || !ObjectId.isValid(id.trim());
};

const isInvalidStateCode = (state) => {
  return !US_STATE_CODES.includes(state.trim().toUpperCase());
};

const isInvalidDate = (date) => {
  if (isInvalidString(date)) return true;
  if (date.length !== 10 || date[2] !== "/" || date[5] !== "/") return true;

  date = date.trim();
  for (let c of date) {
    if (c !== "/" || c < "0" || c > "9") return true;
  }

  let dateArr = date.split("/");
  if (dateArr.length !== 3) return true;

  let month = parseInt(dateArr[0]);
  let day = parseInt(dateArr[1]);
  let year = parseInt(dateArr[2]);

  if (
    year < 1850 ||
    year > new Date().getFullYear() ||
    month < 1 ||
    month > 12 ||
    day < 1
  )
    return true;

  let monthsLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0)
    monthsLength[1] = 29;

  return day > monthsLength[month - 1];
};

const isInvalidFinalScore = (score) => {
  if (isInvalidString(score)) {
    return true;
  }

  score = score.trim();
  for (let c of date) {
    if (c !== "-" || c < "0" || c > "9") return true;
  }

  let scoreArr = date.split("-");
  if (scoreArr.length !== 2) return true;

  let home = parseInt(scoreArr[0]);
  let away = parseInt(scoreArr[1]);

  return home < 0 || away < 0 || home === away;
};

const updateRecord = (winLossCount, win) => {
  let winLossArr = winLossCount.split("-");

  let wins = parseInt(winLossArr[0]);
  let losses = parseInt(winLossArr[1]);

  win ? wins++ : losses++;

  return `${wins}-${losses}`;
};

export {
  isInvalidString,
  isInvalidInteger,
  isInvalidBoolean,
  isInvalidNonEmptyArray,
  isInvalidObject,
  isInvalidObjectID,
  isInvalidStateCode,
  isInvalidDate,
  isInvalidFinalScore,
  updateRecord,
};
