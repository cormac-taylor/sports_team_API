router
  .route("/")
  .get(async (req, res) => {
    //code here for GET
  })
  .post(async (req, res) => {
    //code here for POST
  });

router
  .route("/:teamId")
  .get(async (req, res) => {
    //code here for GET
  })
  .delete(async (req, res) => {
    //code here for DELETE
  })
  .put(async (req, res) => {
    //code here for PUT
  });

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
import { isInvalidInteger, isInvalidStateCode, isInvalidString, isInvalidPlayersArr } from "../helpers.js";

router.route("/");
get(async (_, res) => {
  try {
    const teamList = await getAllTeams();
    const teamListProj = teamList.map((obj) => {
      return { _id: obj._id, name: obj.name };
    });
    return res.json(teamListProj);
  } catch (e) {
    return res.status(500).send(e);
  }
}).post(async (req, res) => {
  const teamData = req.body;
  if (!teamData || Object.keys(teamData).length === 0) {
    return res
      .status(400)
      .json({ error: "There are no fields in the request body" });
  }

  // TO DO
  //check all inputs, that should respond with a 400
  try {
    if (isInvalidString(teamData.name)) 
      throw "name is an invalid string"
    teamData.name = teamData.name.trim()

    if (isInvalidString(teamData.sport)) 
      throw "sport is an invalid string"
    teamData.sport = teamData.sport.trim()

    teamData.yearFounded = teamData.yearFounded.trim()
    if (!isNaN(teamData.yearFounded)) {
      teamData.yearFounded = parseInt(teamData.yearFounded)
    }
    if (isInvalidInteger(teamData.yearFounded)) 
      throw "yearFounded is an invalid integer year"

    if (isInvalidString(teamData.city)) 
      throw "city is an invalid string"
    teamData.city = teamData.city.trim()

    if (isInvalidStateCode(teamData.state)) 
      throw "state is an invalid string"
    teamData.state = teamData.state.trim().toUpperCase()

    if (isInvalidString(teamData.stadium)) 
      throw "sport is an invalid string"
    teamData.stadium = teamData.stadium.trim()

    teamData.championshipsWon = teamData.championshipsWon.trim()
    if (!isNaN(teamData.championshipsWon)) {
      teamData.championshipsWon = parseInt(teamData.championshipsWon)
    }
    if (isInvalidInteger(teamData.championshipsWon)) 
      throw "yearFounded is an invalid integer year"

    teamData.players = JSON.parse(teamData.players)
    if (isInvalidPlayersArr(teamData.players)) 
      throw "players is an invalid player array"
    
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
      if (!isValidString(req.params.id)) {
        throw "id must be a String containing >1 non-space chars.";
      }
      req.params.id = req.params.id.trim();
    } catch (e) {
      return res.status(400).json({ error: e });
    }
    try {
      const author = await getAuthorById(req.params.id);
      return res.json(author);
    } catch (e) {
      return res.status(404).json(e);
    }
  })
  .delete(async (req, res) => {
    //code here for DELETE
  })
  .put(async (req, res) => {
    //code here for PUT
  });

export default router;
