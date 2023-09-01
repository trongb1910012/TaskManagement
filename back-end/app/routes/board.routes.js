const express = require("express");
const boards = require("../controllers/board.controller");

module.exports = (app) => {
  const router = express.Router();
  router.get("/", boards.get_AllBoards);
  router.get("/cv_leader", boards.get_Boards_byToken);
  router.get("/:id", boards.getBoardsByProjectId);
  router.get("/leader/:u_id", boards.getBoardsByUserId);
  router.post("/", boards.createBoard);
  router.put("/:id", boards.update_Board);
  router.delete("/:id", boards.deleteBoard);
  router.get(":/u_id", boards.getBoardsByUserId);
  app.use("/api/boards", router);
};
