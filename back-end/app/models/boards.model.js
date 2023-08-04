const mongoose = require("mongoose");
const Project = require("../models/project.model");
module.exports = (mongoose) => {
  const schema = mongoose.Schema(
    {
      board_name: {
        type: String,
        required: true,
        trim: true,
      },
      project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true,
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

  return mongoose.model("Board", schema);
};
