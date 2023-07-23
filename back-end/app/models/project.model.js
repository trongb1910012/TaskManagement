const User = require("../models/user.model");
const Task = require("../models/tasks.model");
module.exports = (mongoose) => {
  const schema = mongoose.Schema({
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
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["planned", "in progress", "completed"],
      default: "planned",
    },
    budget: {
      type: Number,
      required: true,
      min: 0,
    },
    // Reference to the user who owns the project
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // Array of references to the users who are working on the project
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    tasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
  });

  // Replace _id with id and remove __V
  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  return mongoose.model("Project", schema);
};
