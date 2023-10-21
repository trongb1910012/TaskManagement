const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("../config");
const { BadRequestError } = require("../helpers/errors");
const handle = require("../helpers/promise");
const db = require("../models");
const User = db.User;

exports.signup = async (req, res, next) => {
  const defaultDateOfBirth = new Date(2000, 0, 1);
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    fullname: req.body.fullname,
    password: bcrypt.hashSync(req.body.password, 8),
    birthDay: req.body.birthDay || new Date(2000, 0, 1),
  });

  const [error] = await handle(user.save());

  if (error) {
    let statusCode = 400;
    let { username = {}, email = {}, password = {} } = error.errors;

    const errorMessage = username.message || email.message || password.message;
    if (!errorMessage) {
      statusCode = 500;
    }

    return next(new BadRequestError(statusCode, errorMessage));
  }

  res.send({ message: "User was successfully registered" });
};

exports.signin = async (req, res, next) => {
  const [error, user] = await handle(
    User.findOne({
      username: req.body.username,
    }).exec()
  );

  if (error) {
    console.log(error);
    return next(new BadRequestError(500));
  }

  if (!user) {
    return next(new BadRequestError(401, "Incorrect username or password"));
  }

  const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

  if (!passwordIsValid) {
    return next(new BadRequestError(401, "Incorrect username or password"));
  }

  const token = jwt.sign({ id: user.id }, config.jwt.secret, {
    expiresIn: 86400, // 24 hours
  });

  res.status(200).send({
    id: user._id,
    username: user.username,
    email: user.email,
    fullname: user.fullname,
    accessToken: token,
    role: user.role,
  });
};

exports.changeUserRole = async (req, res, next) => {
  const { id } = req.params;
  const { role } = req.body;

  try {
    const user = await User.findById(id);

    if (!user) {
      return next(new Error("User not found"));
    }

    user.role = role;
    await user.save();

    res.send({ message: "User role updated successfully" });
  } catch (error) {
    return next(error);
  }
};
//Doi mat khau nguoi dung
exports.changePassword = async (req, res) => {
  const { userId, currentPassword, newPassword } = req.body;

  try {
    // Find the user by userId
    const user = await User.findById(userId);

    // Verify the current password
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while changing the password" });
  }
};
