const { BadRequestError } = require("../helpers/errors");
const handle = require("../helpers/promise");
const jwt = require("jsonwebtoken");
const config = require("../config");
const db = require("../models");
const Task = db.Task;
const User = db.User;
const Comment = db.Comment;
// Them binh luan
exports.add_Comment = async (req, res, next) => {
  const token = req.query.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const decodedToken = jwt.verify(token, config.jwt.secret);
  const userId = decodedToken.id;
  const comment = new Comment({
    task_id: req.body.task_id,
    user_id: userId,
    comment_text: req.body.comment_text,
  });

  try {
    const document = await comment.save();
    return res.send(document);
  } catch (error) {
    return next(
      new BadRequestError(500, "An error occurred while creating the comment")
    );
  }
};
//Xem tat ca binh luan
exports.getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find()
      .populate("user_id", "username")
      .populate("task_id", "title");
    res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
// Xem comment theo task id
exports.getComment_ByTaskId = async (req, res) => {
  try {
    const taskId = req.params.task_id;
    const comments = await Comment.find({ task_id: taskId }).populate(
      "user_id",
      "username"
    );
    res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
