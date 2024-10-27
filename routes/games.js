// router
//   .route("/:teamId")
//   .get(async (req, res) => {
//     //code here for GET
//   })
//   .post(async (req, res) => {
//     //code here for POST
//   });

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
import { isInvalidBoolean, isInvalidDate, isInvalidFinalScore, isInvalidObjectID } from "../helpers.js";

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

    try {
      if (isInvalidObjectID(teamData.opposingTeamId))
        throw "opposingTeamId is invalid objectID";

      // get team and opp yearFounded

      // TO DO
      if (isInvalidDate(teamData.name, , )) throw "name is an invalid string";
      teamData.name = teamData.name.trim();

      if (isInvalidString(teamData.sport)) throw "sport is an invalid string";
      teamData.sport = teamData.sport.trim();

      if (isInvalidInteger(teamData.championshipsWon))
        throw "championshipsWon should be a non-negative integer";

      if (isInvalidFinalScore(teamData.finalScore)) throw "finalScore is invalid";
      teamData.finalScore = teamData.finalScore.trim();

      if(isInvalidBoolean(teamData.win))
        throw "win must be a boolean"
    } catch (e) {
      return res.status(400).json({ error: e });
    }

    try {
      const { teamId, gameDate, opposingTeamId, homeOrAway, finalScore, win } =
        teamData;
      const newGame = await createGame(
        teamId,
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

// router
//   .route("/game/:gameId")
//   .get(async (req, res) => {
//     try {
//       if (!isValidString(req.params.id)) {
//         throw "id must be a String containing >1 non-space chars.";
//       }
//       req.params.id = req.params.id.trim();
//     } catch (e) {
//       return res.status(400).json({ error: e });
//     }
//     try {
//       const book = await getBookById(req.params.id);
//       return res.json(book);
//     } catch (e) {
//       return res.status(404).json(e);
//     }
//   })
//   .patch(async (req, res) => {
//     //code for PATCH
//   })
//   .delete(async (req, res) => {
//     //code here for DELETE
//   });

export default router;
