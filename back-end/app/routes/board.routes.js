const express = require("express");
const boards = require("../controllers/board.controller");

module.exports = (app) => {
  const router = express.Router();
  router.get("/", boards.get_AllBoards);
  router.get("/:id", boards.getBoardsByProjectId);
  router.post("/", boards.createBoard);
  router.put("/:id", boards.updateBoard);
  router.delete("/:id", boards.deleteBoard);
  app.use("/api/boards", router);
};
