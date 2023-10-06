const { BadRequestError } = require("../helpers/errors");
const handle = require("../helpers/promise");
const jwt = require("jsonwebtoken");
const config = require("../config");
const db = require("../models");
const Project = db.Project;
const Board = db.Board;
//Lay tat ca ke hoach
exports.get_KeHoach = async (req, res, next) => {
  try {
    const condition = {};
    const title = req.query.title;
    if (title) {
      condition.title = { $regex: new RegExp(title), $options: "i" };
    }

    const projects = await Project.find(condition).populate({
      path: "owner",
      select: "fullname",
    });
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
    };
    return res.status(200).json(response);
  } catch (err) {
    console.error(err);
    return next(
      new BadRequestError(500, "An error occurred while retrieving projects")
    );
  }
};
//Them ke hoach
exports.them_KeHoach = async (req, res, next) => {
  if (!req.body.title) {
    return next(new BadRequestError(400, "Title can not be empty"));
  }
  const token = req.query.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const decodedToken = jwt.verify(token, config.jwt.secret);
  const userId = decodedToken.id;
  const project = new Project({
    title: req.body.title,
    description: req.body.description,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    budget: req.body.budget,
    owner: userId,
  });

  try {
    const document = await project.save();
    return res.send(document);
  } catch (error) {
    return next(
      new BadRequestError(500, "An error occurred while creating the project")
    );
  }
};
//Sua ke hoach
exports.sua_KeHoach = async (req, res, next) => {
  const projectId = req.params.id;
  const updates = req.body;

  try {
    const project = await Project.findOne({ _id: projectId });
    if (!project) {
      return next(new BadRequestError(404, "Project not found"));
    }
    const token = req.query.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decodedToken = jwt.verify(token, config.jwt.secret);
    const userId = decodedToken.id;
    // Only allow the owner of the project to update it
    if (userId !== project.owner.toString()) {
      return next(new BadRequestError(403, "Forbidden"));
    }

    // Update the project fields with the new values
    Object.keys(updates).forEach((key) => {
      project[key] = updates[key];
    });

    const updatedProject = await project.save();
    return res.status(200).json(updatedProject);
  } catch (err) {
    console.error(err);
    return next(
      new BadRequestError(500, "An error occurred while updating the project")
    );
  }
};

//Xoa ke hoach
exports.xoa_KeHoach = async (req, res, next) => {
  const projectId = req.params.id;

  try {
    const project = await Project.findOne({ _id: projectId });
    if (!project) {
      return next(new BadRequestError(404, "Project not found"));
    }

    const token = req.query.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decodedToken = jwt.verify(token, config.jwt.secret);
    const userId = decodedToken.id;

    // Only allow the owner or a privileged user to delete the project
    if (userId !== project.owner.toString()) {
      return next(new BadRequestError(403, "Forbidden"));
    }
    // Delete all boards associated with the project
    await Board.deleteMany({ project: projectId });

    // Delete the project itself
    await Project.deleteOne({ _id: projectId });
    return res.status(200).send("Đã xóa thành công kế hoạch");
  } catch (err) {
    console.error(err);
    return next(
      new BadRequestError(500, "An error occurred while deleting the project")
    );
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const deletedProject = await Project.findByIdAndDelete(req.params.id);
    if (!deletedProject) {
      return res.status(404).send("Project not found");
    }
    res.send("Delete successful");
  } catch (error) {
    res.status(500).send(error.message);
  }
};
// Xem ke hoach cua nhan vien
exports.get_KeHoach_Nv = async (req, res, next) => {
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
exports.getProjectbyId = async (req, res) => {
  try {
    const { id } = req.query;

    const project = await Project.findById(id).populate({
      path: "owner",
      select: "fullname",
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    const formattedStartDate = new Date(project.startDate)
      .toISOString()
      .substr(0, 10);
    const formattedEndDate = new Date(project.endDate)
      .toISOString()
      .substr(0, 10);
    const formattedProject = {
      ...project._doc,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
    };
    const response = {
      projects: formattedProject,
    };
    // Trả về kết quả
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
