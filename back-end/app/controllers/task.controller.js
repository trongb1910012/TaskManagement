const { BadRequestError } = require("../helpers/errors");
const handle = require("../helpers/promise");
const jwt = require("jsonwebtoken");
const config = require("../config");
const db = require("../models");
const Task = db.Task;
const Project = db.Project;

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
    // Get the project ID and task data from the request body
    const { id, title, description, dueDate } = req.body;
    const members = req.body.members || req.query.members || [];
    // Check if the project ID and task data are provided
    if (!id || !title || !description || !dueDate) {
      return next(
        new BadRequestError(400, "Project ID and task data are required")
      );
    }

    // Find the project document by ID
    const project = await Project.findById(id);

    // If the project document does not exist, return a 404 error
    if (!project) {
      return next(new BadRequestError(404, "Project not found"));
    }

    // Create a new task document with the task data
    const task = new Task({
      title,
      description,
      dueDate,
      project: id,
      members: [...members],
    });

    // Save the task document to the database
    const savedTask = await task.save();

    // Add the task ID to the project document's tasks array
    project.tasks.push(savedTask._id);

    // Save the updated project document to the database
    const savedProject = await project.save();

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
        path: "project",
        select: "title",
      });

    // Format the dueDate property of each task object in the response
    const formattedTasks = tasks.map((task) => {
      const formattedDate = new Date(task.dueDate).toLocaleDateString("en-GB");
      return { ...task._doc, dueDate: formattedDate };
    });

    return res.status(200).json(formattedTasks);
  } catch (err) {
    console.error(err);
    return next(
      new BadRequestError(500, "An error occurred while retrieving projects")
    );
  }
};
// xem cong viec theo id ke hoach
exports.get_CV_KeHoach = async (req, res, next) => {
  try {
    const projectId = req.params.id;

    const tasks = await Task.find({ project: projectId })
      .populate({
        path: "members",
        select: "-password",
      })
      .populate({
        path: "project",
        select: "title",
      });

    const formattedTasks = tasks.map((task) => {
      const formattedDate = new Date(task.dueDate).toLocaleDateString("en-GB");
      return { ...task._doc, dueDate: formattedDate };
    });

    return res.status(200).json(formattedTasks);
  } catch (err) {
    console.error(err);
    return next(
      new BadRequestError(
        500,
        "An error occurred while retrieving tasks for the project"
      )
    );
  }
};
// xoa cong viec
exports.xoa_CongViec = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the task to be deleted
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).send({ message: "Task not found" });
    }

    // Find the project that the task belongs to
    const project = await Project.findById(task.project);

    if (!project) {
      return res.status(404).send({ message: "Project not found" });
    }

    // Remove the task from the project's tasks array
    project.tasks.pull(id);
    await project.save();

    // Delete the task
    await Task.deleteOne({ _id: id });

    res.send({ message: "Task deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal server error" });
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
        select: "-password",
      })
      .populate({ path: "owner", select: "-password" });
    return res.status(200).json(tasks);
  } catch (err) {
    console.error(err);
    return next(
      new BadRequestError(500, "An error occurred while retrieving projects")
    );
  }
};
