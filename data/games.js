/*
 * Cormac Taylor
 * I pledge my honor that I have abided by the Stevens Honor System.
 */
import { teams } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import { getTeamById } from "./teams.js";
import {
  isInvalidNonEmptyObject,
  isInvalidObjectID,
  isInvalidDate,
  isInvalidFinalScore,
  isInvalidBoolean,
  addToRecord,
  subFromRecord,
  isInvalidString,
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

  if (isInvalidObjectID(opposingTeamId))
    throw "opposingTeamId must contain be a string of least one non-space character and a valid object ID.";

  if (
    isInvalidString(homeOrAway) ||
    (homeOrAway.trim() !== "Home" && homeOrAway.trim() !== "Away")
  )
    throw "homeOrAway can only be the follow case sensitive values: Home or Away";

  if (isInvalidFinalScore(finalScore)) {
    throw "finalScore must be a string of form score1-score2 where scoreX is non-negative and different.";
  }

  if (isInvalidBoolean(win)) {
    throw "win must be a boolean.";
  }

  (teamId = teamId.trim()), (opposingTeamId = opposingTeamId.trim());

  if (teamId === opposingTeamId) throw "team cannot play itself";

  let teamObj;
  try {
    const team = await getTeamById(teamId);
    teamObj = team;
  } catch (e) {
    throw `teamId: ${e}`;
  }

  let oppFounded;
  let oppSport;
  try {
    const { yearFounded, sport } = await getTeamById(opposingTeamId);
    oppFounded = yearFounded;
    oppSport = sport;
  } catch (e) {
    throw `opposingTeamId: ${e}`;
  }

  if (isInvalidDate(gameDate, teamObj.yearFounded, oppFounded)) {
    throw "date must be a string of form mm/dd/yyyy played after year 1850 and before today (inclusive) and both teams must be founded.";
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
    finalScore: finalScore.trim(),
    win,
  };

  teamObj.games.push(newGame);
  teamObj.winLossCount = addToRecord(teamObj.winLossCount, newGame.win);

  const teamsCollection = await teams();
  const updateInfo = await teamsCollection.findOneAndReplace(
    { _id: ObjectId.createFromHexString(teamId) },
    teamObj,
    { returnDocument: "after" }
  );

  if (!updateInfo) throw "could not update team.";

  return updateInfo;
};

const getAllGames = async (teamId) => {
  if (isInvalidObjectID(teamId))
    throw "teamId must be a string of least one non-space character and a valid object ID.";

  const { games } = await getTeamById(teamId);
  return games;
};

const getGame = async (gameId) => {
  if (isInvalidObjectID(gameId))
    throw "teamId must be a string of least one non-space character and a valid object ID.";

  const teamsCollection = await teams();
  const foundGame = await teamsCollection.findOne(
    { "games._id": ObjectId.createFromHexString(gameId) },
    { projection: { _id: 0, "games.$": 1 } }
  );

  if (!foundGame) throw "Game not found.";

  return foundGame.games[0];
};

