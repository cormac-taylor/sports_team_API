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
];

const isInvalidString = (str) => {
  return typeof str !== "string" || str.trim().length === 0;
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

const isInvalidArray = (arr) => {
  return !Array.isArray(arr);
};

const isInvalidNonEmptyArray = (arr) => {
  return isInvalidArray(arr) || arr.length === 0;
};

const isInvalidObject = (obj) => {
  return Array.isArray(obj) || typeof obj !== "object";
};

const isInvalidNonEmptyObject = (obj) => {
  return isInvalidObject(obj) || Object.keys(obj).length === 0;
};

const isInvalidObjectID = (id) => {
  return isInvalidString(id) || !ObjectId.isValid(id.trim());
};

const isInvalidStateCode = (state) => {
  state = state.trim();
  return (
    isInvalidString(state) ||
    state.length !== 2 ||
    !US_STATE_CODES.includes(state.toUpperCase())
  );
};

const isInvalidPlayersArr = (players) => {
  for (let i = 0; i < players.length; i++) {
    if (isInvalidObject(players[i])) throw "players must only contain objects.";

    if (Object.keys(players[i]).length !== 3)
      throw "each object must have 3 elements.";

    for (const key of ["firstName", "lastName", "position"]) {
      if (isInvalidString(players[i][key]))
        throw "each object must have 3 keys (firstName,lastName,position) and each of their values must be strings.";
    }
  }
};

const isInvalidDate = (date, teamFounded, oppFounded) => {
  if (isInvalidString(date)) return true;

  date = date.trim();
  if (date.length !== 10 || date[2] !== "/" || date[5] !== "/") return true;

  for (let i = 0; i < date.length; i++) {
    const c = date[i];
    if (!(c === "/" || ("0" <= c && c <= "9"))) return true;
  }
  const dateArr = date.split("/");
  if (dateArr.length !== 3) return true;

  let month = parseInt(dateArr[0]);
  let day = parseInt(dateArr[1]);
  let year = parseInt(dateArr[2]);

  const currentDate = new Date();
  if (
    year < 1850 ||
    year > currentDate.getFullYear() ||
    month < 1 ||
    month > 12 ||
    day < 1
  )
    return true;

  if (year < teamFounded || year < oppFounded) return true;

  if (
    year === currentDate.getFullYear() &&
    (month > currentDate.getMonth() + 1 ||
      (month === currentDate.getMonth() + 1 && day > currentDate.getDate()))
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
  for (let i = 0; i < score.length; i++) {
    const c = score[i];
    if (!(c === "-" || ("0" <= c && c <= "9"))) return true;
  }

  const scoreArr = score.split("-");
  if (scoreArr.length !== 2) return true;

  let home = parseInt(scoreArr[0]);
  let away = parseInt(scoreArr[1]);

  return home < 0 || away < 0 || home === away;
};

const addToRecord = (winLossCount, win) => {
  let winLossArr = winLossCount.split("-");

  let wins = parseInt(winLossArr[0]);
  let losses = parseInt(winLossArr[1]);

  win ? wins++ : losses++;

  return `${wins}-${losses}`;
};

const subFromRecord = (winLossCount, win) => {
  let winLossArr = winLossCount.split("-");

  let wins = parseInt(winLossArr[0]);
  let losses = parseInt(winLossArr[1]);

  win ? wins-- : losses--;

  return `${wins}-${losses}`;
};

const validateArgs = (
  name,
  sport,
  yearFounded,
  city,
  state,
  stadium,
  championshipsWon,
  players
) => {
  if (
    isInvalidString(name) ||
    isInvalidString(sport) ||
    isInvalidString(city) ||
    isInvalidString(stadium)
  )
    throw "name, sport, city, and stadium must all be strings of least one non-space character.";

  if (isInvalidStateCode(state)) throw "state must be a valid US state code.";

  if (
    isInvalidInteger(yearFounded) ||
    yearFounded < 1850 ||
    yearFounded > new Date().getFullYear()
  )
    throw `yearFounded must be a whole number between 1850 and ${new Date().getFullYear()} (inclusive).`;

  if (isInvalidInteger(championshipsWon) || championshipsWon < 0)
    throw "yearFounded must be a non-negative whole number.";

  if (isInvalidNonEmptyArray(players))
    throw "players must be a non-empty array.";

  for (let i = 0; i < players.length; i++) {
    if (isInvalidObject(players[i])) throw "players must only contain objects.";

    if (Object.keys(players[i]).length !== 3)
      throw "each object must have 3 elements.";

    for (const key of ["firstName", "lastName", "position"]) {
      if (isInvalidString(players[i][key]))
        throw "each object must have 3 keys (firstName,lastName,position) and each of their values must be strings.";
      else players[i][key] = players[i][key].trim();
    }
  }
};

export {
  isInvalidString,
  isInvalidInteger,
  isInvalidBoolean,
  isInvalidArray,
  isInvalidNonEmptyArray,
  isInvalidObject,
  isInvalidNonEmptyObject,
  isInvalidObjectID,
  isInvalidStateCode,
  isInvalidPlayersArr,
  isInvalidDate,
  isInvalidFinalScore,
  addToRecord,
  subFromRecord,
  validateArgs,
};
