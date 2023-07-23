const User = require("./user.model");
const Task = require("./tasks.model");
const mongoose = require("mongoose");

module.exports = (mongoose) => {
  const schema = mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
        trim: true,
      },
      content: {
        type: String,
        required: true,
        trim: true,
      },
      created_at: {
        type: Date,
        default: Date.now,
      },
      author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      tasks: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Task",
        },
      ],
    },
    { timestamps: true }
  );

  // Replace _id with id and remove __V
  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  return mongoose.model("Note", schema);
};
