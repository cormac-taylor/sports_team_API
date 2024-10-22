import {
  createTeam,
  getAllTeams,
  getTeamById,
  removeTeam,
  updateTeam,
} from "./teams.js";
import {
  createGame,
  getAllGames,
  getGame,
  updateGame,
  removeGame,
} from "./games.js";

export const teamData = {
  createTeam,
  getAllTeams,
  getTeamById,
  removeTeam,
  updateTeam,
};
export const gameData = {
  createGame,
  getAllGames,
  getGame,
  updateGame,
  removeGame,
};
