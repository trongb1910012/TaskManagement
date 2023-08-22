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
