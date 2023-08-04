const User = require("../models/user.model");
const Board = require("../models/boards.model");
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
      dueDate: {
        type: Date,
        required: true,
      },
      status: {
        type: String,
        enum: ["not started", "in progress", "completed"],
        default: "not started",
      },
      // Reference to the project this task belongs to
      board: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Board",
        required: true,
      },
      members: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
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

  return mongoose.model("Task", schema);
};
