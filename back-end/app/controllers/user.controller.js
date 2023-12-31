const { BadRequestError } = require("../helpers/errors");
const handle = require("../helpers/promise");
const jwt = require("jsonwebtoken");
const config = require("../config");
const db = require("../models");
const User = db.User;
const Project = db.Project;
const Task = db.Task;
const Board = db.Board;
const Report = db.Report;
//Lay danh sach user
exports.get_all_user = async (req, res) => {
  try {
    const condition = {};
    const title = req.query.title;
    if (title) {
      condition.title = { $regex: new RegExp(title), $options: "i" };
    }

    const tasks = await Task.find(condition);
    const reports = await Report.find({ status: "open" });
    const users = await User.find({
      role: ["user", "project manager", "board manager"],
    })
      .select("-password")
      .sort({ role: 1 });
    const users1 = await User.find({
      role: "user",
    }).select("-password");
    const bms = await User.find({
      role: "board manager",
    }).select("-password");
    const pms = await User.find({
      role: "project manager",
    }).select("-password");
    const projectCount = await Project.find();
    const inProgressTasks = await Task.find({ status: "in progress" });
    const inProgressProjects = await Project.find({ status: "in progress" });
    const response = {
      userCount: users1.length,
      pmCount: pms.length,
      bmCount: bms.length,
      tasksCount: tasks.length,
      reportsCount: reports.length,
      projectCount: projectCount.length,
      inProgressTasks: inProgressTasks.length,
      inProgressProjects: inProgressProjects.length,
      users: users.map((user) => ({
        ...user._doc,
        birthDay: user.birthDay.toISOString().split("T")[0],
      })),
    };
    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
exports.get_all_project_manager = async (req, res) => {
  try {
    const users = await User.find({
      role: "project manager",
    }).select("-password");
    const response = users.map((user) => {
      return {
        ...user._doc,
        birthDay: user.birthDay.toISOString().split("T")[0],
      };
    });
    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
exports.get_all_board_mananger = async (req, res) => {
  try {
    const users = await User.find({
      role: "board manager",
    }).select("-password");
    const response = users.map((user) => {
      return {
        ...user._doc,
        birthDay: user.birthDay.toISOString().split("T")[0],
      };
    });
    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
exports.get_only_user = async (req, res) => {
  try {
    const users = await User.find({
      role: "user",
    }).select("-password");

    const response = users.map((user) => {
      return {
        ...user._doc,
        birthDay: user.birthDay.toISOString().split("T")[0],
      };
    });
    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
//Lay danh sach user voi role admin
exports.get_all_admin = async (req, res) => {
  try {
    const users = await User.find({ role: "admin" }).select("-password");
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
//Lay thong tin nguoi dang nhap
exports.get_user_info = async (req, res, next) => {
  try {
    const token = req.query.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decodedToken = jwt.verify(token, config.jwt.secret);
    const memberId = decodedToken.id;

    const user = await User.findOne({ _id: memberId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const projectCount = await Project.countDocuments({ owner: memberId });
    const taskCount = await Task.countDocuments({ members: memberId });
    const boardCount = await Board.countDocuments({ board_leader: memberId });
    const createdTaskCount = await Task.countDocuments({ creator: memberId });
    if (user.birthDay) {
      // Format the birthdate to 'yyyy-mm-dd'
      birthdate = user.birthDay.toISOString().split("T")[0];
    }
    const response = {
      userinfo: {
        ...user._doc,
        birthdate,
        projectCount,
        taskCount,
        boardCount,
        createdTaskCount,
      },
    };

    return res.status(200).json(response);
  } catch (err) {
    console.error(err);
    return next(
      new BadRequestError(
        500,
        "An error occurred while retrieving user information"
      )
    );
  }
};
//sua thong tin nguoi dung
exports.update_user = async (req, res, next) => {
  const userId = req.params.id;
  const updates = req.body;

  try {
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return next(new BadRequestError(404, "User not found"));
    }
    // Update the project fields with the new values
    Object.keys(updates).forEach((key) => {
      user[key] = updates[key];
    });

    const updatedUser = await user.save();
    return res.status(200).json(updatedUser);
  } catch (err) {
    console.error(err);
    return next(
      new BadRequestError(500, "An error occurred while updating the project")
    );
  }
};
exports.deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    // Tìm người dùng theo ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Nếu vai trò của người dùng là "project manager"
    if (user.role === "project manager") {
      // Xóa các dự án có chủ sở hữu là ID của người dùng
      await Project.deleteMany({ owner: userId });
    }

    // Thực hiện xóa người dùng
    await user.remove();

    return res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
