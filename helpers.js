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
  return !(typeof str === "string" && str.trim() !== 0);
};

const isInvalidInteger = (num) => {
  return !(
    typeof num === "number" &&
    !isNaN(num) &&
    isFinite(num) &&
    Number.isInteger(num)
  );
};

const isInvalidNonEmptyArray = (arr) => {
  return !(Array.isArray(arr) && arr.length !== 0);
};

const isInvalidObject = (obj) => {
  return !(!Array.isArray(obj) && typeof obj === "object");
};

const isInvalidObjectID = (id) => {
  return isInvalidString(id) || !ObjectId.isValid(id.trim());
};

const isInvalidStateCode = (state) => {
  return !(US_STATE_CODES.includes(state.trim().toUpperCase()));
};

export {
  isInvalidString,
  isInvalidInteger,
  isInvalidNonEmptyArray,
  isInvalidObject,
  isInvalidObjectID,
  isInvalidStateCode,
};
