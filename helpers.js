/*
 * Cormac Taylor
 * I pledge my honor that I have abided by the Stevens Honor System.
 */

let isValidNumber = (num) => {
  return typeof num === "number" && !isNaN(num) && isFinite(num);
};

const isValidString = (str) => {
  return typeof str === "string" && str.trim().length > 0;
};

let isValidArray = (arr) => {
  return Array.isArray(arr);
};

let isValidNonEmptyArray = (arr) => {
  return isValidArray(arr) && arr.length !== 0;
};

let isValidObject = (obj) => {
  return !Array.isArray(obj) && typeof obj === "object";
};

let isValidNonEmptyObject = (obj) => {
  return isValidObject(obj) && Object.keys(obj).length !== 0;
};

let isValidFunction = (func) => {
  return typeof func === "function";
};

export {
  isValidNumber,
  isValidString,
  isValidArray,
  isValidNonEmptyArray,
  isValidObject,
  isValidNonEmptyObject,
  isValidFunction,
};
