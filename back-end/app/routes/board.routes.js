const express = require("express");
const boards = require("../controllers/board.controller");

module.exports = (app) => {
  const router = express.Router();
  router.get("/", boards.get_AllBoards2);
  router.get("/cv_leader", boards.get_Boards_byToken2);
  router.get("/:id", boards.getBoardsByProjectId);
  router.get("/leader/:u_id", boards.getBoardsByUserId);
  router.get("/boardInfo/:id", boards.get_board_info);
  router.post("/", boards.createBoard);
  router.put("/:id", boards.update_Board);
  router.delete("/:id", boards.deleteBoard);
  router.get(":/u_id", boards.getBoardsByUserId);
  app.use("/api/boards", router);
};
