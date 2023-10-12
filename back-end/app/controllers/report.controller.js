const { BadRequestError } = require("../helpers/errors");
const handle = require("../helpers/promise");
const jwt = require("jsonwebtoken");
const config = require("../config");
const db = require("../models");
const Report = db.Report;
const Board = db.Board;
const Task = db.Task;
const Project = db.Project;
// Lấy báo cáo của nhân viên
exports.get_BaoCao_Nv = async (req, res, next) => {
  try {
    const token = req.query.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decodedToken = jwt.verify(token, config.jwt.secret);
    const memberId = decodedToken.id;

    const reports = await Report.find({
      author: memberId,
    })
      .populate({
        path: "author",
        select: "fullname",
      })
      .populate({
        path: "project",
        select: "title",
      });

    const response = {
      reports: reports,
    };
    return res.status(200).json(response);
  } catch (err) {
    console.error(err);
    return next(
      new BadRequestError(500, "An error occurred while retrieving report")
    );
  }
};
//Lấy báo cáo theo task id
exports.getReport_ByTaskId = async (req, res) => {
  try {
    const taskId = req.params.task_id;

    const reports = await Report.find({ task: taskId })
      .populate({
        path: "author",
        select: "fullname",
      })
      .populate({
        path: "task",
        select: "title",
      })
      .populate({
        path: "project",
        select: "title",
      })
      .sort({ status: 1, createdAt: -1 }) // sort by createdAt descending
      .exec();

    const formattedReports = reports.map((report) => {
      const formattedDate = new Date(report.createdAt)
        .toISOString()
        .substr(0, 10);
      return {
        ...report._doc,
        createdAt: formattedDate,
      };
    });

    res.status(200).json(formattedReports);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
//Tạo báo cáo
// Controller để thêm báo cáo
exports.addReport = async (req, res) => {
  try {
    const { title, description, taskId } = req.body;
    const token = req.query.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decodedToken = jwt.verify(token, config.jwt.secret);
    const author = decodedToken.id;

    // Truy vấn task dựa trên taskId
    const task = await Task.findOne({ _id: taskId }).populate("board");
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Truy vấn project dựa trên board.project
    const project = await Project.findById(task.board.project);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Tạo mới một báo cáo
    const report = new Report({
      title,
      description,
      author,
      project,
      task: taskId, // Assign taskId to the task field
    });

    // Lưu báo cáo vào cơ sở dữ liệu
    await report.save();

    res.status(201).json({ message: "Báo cáo đã được thêm thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server khi thêm báo cáo" });
  }
};
// Xóa báo cáo
// Xóa báo cáo bằng ID
exports.deleteReportById = async (req, res) => {
  try {
    const { id } = req.body; // Lấy id từ req.body

    // Kiểm tra xem báo cáo có tồn tại không
    const report = await Report.findById(id);
    if (!report) {
      return res.status(404).json({ message: "Báo cáo không tồn tại" });
    }

    // Kiểm tra quyền truy cập và xác thực người dùng

    // Xóa báo cáo từ cơ sở dữ liệu
    await report.remove();

    res.status(200).json({ message: "Báo cáo đã được xóa thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server khi xóa báo cáo" });
  }
};
//Giải quyết báo cáo
exports.resolveReport = async (req, res, next) => {
  try {
    const reportId = req.params.reportId;

    // Find the report by ID
    const report = await Report.findById(reportId);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    // Check if the report is already resolved
    if (report.status === "resolved") {
      return res.status(400).json({ message: "Report is already resolved" });
    }
    if (report.status === "rejected") {
      return res.status(400).json({ message: "Report is already rejected" });
    }

    // Update the report status to "resolved"
    report.status = "resolved";
    await report.save();

    return res.json({ message: "Report resolved" });
  } catch (err) {
    next(err);
  }
};
//từ chối báo cáo
exports.rejectReport = async (req, res, next) => {
  try {
    const reportId = req.params.reportId;

    // Find the report by ID
    const report = await Report.findById(reportId);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    // Check if the report is already resolved
    if (report.status === "rejected") {
      return res.status(400).json({ message: "Report is already rejected" });
    }
    if (report.status === "resolved") {
      return res.status(400).json({ message: "Report is already resolved" });
    }

    // Update the report status to "resolved"
    report.status = "rejected";
    await report.save();

    return res.json({ message: "Report rejected" });
  } catch (err) {
    next(err);
  }
};
//Thông tin báo cáo
exports.getReportById = async (req, res) => {
  try {
    const { id } = req.query;

    const report = await Report.findById(id)
      .populate({
        path: "author",
        select: "fullname",
      })
      .populate({
        path: "task",
        select: "title",
        populate: {
          path: "board",
          select: "board_name",
          populate: { path: "project", select: "title" },
        },
      });
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }
    const formattedDate = new Date(report.createdAt)
      .toISOString()
      .substr(0, 10);
    const task = await Task.findById(report.task._id);
    const board = await Board.findById(task.board._id);
    const project = await Project.findById(board.project._id);
    const formattedReport = {
      ...report._doc,
      createdAt: formattedDate,
      taskName: task.title,
      boardName: board.board_name,
      projectName: project.title,
    };
    // Trả về kết quả
    return res.json(formattedReport);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
