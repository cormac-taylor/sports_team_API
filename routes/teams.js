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
import {} from "../helpers.js";

// Note: please do not forget to export the router!

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
    blogPostData.title = validation.checkString(blogPostData.title, "Title");
    blogPostData.body = validation.checkString(blogPostData.body, "Body");
    blogPostData.posterId = validation.checkId(
      blogPostData.posterId,
      "Poster ID"
    );
    if (blogPostData.tags) {
      blogPostData.tags = validation.checkStringArray(
        blogPostData.tags,
        "Tags"
      );
    }
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
