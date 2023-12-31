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
const Report = db.Report;
const Comment = db.Comment;
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
exports.get_AllBoards2 = async (req, res, next) => {
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

    const formattedBoards = await Promise.all(
      boards.map(async (board) => {
        const tasks = await Task.find({ board: board._id }).select(
          "title description dueDate status"
        );
        return {
          ...board._doc,
          createdAt: board.createdAt.toISOString().split("T")[0],
          tasks: tasks.map((task) => ({
            title: task.title,
            description: task.description,
            dueDate: task.dueDate,
            status: task.status,
            // Thêm các trường thông tin khác của task mà bạn muốn trả về
          })),
        };
      })
    );

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
    const tasks = await Task.find({ board: boardId });
    const taskIds = tasks.map((task) => task._id);
    // Find all tasks in the board
    await Task.deleteMany({ board: boardId });
    await Report.deleteMany({ task: { $in: taskIds } });
    await Comment.deleteMany({ task: { $in: taskIds } });
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
    })
      .populate({ path: "project", select: "title" })
      .populate({ path: "board_leader", select: "fullname" });
    const formattedBoards = await Promise.all(
      boards.map(async (board) => {
        const tasks = await Task.find({ board: board._id }).select(
          "title description dueDate status"
        );
        const countTasks = tasks.length;
        const countCompletedTasks = tasks.filter(
          (task) => task.status === "completed"
        ).length;
        return {
          ...board._doc,
          createdAt: board.createdAt.toISOString().split("T")[0],
          countTasks,
          countCompletedTasks,
          tasks: tasks.map((task) => ({
            title: task.title,
            description: task.description,
            dueDate: task.dueDate.toISOString().split("T")[0],
            status: task.status,
          })),
        };
      })
    );
    res.status(200).json(formattedBoards);
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

    // Find all boards where the logged-in user is either the owner of the project or the leader
    const boards = await Board.find({
      $or: [
        { board_leader: userId }, // Logged-in user is the leader of the board
        { project: { $in: await getProjectsOwnedByUser(userId) } }, // Logged-in user is the owner of the associated project
      ],
      ...condition,
    });

    const projectIds = [];
    const userIds = [];
    const formattedBoards = boards.map((board) => {
      projectIds.push(board.project._id);
      userIds.push(board.board_leader._id);
      return {
        ...board._doc,
        createdAt: board.createdAt.toISOString().split("T")[0],
      };
    });

    const projects = await Project.find({ _id: { $in: projectIds } });
    const projectMap = {};
    projects.forEach((project) => {
      projectMap[project._id.toString()] = project.title;
    });

    const users = await User.find({ _id: { $in: userIds } });
    const userMap = {};
    users.forEach((user) => {
      userMap[user._id.toString()] = user.fullname;
    });

    formattedBoards.forEach((board) => {
      const projectId = board.project._id.toString();
      board.projectName = projectMap[projectId];
      board.leaderName = userMap[board.board_leader._id.toString()];
    });

    return res.status(200).json(formattedBoards);
  } catch (err) {
    console.error(err);
    return next(
      new BadRequestError(500, "An error occurred while retrieving projects")
    );
  }
};
async function getProjectsOwnedByUser(userId) {
  const projects = await Project.find({ owner: userId });
  return projects.map((project) => project._id);
}
exports.get_Boards_byToken2 = async (req, res, next) => {
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

    // Find all boards where the logged-in user is either the owner of the project or the leader
    const boards = await Board.find({
      $or: [
        { board_leader: userId }, // Logged-in user is the leader of the board
        { project: { $in: await getProjectsOwnedByUser(userId) } }, // Logged-in user is the owner of the associated project
      ],
      ...condition,
    });

    const projectIds = [];
    const userIds = [];
    const formattedBoards = boards.map((board) => {
      projectIds.push(board.project._id);
      userIds.push(board.board_leader._id);
      return {
        ...board._doc,
        createdAt: board.createdAt.toISOString().split("T")[0],
      };
    });

    const projects = await Project.find({ _id: { $in: projectIds } });
    const projectMap = {};
    projects.forEach((project) => {
      projectMap[project._id.toString()] = project.title;
    });

    const users = await User.find({ _id: { $in: userIds } });
    const userMap = {};
    users.forEach((user) => {
      userMap[user._id.toString()] = user.fullname;
    });

    // Fetch tasks for each board
    const taskPromises = boards.map((board) =>
      Task.find({ board: board._id })
        .populate({
          path: "members",
          select: "fullname",
        })
        .select("-board -createdAt -updatedAt -creator")
    );
    const tasksByBoard = await Promise.all(taskPromises);
    const taskCountsByBoard = {};
    const completedTaskCountsByBoard = {}; // Track completed task counts per board

    tasksByBoard.forEach((tasks, index) => {
      formattedBoards[index].tasks = tasks;
      taskCountsByBoard[boards[index]._id] = 0;
      completedTaskCountsByBoard[boards[index]._id] = 0; // Initialize completed task count to 0
    });

    tasksByBoard.forEach((tasks, index) => {
      taskCountsByBoard[boards[index]._id] = tasks.length;
      formattedBoards[index].tasks = tasks;

      // Count completed tasks
      tasks.forEach((task) => {
        if (task.status === "completed") {
          completedTaskCountsByBoard[boards[index]._id]++;
        }
      });
    });

    formattedBoards.forEach((board) => {
      const projectId = board.project._id.toString();
      board.projectName = projectMap[projectId];
      board.leaderName = userMap[board.board_leader._id.toString()];
      board.taskCount = taskCountsByBoard[board._id];

      // Calculate percentage of completed tasks
      board.completedTaskCount = completedTaskCountsByBoard[board._id];
      // Round to 2 decimal places
    });
    formattedBoards.sort((board1, board2) => {
      const projectName1 = board1.projectName.toLowerCase();
      const projectName2 = board2.projectName.toLowerCase();

      if (projectName1 < projectName2) {
        return -1;
      }
      if (projectName1 > projectName2) {
        return 1;
      }
      return 0;
    });
    return res.status(200).json(formattedBoards);
  } catch (err) {
    console.error(err);
    return next(
      new BadRequestError(500, "An error occurred while retrieving projects")
    );
  }
};
//Lay thong tin board
exports.get_board_info = async (req, res, next) => {
  try {
    const boardId = req.params.id;

    // Check if boardId is provided
    if (!boardId) {
      return res.status(400).json({ message: "Board ID is required" });
    }

    // Find the board document by ID
    const board = await Board.findById(boardId).populate({
      path: "project",
      select: "title",
    });

    // If the board document does not exist, return a 404 error
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }
    const formattedDate = new Date(board.createdAt).toISOString().substr(0, 10);
    const formattedBoard = {
      ...board._doc,
      createdAt: formattedDate,
    };
    // Return the board document as a JSON response
    return res.status(200).json(formattedBoard);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "An error occurred while retrieving the board",
      error: err.message,
    });
  }
};
