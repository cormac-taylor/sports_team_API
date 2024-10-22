// This data file should export all functions using the ES6 standard as shown in the lecture code

import { teams } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import { getTeamById } from "./teams.js";
import {
  isInvalidString,
  isInvalidInteger,
  isInvalidNonEmptyArray,
  isInvalidObject,
  isInvalidObjectID,
  isInvalidDate,
  isInvalidFinalScore,
  isInvalidBoolean,
  updateRecord,
} from "../helpers.js";

const createGame = async (
  teamId,
  gameDate,
  opposingTeamId,
  homeOrAway,
  finalScore,
  win
) => {
  if (isInvalidObjectID(teamId))
    throw "teamId must be a string of least one non-space character and a valid object ID.";

  if (isInvalidDate(gameDate)) {
    throw "date must be a string of form mm/dd/yyyy.";
  }

  if (isInvalidObjectID(opposingTeamId))
    throw "opposingTeamId must contain be a string of least one non-space character and a valid object ID.";

  if (homeOrAway !== "Home" || homeOrAway !== "Away")
    throw 'homeOrAway can only be the follow case sensitive values: "Home" or "Away"';

  if (isInvalidFinalScore(finalScore)) {
    throw "finalScore must be a string of form score1-score2 where scoreX is non-negative and different.";
  }

  if (isInvalidBoolean(win)) {
    throw "win must be a boolean.";
  }

  (teamId = teamId.trim()), (opposingTeamId = opposingTeamId.trim());

  try {
    const teamObj = await getTeamById(teamId);
  } catch (e) {
    throw `teamId: ${e}`;
  }

  try {
    const { sport: oppSport } = await getTeamById(opposingTeamId);
  } catch (e) {
    throw `opposingTeamId: ${e}`;
  }

  if (teamObj.sport.toLowerCase() !== oppSport.toLowerCase()) {
    throw "a game must be played between two teams of the same sport";
  }

  const newGame = {
    _id: new ObjectId(),
    teamId,
    gameDate: gameDate.trim(),
    opposingTeamId,
    homeOrAway: homeOrAway.trim(),
    finalScore: teamId.trim(),
    win,
  };

  teamObj.games.push(newGame)
  teamObj.winLossCount = updateRecord(teamObj.winLossCount, newGame.win)

  const teamsCollection = await teams();
  const updateInfo = await teamsCollection.findOneAndReplace(
    { _id: ObjectId.createFromHexString(teamId) },
    teamObj,
    { returnDocument: "after" }
  );

  if (!updateInfo) throw "could not update team.";

  return updateInfo;
};

const getAllGames = async (teamId) => {};

const getGame = async (gameId) => {};

const updateGame = async (gameId, updateObject) => {};

const removeGame = async (gameId) => {};

export  { createGame, getAllGames, getGame, updateGame, removeGame }