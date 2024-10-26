// Import the express router as shown in the lecture code
// Note: please do not forget to export the router!

router
  .route('/')
  .get(async (req, res) => {
    //code here for GET
  })
  .post(async (req, res) => {
    //code here for POST
  });

router
  .route('/:teamId')
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
import { createTeam, getAllTeams, getTeamById, removeTeam, updateTeam } from "../data/teams.js";
import {  } from "../helpers.js";

// Note: please do not forget to export the router!

router
  .route('/')
  get(async (_, res) => {
    try {
      const authorList = await getAuthors();
      return res.json(authorList);
    } catch (e) {
      return res.status(500).send(e);
    }
  })
  .post(async (req, res) => {
    //code here for POST
  });

router
  .route('/:teamId')
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
