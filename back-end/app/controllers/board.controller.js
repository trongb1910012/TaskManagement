const { BadRequestError } = require("../helpers/errors");
const handle = require("../helpers/promise");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const config = require("../config");
const db = require("../models");
const Board = db.Board;
const Project = db.Project;
// Them bang cong viec
exports.createBoard = async (req, res) => {
  try {
    const { board_name, project } = req.body;

    // Create a new board object
    const board = new Board({
      board_name,
      project,
    });

    // Save the new board to the database
    const newBoard = await board.save();
    // Return the new board object as JSON
    res.status(201).json(newBoard);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
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

    const boards = await Board.find(condition).populate({
      path: "project",
      select: "title",
    });

    return res.status(200).json(boards);
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

// xoa bang cong viec
exports.deleteBoard = async (req, res) => {
  const boardId = req.params.id;

  try {
    // Find the board and get the project ID
    const board = await Board.findById(boardId);
    const projectId = board.project;

    // Delete the board
    await Board.findByIdAndDelete(boardId);

    // Remove the board ID from the project's boards array
    await Project.findByIdAndUpdate(projectId, { $pull: { boards: boardId } });

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
