const mongoose = require("mongoose");

const createUserModel = require("./user.model");
const createProjectModel = require("./project.model");
const createTaskModel = require("./tasks.model");
const createNoteModel = require("./note.model");
const db = {};
db.mongoose = mongoose;

db.User = createUserModel(mongoose);
db.Project = createProjectModel(mongoose);
db.Task = createTaskModel(mongoose);
db.Note = createNoteModel(mongoose);

module.exports = db;
