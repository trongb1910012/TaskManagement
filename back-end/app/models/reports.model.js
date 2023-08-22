const mongoose = require("mongoose");
const User = require("../models/user.model");
const Project = require("../models/project.model");
const Task = require("../models/tasks.model");

module.exports = (mongoose) => {
  const schema = mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
        trim: true,
      },
      description: {
        type: String,
        required: true,
        trim: true,
      },
      author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true,
      },
      task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
        required: true,
      },
      status: {
        type: String,
        enum: ["open", "resolved"],
        default: "open",
      },
    },
    { timestamps: true }
  );

  // Replace _id with id and remove __V
  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  return mongoose.model("Report", schema);
};
