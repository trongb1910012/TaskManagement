const User = require("../models/user.model");
const Task = require("../models/tasks.model");
module.exports = (mongoose) => {
  const schema = mongoose.Schema(
    {
      task_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
      },
      user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      comment_text: {
        type: String,
      },
      new_dueDate: {
        type: Date,
        required: true,
      },
      status: {
        type: String,
        enum: ["open", "resolved", "rejected"],
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

  return mongoose.model("Comment", schema);
};