const updateGame = async (gameId, updateObject) => {
  if (isInvalidObjectID(gameId))
    throw "teamId must be a string of least one non-space character and a valid object ID.";
  gameId = gameId.trim();

  if (isInvalidNonEmptyObject(updateObject))
    throw "updateObject must be an non-empty object.";

  const gameObj = await getGame(gameId);
  let oppObj = await getTeamById(gameObj.opposingTeamId);

  const teamObj = await getTeamByGameID(gameId);

  const updateGameObj = {};
  if (updateObject.opposingTeamId) {
    updateObject.opposingTeamId = updateObject.opposingTeamId.trim();

    if (isInvalidObjectID(updateObject.opposingTeamId))
      throw "opposingTeamId must contain be a string of least one non-space character and a valid object ID.";

    if (teamObj._id.toString() === updateObject.opposingTeamId)
      throw "team cannot play itself";

    try {
      oppObj = await getTeamById(updateObject.opposingTeamId);
    } catch (e) {
      throw `opposingTeamId: ${e}`;
    }

    if (oppObj.sport.toLowerCase() !== teamObj.sport.toLowerCase())
      throw "teams must play the same sport";

    updateGameObj.opposingTeamId = updateObject.opposingTeamId;
  }

  if (updateObject.gameDate) {
    updateObject.gameDate = updateObject.gameDate.trim();
    if (
      isInvalidDate(
        updateObject.gameDate,
        teamObj.yearFounded,
        oppObj.yearFounded
      )
    )
      throw "new gameDate is invalid";
    updateGameObj.gameDate = updateObject.gameDate;
  }

  if (updateObject.homeOrAway) {
    updateObject.homeOrAway = updateObject.homeOrAway.trim();
    if (
      updateObject.homeOrAway !== "Home" &&
      updateObject.homeOrAway !== "Away"
    )
      throw "homeOrAway can only be the follow case sensitive values: Home or Away";
    updateGameObj.homeOrAway = updateObject.homeOrAway;
  }

  if (updateObject.finalScore) {
    updateObject.finalScore = updateObject.finalScore.trim();
    if (isInvalidFinalScore(updateObject.finalScore))
      throw "finalScore must be a string of form score1-score2 where scoreX is non-negative and different.";
    updateGameObj.finalScore = updateObject.finalScore;
  }

  const teamsCollection = await teams();

  if (updateObject.win !== undefined) {
    if (isInvalidBoolean(updateObject.win)) throw "win must be a boolean.";

    if (updateObject.win !== gameObj.win) {
      let newRecord = subFromRecord(teamObj.winLossCount, gameObj.win);
      newRecord = addToRecord(newRecord, updateObject.win);

      let updateRecord = await teamsCollection.findOneAndUpdate(
        { _id: teamObj._id },
        { $set: { winLossCount: newRecord } },
        { returnDocument: "after" }
      );
      if (!updateRecord) throw "Could not update winLossCount in team.";
    }
    updateGameObj.win = updateObject.win;
  }

  for(const k of Object.keys(updateGameObj)){
    gameObj[k] = updateGameObj[k]
  }
  // credit to https://www.mongodb.com/community/forums/t/update-every-sub-document-in-sub-sub-array/209162
  const updatedTeam = await teamsCollection.findOneAndUpdate(
    // get team with game in question
    { "games._id": ObjectId.createFromHexString(gameId) },
    {
      // set all games matching filter to update obj
      $set: {
        "games.$[x]": gameObj,
      },
    },
    {
      // filter array for games which match the id
      arrayFilters: [{ "x._id": ObjectId.createFromHexString(gameId) }],
      returnDocument: "after",
    }
  );
  if (!updatedTeam) throw "Could not update game.";
  return updatedTeam;
};

const removeGame = async (gameId) => {
  if (isInvalidObjectID(gameId))
    throw "teamId must be a string of least one non-space character and a valid object ID.";

  const game = await getGame(gameId);
  const team = await getTeamByGameID(gameId);

  const teamsCollection = await teams();
  const removeGame = await teamsCollection.updateOne(
    { _id: team._id },
    {
      $pull: { games: { _id: ObjectId.createFromHexString(gameId) } },
      $set: { winLossCount: subFromRecord(team.winLossCount, game.win) },
    }
  );
  if (!removeGame) throw "Error removing the game.";

  return await getTeamById(team._id.toString());
};

const getTeamByGameID = async (gameId) => {
  if (isInvalidObjectID(gameId))
    throw "teamId must be a string of least one non-space character and a valid object ID.";

  gameId = gameId.trim();

  const teamsCollection = await teams();
  const team = await teamsCollection.findOne({
    "games._id": ObjectId.createFromHexString(gameId),
  });
  if (!team) throw "Game not found.";
  return team;
};

export {
  createGame,
  getAllGames,
  getGame,
  updateGame,
  removeGame,
  getTeamByGameID,
};
