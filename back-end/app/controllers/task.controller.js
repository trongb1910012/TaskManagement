const { BadRequestError } = require("../helpers/errors");
const handle = require("../helpers/promise");
const jwt = require("jsonwebtoken");
const config = require("../config");
const db = require("../models");
const Task = db.Task;
const Project = db.Project;
const Board = db.Board;

//them cong viec
exports.them_CongViec1 = async (req, res, next) => {
  if (!req.body.title) {
    return next(new BadRequestError(400, "Title can not be empty"));
  }
  const members = req.body.members || req.query.members || [];
  const task = new Task({
    title: req.body.title,
    description: req.body.description,
    dueDate: req.body.dueDate,
    status: req.body.status,
    project: req.body.project,
    members: [...members],
  });

  try {
    const document = await task.save();
    return res.send(document);
  } catch (error) {
    console.error(error);
    return next(
      new BadRequestError(500, "An error occurred while creating the task")
    );
  }
};

exports.them_CongViec = async (req, res, next) => {
  try {
    const token = req.query.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decodedToken = jwt.verify(token, config.jwt.secret);
    const userId = decodedToken.id;
    // Get the project ID and task data from the request body
    const { board_id, title, description, dueDate } = req.body;
    const members = req.body.members || req.query.members || [];
    // Check if the project ID and task data are provided
    if (!board_id || !title || !description || !dueDate) {
      return next(
        new BadRequestError(400, "Board ID and task data are required")
      );
    }

    // Find the project document by ID
    const board = await Board.findById(board_id);

    // If the project document does not exist, return a 404 error
    if (!board) {
      return next(new BadRequestError(404, "Project not found"));
    }

    // Create a new task document with the task data
    const task = new Task({
      title,
      description,
      dueDate,
      board: board_id,
      members: [...members],
      creator: userId,
    });

    // Save the task document to the database
    const savedTask = await task.save();

    // Return the saved task document as a JSON response
    return res.status(200).json(savedTask);
  } catch (err) {
    console.error(err);
    return next(
      new BadRequestError(
        500,
        "An error occurred while creating the task and assigning it to the project"
      )
    );
  }
};
// xem cong viec
exports.get_CongViec = async (req, res, next) => {
  try {
    const condition = {};
    const title = req.query.title;
    if (title) {
      condition.title = { $regex: new RegExp(title), $options: "i" };
    }

    const tasks = await Task.find(condition)
      .populate({
        path: "members",
        select: "fullname",
      })
      .populate({
        path: "board",
        select: "board_name",
      });

    // Format the dueDate property of each task object in the response
    const formattedTasks = tasks.map((task) => {
      const formattedDate = new Date(task.dueDate).toISOString().substr(0, 10);
      return { ...task._doc, dueDate: formattedDate };
    });
    const response = {
      tasks: formattedTasks,
    };
    return res.status(200).json(response);
  } catch (err) {
    console.error(err);
    return next(
      new BadRequestError(500, "An error occurred while retrieving projects")
    );
  }
};
// xem cong viec theo id bang cong viec
exports.get_CV_KeHoach = async (req, res, next) => {
  try {
    const board_id = req.params.id;

    const tasks = await Task.find({ board: board_id })
      .populate({
        path: "members",
        select: "fullname",
      })
      .populate({ path: "creator", select: "fullname" });
    const formattedTasks = tasks.map((task) => {
      const formattedDate = new Date(task.dueDate).toLocaleDateString("en-GB");
      return { ...task._doc, dueDate: formattedDate };
    });
    const response = {
      tasks: formattedTasks,
    };
    return res.status(200).json(response);
  } catch (err) {
    console.error(err);
    return next(
      new BadRequestError(
        500,
        "An error occurred while retrieving tasks for the board"
      )
    );
  }
};
// xoa cong viec
exports.xoa_CongViec1 = async (req, res) => {
  try {
    const taskId = req.params.id;

    // Find the task with the specified ID and remove it
    const deletedTask = await Task.findByIdAndRemove(taskId);

    if (!deletedTask) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
      data: deletedTask,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
exports.xoa_CongViec = async (req, res) => {
  try {
    const taskIds = req.body.taskIds; // Assuming taskIds is an array of task IDs

    // Find the tasks with the specified IDs and remove them
    const deletedTasks = await Task.deleteMany({ _id: { $in: taskIds } });

    if (deletedTasks.n === 0) {
      return res.status(404).json({
        success: false,
        message: "Tasks not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Tasks deleted successfully",
      data: deletedTasks,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
//Sua cong viec
exports.sua_CongViec = async (req, res, next) => {
  const taskId = req.params.id;
  const updates = req.body;

  try {
    const task = await Task.findOne({ _id: taskId });
    if (!task) {
      return next(new BadRequestError(404, "Task not found"));
    }

    // // Only allow the owner of the project to update it
    // if (
    //   req.userId &&
    //   project.owner &&
    //   req.userId.toString() !== project.owner.toString()
    // ) {
    //   return next(new BadRequestError(403, "Forbidden"));
    // }

    // Update the project fields with the new values
    Object.keys(updates).forEach((key) => {
      task[key] = updates[key];
    });

    const updatedTask = await task.save();
    return res.status(200).json(updatedTask);
  } catch (err) {
    console.error(err);
    return next(
      new BadRequestError(500, "An error occurred while updating the task")
    );
  }
};
//Xem cong viec cua nhan vien
exports.get_CongViec_Nv = async (req, res, next) => {
  try {
    const token = req.query.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decodedToken = jwt.verify(token, config.jwt.secret);
    const memberId = decodedToken.id;

    const tasks = await Task.find({
      members: memberId,
    })
      .populate({
        path: "members",
        select: "fullname",
      })
      .populate({
        path: "board",
        select: "board_name",
      })
      .populate({
        path: "creator",
        select: "fullname",
      });
    const formattedTasks = tasks.map((task) => {
      const formattedDate = new Date(task.dueDate).toISOString().substr(0, 10);
      return { ...task._doc, dueDate: formattedDate };
    });
    const response = {
      tasks: formattedTasks,
    };
    return res.status(200).json(response);
  } catch (err) {
    console.error(err);
    return next(
      new BadRequestError(500, "An error occurred while retrieving projects")
    );
  }
};
// Danh sach cac cong viec da tao
exports.get_created_tasks = async (req, res, next) => {
  try {
    const token = req.query.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decodedToken = jwt.verify(token, config.jwt.secret);
    const memberId = decodedToken.id;

    const tasks = await Task.find({
      creator: memberId,
    })
      .populate({
        path: "members",
        select: "fullname",
      })
      .populate({
        path: "board",
        select: "board_name",
      })
      .populate({
        path: "creator",
        select: "fullname",
      });
    const formattedTasks = tasks.map((task) => {
      const formattedDate = new Date(task.dueDate).toISOString().substr(0, 10);
      return { ...task._doc, dueDate: formattedDate };
    });
    const response = {
      tasks: formattedTasks,
    };
    return res.status(200).json(response);
  } catch (err) {
    console.error(err);
    return next(
      new BadRequestError(500, "An error occurred while retrieving projects")
    );
  }
};
// Tu dong doi trang thai cong viec
exports.updateTaskStatus = async (req, res) => {
  try {
    // Tìm tất cả các công việc có dueDate ít hơn thời gian hiện tại
    const tasks = await Task.find({
      dueDate: { $lt: new Date() },
    });

    // Cập nhật trạng thái của từng công việc thành "completed"
    tasks.forEach(async (task) => {
      task.status = "completed";
      await task.save();
    });

    res
      .status(200)
      .json({ message: "Cập nhật trạng thái công việc thành công" });
  } catch (error) {
    res.status(500).json({
      error: "Đã xảy ra lỗi trong quá trình cập nhật trạng thái công việc",
    });
  }
};
