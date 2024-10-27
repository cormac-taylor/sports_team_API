// router
//   .route("/game/:gameId")
//   .get(async (req, res) => {
//     //code here for GET
//   })
//   .patch(async (req, res) => {
//     //code for PATCH
//   })
//   .delete(async (req, res) => {
//     //code here for DELETE
//   });

/*
 * Cormac Taylor
 * I pledge my honor that I have abided by the Stevens Honor System.
 */
import { Router } from "express";
const router = Router();
import {
  createGame,
  getAllGames,
  getGame,
  updateGame,
  removeGame,
} from "../data/games.js";
import {
  isInvalidBoolean,
  isInvalidDate,
  isInvalidFinalScore,
  isInvalidObjectID,
  isInvalidString,
} from "../helpers.js";
import { getTeamById } from "../data/teams.js";

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
      const gameList = await getAllGames(req.params.teamId);
      return res.json(gameList);
    } catch (e) {
      return res.status(404).json(e);
    }
  })
  .post(async (req, res) => {
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

    let teamYearFounded;
    try {
      const { yearFounded } = await getTeamById(req.params.teamId);
      teamYearFounded = yearFounded;
    } catch (e) {
      return res.status(404).json({ error: e });
    }

    try {
      if (isInvalidObjectID(teamData.opposingTeamId))
        throw "opposingTeamId is invalid objectID";

      if (req.params.teamId === teamData.opposingTeamId)
        throw "team cannot play itself.";

      const { yearFounded: oppYearFounded } = await getTeamById(
        teamData.opposingTeamId
      );

      if (isInvalidDate(teamData.gameDate, teamYearFounded, oppYearFounded))
        throw "gameDate is an invalid date";
      teamData.gameDate = teamData.gameDate.trim();

      teamData.homeOrAway = teamData.homeOrAway.trim();
      if (
        isInvalidString(teamData.homeOrAway) ||
        (teamData.homeOrAway !== "Home" && teamData.homeOrAway !== "Away")
      )
        throw "homeOrAway is not Home or Away";

      if (isInvalidFinalScore(teamData.finalScore))
        throw "finalScore is invalid";
      teamData.finalScore = teamData.finalScore.trim();

      if (isInvalidBoolean(teamData.win)) throw "win must be a boolean";
    } catch (e) {
      return res.status(400).json({ error: e });
    }

    try {
      const { gameDate, opposingTeamId, homeOrAway, finalScore, win } =
        teamData;
      const newGame = await createGame(
        req.params.teamId,
        gameDate,
        opposingTeamId,
        homeOrAway,
        finalScore,
        win
      );
      return res.json(newGame);
    } catch (e) {
      return res.status(500).json({ error: e });
    }
  });

router
  .route("/game/:gameId")
  .get(async (req, res) => {
    try {
      if (isInvalidObjectID(req.params.gameId)) {
        throw "gameId must be a a valid object ID.";
      }
      req.params.gameId = req.params.gameId.trim();
    } catch (e) {
      return res.status(400).json({ error: e });
    }
    try {
      const game = await getGame(req.params.gameId);
      return res.json(game);
    } catch (e) {
      return res.status(404).json(e);
    }
  })
  .patch(async (req, res) => {
    //code for PATCH
  })
  .delete(async (req, res) => {
    //code here for DELETE
  });

export default router;
