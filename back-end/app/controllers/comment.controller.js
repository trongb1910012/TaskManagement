const { BadRequestError } = require("../helpers/errors");
const handle = require("../helpers/promise");
const jwt = require("jsonwebtoken");
const config = require("../config");
const db = require("../models");
const Task = db.Task;
const Project = db.Project;
const Board = db.Board;
const User = db.User;
const Comment = db.Comment;
// Them binh luan
exports.add_Comment = async (req, res, next) => {
  const token = req.query.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decodedToken = jwt.verify(token, config.jwt.secret);
    const userId = decodedToken.id;

    const task = await Task.findOne({ _id: req.body.task_id });
    if (!task) {
      return next(new BadRequestError(404, "Task not found"));
    }
    const currentDueDate = new Date(task.dueDate).toISOString().split("T")[0];
    if (req.body.new_dueDate && req.body.new_dueDate <= currentDueDate) {
      return next(
        new BadRequestError(
          400,
          "New due date must be greater than the current due date"
        )
      );
    }

    const comment = new Comment({
      task_id: req.body.task_id,
      user_id: userId,
      comment_text: req.body.comment_text,
      new_dueDate: req.body.new_dueDate,
    });

    const savedComment = await comment.save();
    return res.status(200).json(savedComment);
  } catch (error) {
    console.error(error);
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
//lấy danh sách đơn theo người dùng (user)
exports.get_CommentsByUser = async (req, res, next) => {
  const token = req.query.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decodedToken = jwt.verify(token, config.jwt.secret);
    const userId = decodedToken.id;

    const comments = await Comment.find({ user_id: userId });
    return res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    return next(
      new BadRequestError(500, "An error occurred while retrieving comments")
    );
  }
};
//lấy danh ách đơn theo kế hoạch (pm)
exports.get_CommentsByProject = async (req, res, next) => {
  const token = req.query.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decodedToken = jwt.verify(token, config.jwt.secret);
    const userId = decodedToken.id;

    // Find all projects owned by the user
    const projects = await Project.find({ owner: userId });

    // Extract project IDs
    const projectIds = projects.map((project) => project._id);

    // Find all boards associated with the projects
    const boards = await Board.find({ project: { $in: projectIds } });

    // Find all tasks associated with the boards
    const boardIds = boards.map((board) => board._id);
    const tasks = await Task.find({ board: { $in: boardIds } });

    // Find all comments associated with the tasks, including user fullname
    const taskIds = tasks.map((task) => task._id);
    const comments = await Comment.aggregate([
      {
        $match: { task_id: { $in: taskIds } },
      },
      {
        $lookup: {
          from: "tasks",
          localField: "task_id",
          foreignField: "_id",
          as: "task",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$task",
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          _id: 0,
          task_id: {
            _id: "$task._id",
            title: "$task.title",
          },
          user_id: {
            _id: "$user._id",
            fullname: "$user.fullname",
          },
          comment_text: "$comment_text",
          old_dueDate: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$task.dueDate",
            },
          },
          new_dueDate: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$new_dueDate",
            },
          },
          status: "$status",
          createdAt: "$createdAt",
          updatedAt: "$updatedAt",
          id: "$_id",
        },
      },
    ]);

    return res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    return next(
      new BadRequestError(500, "An error occurred while retrieving comments")
    );
  }
};
