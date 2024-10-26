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
import {} from "../helpers.js";

// router
//   .route("/:teamId")
//   .get(async (_, res) => {
//     try {
//       const bookList = await getBooks();
//       return res.json(bookList);
//     } catch (e) {
//       return res.status(500).send(e);
//     }
//   })
//   .post(async (req, res) => {
//     //code here for POST
//   });

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
