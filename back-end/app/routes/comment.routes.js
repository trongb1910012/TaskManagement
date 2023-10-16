const express = require("express");
const comments = require("../controllers/comment.controller");

module.exports = (app) => {
  const router = express.Router();
  router.post("/", comments.add_Comment);
  router.get("/", comments.getAllComments);
  router.get("/xgh", comments.get_CommentsByUser);
  router.get("/xgh/pm", comments.get_CommentsByProject);
  router.get("/:task_id", comments.getComment_ByTaskId);
  app.use("/api/comments", router);
};
