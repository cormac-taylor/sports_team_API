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
    } catch (e) {
      return res.status(404).json({ error: e });
    }

    let updateData = {};
    try {

      let oppObj = await getTeamById(oldGame.opposingTeamId);

      const teamsCollection = await teams();
      const teamObj = await teamsCollection.findOne({
        "games._id": ObjectId.createFromHexString(req.params.gameId),
      });
      if (!teamObj) throw "gameId not found.";

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
    
        if (oppObj.sport.toLowerCase() !== teamObj.sport.toLowerCase())
          throw "teams must play the same sport";
    
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
          gameData.homeOrAway !== "Home" ||
          gameData.homeOrAway !== "Away"
        )
          throw 'homeOrAway can only be the follow case sensitive values: "Home" or "Away"';
          updateData.homeOrAway = gameData.homeOrAway;
    
      }
  
      if (gameData.finalScore) {
        gameData.finalScore = gameData.finalScore.trim();
        if (isInvalidFinalScore(finalScore))
          throw "finalScore must be a string of form score1-score2 where scoreX is non-negative and different.";
        updateData.finalScore = gameData.finalScore;
    
      }
  



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



      
    if (updateObject.finalScore) {
      updateObject.finalScore = updateObject.finalScore.trim();
      if (isInvalidFinalScore(finalScore))
        throw "finalScore must be a string of form score1-score2 where scoreX is non-negative and different.";
      updateGameObj.finalScore = updateObject.finalScore;
  
    }
  
    if (updateObject.win !== undefined) {
      if (isInvalidBoolean(updateObject.win)) throw "win must be a boolean.";
  
      if (updateObject.win !== gameObj.win) {
        let newRecord = subFromRecord(gameObj.winLossCount, gameObj.win);
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
  
    let newGame = await teamsCollection.findOneAndUpdate(
      { _id: ObjectId.createFromHexString(gameId) },
      { $set: updateGameObj },
      { returnDocument: "after" }
    );
    if (!newGame) throw "Could not update game.";
  
    const updatedTeam = await getTeamById(teamObj._id.toString());
    return updatedTeam;
  







    try {
      const newGame = await updateGame(req.params.teamId, updateData);
      return res.json(newGame);
    } catch (e) {
      return res.status(500).json({ error: e });
    }
  })
  .delete(async (req, res) => {
    //code here for DELETE
  });

export default router;
