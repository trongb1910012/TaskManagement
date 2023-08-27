const { BadRequestError } = require("../helpers/errors");
const handle = require("../helpers/promise");
const jwt = require("jsonwebtoken");
const config = require("../config");
const db = require("../models");
const Report = db.Report;
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
    const reports = await Report.find({ task_id: taskId });
    res.status(200).json(reports);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
//Tạo báo cáo
// Controller để thêm báo cáo
exports.addReport = async (req, res) => {
  try {
    const { title, description, project, task } = req.body;
    const token = req.query.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decodedToken = jwt.verify(token, config.jwt.secret);
    const author = decodedToken.id;

    // Tạo mới một báo cáo
    const report = new Report({
      title,
      description,
      author,
      project,
      task,
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
    const reportId = req.params.id;

    // Kiểm tra xem báo cáo có tồn tại không
    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({ message: "Báo cáo không tồn tại" });
    }

    // Kiểm tra quyền truy cập và xác thực người dùng
    // (Thêm mã logic xác thực người dùng theo yêu cầu của ứng dụng)

    // Xóa báo cáo từ cơ sở dữ liệu
    await report.remove();

    res.status(200).json({ message: "Báo cáo đã được xóa thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server khi xóa báo cáo" });
  }
};
