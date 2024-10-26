/*
 * Cormac Taylor
 * I pledge my honor that I have abided by the Stevens Honor System.
 */
import { teams } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import { isInvalidObjectID, validateArgs } from "../helpers.js";

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
  validateArgs(
    name,
    sport,
    yearFounded,
    city,
    state,
    stadium,
    championshipsWon,
    players
  );

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

  return await getTeamById(newId);
};

const getAllTeams = async () => {
  const teamsCollection = await teams();
  let teamList = await teamsCollection
    .find({})
    .project({ _id: 1, name: 1 })
    .toArray();
  if (!teamList) throw "could not get all teams.";

  // teamList = teamList.map((elm) => {
  //   elm._id = elm._id.toString();
  //   return elm;
  // });
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

  // team._id = team._id.toString();
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

  if (!deletionInfo) throw `could not delete team with id ${id}.`;

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

  validateArgs(
    name,
    sport,
    yearFounded,
    city,
    state,
    stadium,
    championshipsWon,
    players
  );

  id = id.trim();
  const { winLossCount, games } = await getTeamById(id);

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
    updatedTeam,
    { returnDocument: "after" }
  );

  if (!updateInfo) throw "could not update team.";

  return updateInfo;
};

export { createTeam, getAllTeams, getTeamById, removeTeam, updateTeam };
