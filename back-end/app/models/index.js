const mongoose = require("mongoose");

const createUserModel = require("./user.model");
const createProjectModel = require("./project.model");
const createTaskModel = require("./tasks.model");
const createBoardModel = require("./boards.model");
const createCommentModel = require("./comment.model");
const createReportModel = require("./reports.model");
const db = {};
db.mongoose = mongoose;

db.User = createUserModel(mongoose);
db.Project = createProjectModel(mongoose);
db.Task = createTaskModel(mongoose);
db.Board = createBoardModel(mongoose);
db.Comment = createCommentModel(mongoose);
db.Report = createReportModel(mongoose);

module.exports = db;
