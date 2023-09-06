const { BadRequestError } = require("../helpers/errors");
const handle = require("../helpers/promise");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const config = require("../config");
const db = require("../models");
const Board = db.Board;
const Project = db.Project;
const Task = db.Task;
const User = db.User;
// Them bang cong viec
exports.createBoard = async (req, res, next) => {
  if (!req.body.board_name) {
    return next(new BadRequestError(400, "Title cannot be empty"));
  }
  const token = req.query.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const decodedToken = jwt.verify(token, config.jwt.secret);
  const userId = decodedToken.id;

  // Truy xuất thông tin dự án từ cơ sở dữ liệu
  const project = await Project.findById(req.body.project);
  if (!project) {
    return next(new BadRequestError(404, "Project not found"));
  }
  const ownerString = JSON.stringify(project.owner);
  const ownerId = ownerString.replace(/"/g, "");
  // Kiểm tra xem người đăng nhập có phải là chủ sở hữu của dự án hay không
  if (ownerId !== userId) {
    return next(
      new BadRequestError(403, `Only project owner can create boards`)
    );
  }

  const board = new Board({
    board_name: req.body.board_name,
    project: req.body.project,
    board_leader: req.body.board_leader,
  });

  try {
    const document = await board.save();
    return res.send(document);
  } catch (error) {
    return next(
      new BadRequestError(500, "An error occurred while creating the board")
    );
  }
};

// Xem danh sach bang cong viec
exports.get_AllBoards = async (req, res, next) => {
  try {
    const condition = {};
    const board_name = req.query.board_name;
    if (board_name) {
      condition.board_name = { $regex: new RegExp(board_name), $options: "i" };
    }

    const boards = await Board.find(condition)
      .populate({
        path: "project",
        select: "title",
      })
      .populate({
        path: "board_leader",
        select: "fullname",
      });

    const formattedBoards = boards.map((board) => ({
      ...board._doc,
      createdAt: board.createdAt.toISOString().split("T")[0],
    }));

    return res.status(200).json(formattedBoards);
  } catch (err) {
    console.error(err);
    return next(
      new BadRequestError(500, "An error occurred while retrieving projects")
    );
  }
};
//cap nhat bang cong viec
exports.updateBoard = async (req, res) => {
  const boardId = req.params.id;
  const updates = req.body;

  try {
    const board = await Board.findByIdAndUpdate(boardId, updates, {
      new: true,
    });

    if (!board) {
      return res.status(404).send({ message: "Board not found" });
    }

    res.send(board);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal server error" });
  }
};

exports.update_Board = async (req, res, next) => {
  const boardId = req.params.id;
  const updates = req.body;

  try {
    const board = await Board.findOne({ _id: boardId });
    if (!board) {
      return next(new BadRequestError(404, "Board not found"));
    }
    const token = req.query.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decodedToken = jwt.verify(token, config.jwt.secret);
    const userId = decodedToken.id;

    const project = await Project.findById(board.project);
    if (!project) {
      return next(new BadRequestError(404, "Project not found"));
    }
    const ownerString = JSON.stringify(project.owner);
    const leaderString = JSON.stringify(board.board_leader);
    const ownerId = ownerString.replace(/"/g, "");
    const leaderId = leaderString.replace(/"/g, "");
    // Only allow the owner of the project to update it
    if (ownerId !== userId && leaderId !== userId) {
      return next(
        new BadRequestError(403, `${leaderString} ${leaderId} ${userId}`)
      );
    }

    // Update the project fields with the new values
    Object.keys(updates).forEach((key) => {
      board[key] = updates[key];
    });

    const updatedBoard = await board.save();
    return res.status(200).json(updatedBoard);
  } catch (err) {
    console.error(err);
    return next(
      new BadRequestError(500, "An error occurred while updating the board")
    );
  }
};
// xoa bang cong viec
exports.deleteBoard = async (req, res) => {
  const boardId = req.params.id;

  try {
    // Find the board
    const board = await Board.findById(boardId);

    // If board is not found, return an error message
    if (!board) {
      return res.status(404).send({ message: "Board not found" });
    }

    // Find all tasks in the board
    const tasks = await Task.find({ boardId });

    // Delete all tasks
    await Task.deleteMany({ boardId });

    // Delete the board
    await Board.findByIdAndDelete(boardId);

    res.send({ message: "Board deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal server error" });
  }
};

// Danh sach cac boards cua mot project
exports.getBoardsByProjectId = async (req, res) => {
  const projectId = req.params.id;

  try {
    const boards = await Board.find({
      project: mongoose.Types.ObjectId(projectId),
    });
    res.status(200).json(boards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//Lay cac board theo id leader
exports.getBoardsByUserId = async (req, res) => {
  const userId = req.params.u_id;

  try {
    const boards = await Board.find({
      board_leader: mongoose.Types.ObjectId(userId),
    })
      .populate({ path: "project", select: "title" })
      .populate({
        path: "board_leader",
        select: "fullname",
      });
    res.status(200).json(boards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//Laay cac board theo token
exports.get_Boards_byToken = async (req, res, next) => {
  try {
    const condition = {};
    const board_name = req.query.board_name;
    if (board_name) {
      condition.board_name = { $regex: new RegExp(board_name), $options: "i" };
    }
    const token = req.query.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decodedToken = jwt.verify(token, config.jwt.secret);
    const userId = decodedToken.id;

    const boards = await Board.find({
      ...condition,
      board_leader: userId,
    });

    const projectIds = []; // Mảng tạm thời lưu danh sách ID dự án
    const userIds = [];
    const formattedBoards = boards.map((board) => {
      projectIds.push(board.project._id);
      userIds.push(board.board_leader._id); // Lưu ID dự án vào mảng tạm thời
      return {
        ...board._doc,
        createdAt: board.createdAt.toISOString().split("T")[0],
      };
    });

    const projects = await Project.find({ _id: { $in: projectIds } }); // Truy vấn danh sách dự án theo ID

    const projectMap = {}; // Đối tượng tạm thời lưu thông tin dự án theo ID
    projects.forEach((project) => {
      projectMap[project._id.toString()] = project.title; // Gán thông tin dự án vào đối tượng tạm thời theo ID
    });
    const users = await User.find({ _id: { $in: userIds } }); // Truy vấn danh sách dự án theo ID

    const userMap = {};
    users.forEach((user) => {
      userMap[user._id.toString()] = user.fullname;
    });

    formattedBoards.forEach((board) => {
      const projectId = board.project._id.toString();
      board.projectName = projectMap[projectId];
      board.leaderName = userMap[userId];
    });

    return res.status(200).json(formattedBoards);
  } catch (err) {
    console.error(err);
    return next(
      new BadRequestError(500, "An error occurred while retrieving projects")
    );
  }
};
