const { BadRequestError } = require("../helpers/errors");
const handle = require("../helpers/promise");
const jwt = require("jsonwebtoken");
const config = require("../config");
const db = require("../models");
const { response } = require("express");
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
    const project = await Project.findById(board.project);
    // Check if project.endDate is less than dueDate
    if (
      project.endDate &&
      project.endDate.toISOString().split("T")[0] < dueDate
    ) {
      return next(
        new BadRequestError(
          400,
          "Due date cannot be after the project end date"
        )
      );
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
    return res.status(200).json(task);
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
        populate: {
          path: "project",
          select: ["startDate", "endDate", "title"],
        },
      })
      .sort({ dueDate: 1 });

    // Format the dueDate property of each task object in the response
    const formattedTasks = tasks.map((task) => {
      const formattedDate = new Date(task.dueDate).toISOString().substr(0, 10);
      const formattedStartDate = new Date(task.board.project.startDate)
        .toISOString()
        .substr(0, 10);
      const formattedEndDate = new Date(task.board.project.endDate)
        .toISOString()
        .substr(0, 10);
      return {
        ...task._doc,
        dueDate: formattedDate,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      };
    });
    formattedTasks.sort((task1, task2) => {
      const projectTitle1 = task1.status;
      const projectTitle2 = task2.status;

      if (projectTitle1 < projectTitle2) {
        return 1;
      }
      if (projectTitle1 > projectTitle2) {
        return -1;
      }
      return 0;
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
      .populate({ path: "creator", select: "fullname" })
      .populate({ path: "board", select: "board_name" })
      .sort({ status: -1, dueDate: 1 });
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
      })
      .populate({
        path: "board",
        select: "board_name",
        populate: {
          path: "project",
          select: ["startDate", "endDate", "title"],
        },
      })
      .sort({ "board.project._id": 1, status: -1, dueDate: 1 });
    const formattedTasks = tasks.map((task) => {
      const formattedDate = new Date(task.dueDate).toISOString().substr(0, 10);
      const formattedStartDate = new Date(task.board.project.startDate)
        .toISOString()
        .substr(0, 10);
      const formattedEndDate = new Date(task.board.project.endDate)
        .toISOString()
        .substr(0, 10);
      return {
        ...task._doc,
        dueDate: formattedDate,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      };
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
        populate: {
          path: "project",
          select: ["startDate", "endDate", "title"],
        },
      })
      .populate({
        path: "creator",
        select: "fullname",
      })
      .sort({ status: -1, dueDate: 1 });

    const formattedTasks = tasks.map((task) => {
      const formattedDate = new Date(task.dueDate).toISOString().substr(0, 10);
      return { ...task._doc, dueDate: formattedDate };
    });
    formattedTasks.sort((task1, task2) => {
      const projectTitle1 = task1.board.project.title.toLowerCase();
      const projectTitle2 = task2.board.project.title.toLowerCase();

      if (projectTitle1 < projectTitle2) {
        return -1;
      }
      if (projectTitle1 > projectTitle2) {
        return 1;
      }
      return 0;
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
      status: { $ne: "completed" },
    });

    // Cập nhật trạng thái của từng công việc thành "completed"
    tasks.forEach(async (task) => {
      task.status = "missed";
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
//Thông tin task theo id
exports.getTaskById = async (req, res) => {
  try {
    const { id } = req.query;

    const task = await Task.findById(id)
      .populate({
        path: "creator",
        select: "fullname",
      })
      .populate({
        path: "members",
        select: "fullname",
      })
      .populate({
        path: "board",
        select: "board_name",
        populate: {
          path: "project", // populate project từ model Board
          select: "title",
        },
      });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    const board = await Board.findById(task.board._id);
    const project = await Project.findById(board.project._id);
    const formattedDate = new Date(task.dueDate).toISOString().substr(0, 10);
    const formattedTask = {
      ...task._doc,
      dueDate: formattedDate,
    };
    const response = {
      task: formattedTask,
      boardName: board.board_name,
      projectName: project.title,
    };

    return res.json(response);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
//Nhận công việc
exports.AcceptTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    // Validate taskId
    if (!taskId) {
      return res.status(400).send({
        message: "Task id is required",
      });
    }

    // Find task and update status
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).send({
        message: "Task not found",
      });
    }

    task.status = "in progress";
    await task.save();

    res.send({
      message: "Task started successfully",
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};
exports.AcceptTask1 = async (req, res) => {
  try {
    const { taskId } = req.params;

    // Validate
    if (!taskId) {
      return res.status(400).send({ message: "Task id is required" });
    }

    // Find task
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).send({ message: "Task not found" });
    }

    // Find project
    const board = await Board.findById(task.board);
    if (!board) {
      return res.status(404).send({ message: "Project not found" });
    }
    const project = await Project.findById(board.project);
    if (!project) {
      return res.status(404).send({ message: "Project not found" });
    }

    // Update task status
    task.status = "in progress";
    await task.save();

    // Update project status
    project.status = "in progress";
    await project.save();

    res.send({ message: "Task started successfully" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
//Xác nhận công việc hoàn thành
exports.ConfirmCompletedTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    // Validate taskId
    if (!taskId) {
      return res.status(400).send({
        message: "Task id is required",
      });
    }

    // Find task and update status
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).send({
        message: "Task not found",
      });
    }

    task.status = "completed";
    await task.save();

    res.send({
      message: "Task started successfully",
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};
exports.getTaskStatusCounts = async (req, res) => {
  try {
    const completedCount = await Task.countDocuments({ status: "completed" });
    const inProgressCount = await Task.countDocuments({
      status: "in progress",
    });
    const missedCount = await Task.countDocuments({ status: "missed" });
    const notStartedCount = await Task.countDocuments({
      status: "not started",
    });

    const chartData = {
      labels: ["Completed", "In Progress", "Missed", "Not Started"],
      datasets: [
        {
          label: " Tasks",
          data: [completedCount, inProgressCount, missedCount, notStartedCount],
          backgroundColor: ["#33a47c", "#c1945c", "#C70039", "#64687d"],
          hoverBackgroundColor: ["#33a47c", "#c1945c", "#C70039", "#64687d"],
        },
      ],
    };

    res.json(chartData);
  } catch (error) {
    console.error("Error fetching task status counts:", error);
    res.status(500).json({ error: "Error fetching task status counts" });
  }
};
//Lấy tất cả công việc trong các kế hoạch của PM
exports.get_Tasks_Projects = async (req, res, next) => {
  try {
    const condition = {};
    const title = req.query.title;
    if (title) {
      condition.title = { $regex: new RegExp(title), $options: "i" };
    }

    const token = req.query.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decodedToken = jwt.verify(token, config.jwt.secret);
    const memberId = decodedToken.id;

    const projectsPromise = Project.find({
      ...condition,
      owner: memberId,
    })
      .populate({
        path: "owner",
        select: "fullname",
      })
      .sort({ status: -1, createAt: -1 });
    const countPromise = Project.countDocuments({
      ...condition,
      owner: memberId,
    });

    const [projects, count] = await Promise.all([
      projectsPromise,
      countPromise,
    ]);
    const formattedProjects = projects.map((project) => {
      const formattedStartDate = new Date(project.startDate)
        .toISOString()
        .substr(0, 10);
      const formattedEndDate = new Date(project.endDate)
        .toISOString()
        .substr(0, 10);
      return {
        ...project._doc,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      };
    });

    const response = {
      projects: formattedProjects,
      count: count, // Số lượng kế hoạch
    };

    return res.status(200).json(response);
  } catch (err) {
    console.error(err);
    return next(
      new BadRequestError(500, "An error occurred while retrieving projects")
    );
  }
};

exports.getProjectsBoardsTasks = async (req, res, next) => {
  try {
    const token = req.query.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decodedToken = jwt.verify(token, config.jwt.secret);
    const memberId = decodedToken.id;

    // Get projects
    const projects = await Project.find({
      owner: memberId,
    });

    // Get boards for each project
    const boardsPromises = projects.map(async (project) => {
      const boards = await Board.find({
        project: project._id,
      });
      // Get tasks for each board
      const tasksPromises = boards.map(async (board) => {
        const tasks = await Task.find({
          board: board._id,
        })
          .populate({ path: "members", select: "fullname" })
          .populate({
            path: "board",
            select: "board_name",
            populate: {
              path: "project",
              select: ["startDate", "endDate", "title"],
            },
          })
          .populate({
            path: "creator",
            select: "fullname",
          })
          .sort({ status: -1, dueDate: 1 });
        return tasks;
      });
      const tasks = await Promise.all(tasksPromises);
      return {
        project,
        boards,
        tasks: tasks.flat(),
      };
    });

    // Resolve promises
    const results = await Promise.all(boardsPromises);

    // Format data
    const formattedProjects = results.map((result) => {
      const project = result.project;
      const formattedStartDate = new Date(project.startDate)
        .toISOString()
        .substr(0, 10);
      const formattedEndDate = new Date(project.endDate)
        .toISOString()
        .substr(0, 10);
      return {
        ...project._doc,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        boards: result.boards,
        tasks: result.tasks,
      };
    });

    const formattedBoards = results.flatMap((result) =>
      result.boards.map((board) => ({ ...board._doc }))
    );

    const formattedTasks = results.flatMap((result) =>
      result.tasks.map((task) => {
        const formattedDueDate = new Date(task.dueDate)
          .toISOString()
          .substr(0, 10);
        return {
          ...task._doc,
          dueDate: formattedDueDate,
        };
      })
    );

    return res.json({
      projects: formattedProjects,
      boards: formattedBoards,
      tasks: formattedTasks,
    });
  } catch (err) {
    next(err);
  }
};
