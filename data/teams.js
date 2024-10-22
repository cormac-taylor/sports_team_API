// This data file should export all functions using the ES6 standard as shown in the lecture code
import { teams } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import {
  isInvalidString,
  isInvalidInteger,
  isInvalidNonEmptyArray,
  isInvalidObject,
  isInvalidObjectID,
  isInvalidStateCode,
} from "../helpers.js";

const createTeam = async (
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

  if (
    isInvalidString(state) ||
    state.trim().length !== 2 ||
    isInvalidStateCode(state)
  )
    throw "state must be a valid US state code.";

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

  const newTeam = {
    name: name.trim(),
    sport: sport.trim(),
    yearFounded,
    city: city.trim(),
    state: state.trim().toUpperCase(),
    stadium: stadium.trim(),
    championshipsWon,
    players,
    winLossCount: "0-0",
    games: [],
  };

  const teamsCollection = await teams();
  const insertInfo = await teamsCollection.insertOne(newTeam);

  if (!insertInfo.acknowledged || !insertInfo.insertedId)
    throw "could not add team.";

  const newId = insertInfo.insertedId.toString();

  return getTeamById(newId);
};

const getAllTeams = async () => {
  const teamsCollection = await teams();
  let teamList = await teamsCollection
    .find({})
    .project({ _id: 1, name: 1 })
    .toArray();
  if (!teamList) throw "could not get all teams.";

  teamList = teamList.map((elm) => {
    elm._id = elm._id.toString();
    return elm;
  });
  return teamList;
};

const getTeamById = async (id) => {
  if (isInvalidObjectID(id))
    throw "id must contain be a string of least one non-space character and a valid object ID.";

  id = id.trim();

  const teamsCollection = await teams();
  const team = await teamsCollection.findOne({
    _id: ObjectId.createFromHexString(id),
  });

  if (team === null) throw "No team with that id.";

  team._id = team._id.toString();
  return team;
};

const removeTeam = async (id) => {
  if (isInvalidObjectID(id))
    throw "id must contain be a string of least one non-space character and a valid object ID.";

  id = id.trim();

  const teamsCollection = await teams();
  const deletionInfo = await teamsCollection.findOneAndDelete({
    _id: ObjectId.createFromHexString(id),
  });

  if (!deletionInfo) {
    throw `could not delete team with id ${id}.`;
  }

  return `${deletionInfo.name} have been successfully deleted!`;
};

const updateTeam = async (
  id,
  name,
  sport,
  yearFounded,
  city,
  state,
  stadium,
  championshipsWon,
  players
) => {
  if (isInvalidObjectID(id))
    throw "id must contain be a string of least one non-space character and a valid object ID.";

  if (
    isInvalidString(name) ||
    isInvalidString(sport) ||
    isInvalidString(city) ||
    isInvalidString(stadium)
  )
    throw "name, sport, city, and stadium must all be strings of least one non-space character.";

  if (
    isInvalidString(state) ||
    state.trim().length !== 2 ||
    isInvalidStateCode(state)
  )
    throw "state must be a valid US state code.";

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

  id = id.trim();
  const { winLossCount, games } = getTeamById(id);

  const updatedTeam = {
    name: name.trim(),
    sport: sport.trim(),
    yearFounded,
    city: city.trim(),
    state: state.trim().toUpperCase(),
    stadium: stadium.trim(),
    championshipsWon,
    players,
    winLossCount,
    games,
  };

  const teamsCollection = await teams();
  const updateInfo = await teamsCollection.findOneAndReplace(
    { _id: ObjectId.createFromHexString(id) },
    updatedPostData,
    { returnDocument: "after" }
  );

  if (!updateInfo) throw "could not update team.";

  return updateInfo;
};

export { createTeam, getAllTeams, getTeamById, removeTeam, updateTeam };
