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
  getTeamByGameID,
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
    let teamSport;
    try {
      const { yearFounded, sport } = await getTeamById(req.params.teamId);
      teamYearFounded = yearFounded;
      teamSport = sport;
    } catch (e) {
      return res.status(404).json({ error: e });
    }

    try {
      if (isInvalidObjectID(teamData.opposingTeamId))
        throw "opposingTeamId is invalid objectID";

      if (req.params.teamId === teamData.opposingTeamId)
        throw "team cannot play itself.";

      const { yearFounded: oppYearFounded, sport: oppSport } = await getTeamById(
        teamData.opposingTeamId
      );

      if (teamSport.toLowerCase() !== oppSport.toLowerCase()) {
        throw "a game must be played between two teams of the same sport";
      }    

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
    try {
      if (isInvalidObjectID(req.params.gameId)) {
        throw "teamId must be a a valid object ID.";
      }
      req.params.gameId = req.params.gameId.trim();
    } catch (e) {
      return res.status(400).json({ error: e });
    }

    const gameData = req.body;
    if (!gameData || Object.keys(gameData).length === 0) {
      return res
        .status(400)
        .json({ error: "There are no fields in the request body" });
    }

    let oldGame;
    try {
      oldGame = await getGame(req.params.gameId);
      if (!oldGame) throw "game doesn't exist";
    } catch (e) {
      return res.status(404).json({ error: e });
    }

    let updateData = {};
    try {
      let oppObj = await getTeamById(oldGame.opposingTeamId);
      const teamObj = await getTeamByGameID(req.params.gameId);

      if (gameData.opposingTeamId) {
        gameData.opposingTeamId = gameData.opposingTeamId.trim();

        if (isInvalidObjectID(gameData.opposingTeamId))
          throw "opposingTeamId must contain be a string of least one non-space character and a valid object ID.";

        if (teamObj._id.toString() === gameData.opposingTeamId)
          throw "team cannot play itself";

        try {
          oppObj = await getTeamById(gameData.opposingTeamId);
        } catch (e) {
          throw `opposingTeamId: ${e}`;
        }

        if (teamObj.sport.toLowerCase() !== oppObj.sport.toLowerCase()) {
          throw "a game must be played between two teams of the same sport";
        }
      
        updateData.opposingTeamId = gameData.opposingTeamId;
      }

      if (gameData.gameDate) {
        gameData.gameDate = gameData.gameDate.trim();
        if (
          isInvalidDate(
            gameData.gameDate,
            teamObj.yearFounded,
            oppObj.yearFounded
          )
        )
          throw "new gameDate is invalid";
        updateData.gameDate = gameData.gameDate;
      }

      if (gameData.homeOrAway) {
        gameData.homeOrAway = gameData.homeOrAway.trim();
        if (
          isInvalidString(gameData.homeOrAway) ||
          (gameData.homeOrAway !== "Home" && gameData.homeOrAway !== "Away")
        )
          throw "homeOrAway can only be the follow case sensitive values: Home or Away";
        updateData.homeOrAway = gameData.homeOrAway;
      }

      if (gameData.finalScore) {
        gameData.finalScore = gameData.finalScore.trim();
        if (isInvalidFinalScore(gameData.finalScore))
          throw "finalScore must be a string of form score1-score2 where scoreX is non-negative and different.";
        updateData.finalScore = gameData.finalScore;
      }

      if (gameData.win !== undefined) {
        if (isInvalidBoolean(gameData.win)) throw "win must be a boolean.";
        updateData.win = gameData.win;
      }
    } catch (e) {
      return res.status(400).json({ error: e });
    }

    try {
      const newGame = await updateGame(req.params.gameId, updateData);
      return res.json(newGame);
    } catch (e) {
      return res.status(500).json({ error: e });
    }
  })
  .delete(async (req, res) => {
    try {
      if (isInvalidObjectID(req.params.gameId)) {
        throw "gameId must be a a valid object ID.";
      }
      req.params.gameId = req.params.gameId.trim();
    } catch (e) {
      return res.status(400).json({ error: e });
    }

    try {
      const team = await removeGame(req.params.gameId);
      return res.json(team);
    } catch (e) {
      return res.status(404).json(e);
    }
  });

export default router;
