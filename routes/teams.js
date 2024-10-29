/*
 * Cormac Taylor
 * I pledge my honor that I have abided by the Stevens Honor System.
 */
import { Router } from "express";
const router = Router();
import {
  createTeam,
  getAllTeams,
  getTeamById,
  removeTeam,
  updateTeam,
} from "../data/teams.js";
import {
  isInvalidInteger,
  isInvalidStateCode,
  isInvalidString,
  isInvalidPlayersArr,
  isInvalidObjectID,
} from "../helpers.js";

router
  .route("/")
  .get(async (_, res) => {
    try {
      const teamList = await getAllTeams();
      const teamListProj = teamList.map((obj) => {
        return { _id: obj._id, name: obj.name };
      });
      return res.json(teamListProj);
    } catch (e) {
      return res.status(404).send(e);
    }
  })
  .post(async (req, res) => {
    const teamData = req.body;
    if (!teamData || Object.keys(teamData).length === 0) {
      return res
        .status(400)
        .json({ error: "There are no fields in the request body" });
    }

    try {
      if (isInvalidString(teamData.name)) throw "name is an invalid string";
      teamData.name = teamData.name.trim();

      if (isInvalidString(teamData.sport)) throw "sport is an invalid string";
      teamData.sport = teamData.sport.trim();

      if (
        isInvalidInteger(teamData.yearFounded) ||
        teamData.yearFounded < 1850 ||
        teamData.yearFounded > new Date().getFullYear()
      )
        throw "yearFounded is an invalid integer year";

      if (isInvalidString(teamData.city)) throw "city is an invalid string";
      teamData.city = teamData.city.trim();

      if (isInvalidStateCode(teamData.state))
        throw "state is an invalid US state code";
      teamData.state = teamData.state.trim().toUpperCase();

      if (isInvalidString(teamData.stadium))
        throw "stadium is an invalid string";
      teamData.stadium = teamData.stadium.trim();

      if (
        isInvalidInteger(teamData.championshipsWon) ||
        teamData.championshipsWon < 0
      )
        throw "championshipsWon should be a non-negative integer";

      if (isInvalidPlayersArr(teamData.players))
        throw "players is an invalid player array";
    } catch (e) {
      return res.status(400).json({ error: e });
    }

    try {
      const {
        name,
        sport,
        yearFounded,
        city,
        state,
        stadium,
        championshipsWon,
        players,
      } = teamData;
      const newTeam = await createTeam(
        name,
        sport,
        yearFounded,
        city,
        state,
        stadium,
        championshipsWon,
        players
      );
      return res.json(newTeam);
    } catch (e) {
      return res.status(500).json({ error: e });
    }
  });

router
  .route("/:teamId")
  .get(async (req, res) => {
    try {
      if (isInvalidObjectID(req.params.teamId)) {
        throw "teamId must be a a valid object ID.";
      }
      req.params.teamId = req.params.teamId.trim();
    } catch (e) {
      return res.status(400).json({ error: e });
    }

    try {
      const team = await getTeamById(req.params.teamId);
      return res.json(team);
    } catch (e) {
      return res.status(404).json(e);
    }
  })
  .put(async (req, res) => {
    try {
      if (isInvalidObjectID(req.params.teamId)) {
        throw "teamId must be a a valid object ID.";
      }
      req.params.teamId = req.params.teamId.trim();
    } catch (e) {
      return res.status(400).json({ error: e });
    }

    const teamData = req.body;
    if (!teamData || Object.keys(teamData).length === 0) {
      return res
        .status(400)
        .json({ error: "There are no fields in the request body" });
    }

    try {
      if (isInvalidString(teamData.name)) throw "name is an invalid string";
      teamData.name = teamData.name.trim();

      if (isInvalidString(teamData.sport)) throw "sport is an invalid string";
      teamData.sport = teamData.sport.trim();

      if (
        isInvalidInteger(teamData.yearFounded) ||
        teamData.yearFounded < 1850 ||
        teamData.yearFounded > new Date().getFullYear()
      )
        throw "yearFounded is an invalid integer year";

      if (isInvalidString(teamData.city)) throw "city is an invalid string";
      teamData.city = teamData.city.trim();

      if (isInvalidStateCode(teamData.state))
        throw "state is an invalid US state code";
      teamData.state = teamData.state.trim().toUpperCase();

      if (isInvalidString(teamData.stadium))
        throw "stadium is an invalid string";
      teamData.stadium = teamData.stadium.trim();

      if (
        isInvalidInteger(teamData.championshipsWon) ||
        teamData.championshipsWon < 0
      )
        throw "championshipsWon should be a non-negative integer";

      if (isInvalidPlayersArr(teamData.players))
        throw "players is an invalid player array";
    } catch (e) {
      return res.status(400).json({ error: e });
    }

    try {
      const {
        name,
        sport,
        yearFounded,
        city,
        state,
        stadium,
        championshipsWon,
        players,
      } = teamData;
      const newTeam = await updateTeam(
        req.params.teamId,
        name,
        sport,
        yearFounded,
        city,
        state,
        stadium,
        championshipsWon,
        players
      );
      return res.json(newTeam);
    } catch (e) {
      return res.status(404).json({ error: e });
    }
  })
  .delete(async (req, res) => {
    try {
      if (isInvalidObjectID(req.params.teamId)) {
        throw "teamId must be a a valid object ID.";
      }
      req.params.teamId = req.params.teamId.trim();
    } catch (e) {
      return res.status(400).json({ error: e });
    }

    try {
      const team = await removeTeam(req.params.teamId);
      return res.json(team);
    } catch (e) {
      return res.status(404).json(e);
    }
  });

export default router;
