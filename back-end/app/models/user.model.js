module.exports = (mongoose) => {
  const schema = mongoose.Schema(
    {
      username: {
        type: String,
        required: [true, "Username is required"],
      },
      fullname: {
        type: String,
        required: [true, "Full name is required"],
      },
      email: {
        type: String,
        required: [true, "Email is required"],
      },
      password: {
        type: String,
        required: [true, "Password is required"],
      },
      role: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
      },
    },
    { timestamps: true }
  );

  return mongoose.model("User", schema);
};
