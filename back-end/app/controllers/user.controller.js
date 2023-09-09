const { BadRequestError } = require("../helpers/errors");
const handle = require("../helpers/promise");
const jwt = require("jsonwebtoken");
const config = require("../config");
const db = require("../models");
const User = db.User;
//Lay danh sach user
exports.get_all_user = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
//Lay danh sach user voi role admin
exports.get_all_admin = async (req, res) => {
  try {
    const users = await User.find({ role: "admin" }).select("-password");
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
//Lay thong tin nguoi dang nhap
exports.get_user_info = async (req, res, next) => {
  try {
    const token = req.query.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decodedToken = jwt.verify(token, config.jwt.secret);
    const memberId = decodedToken.id;

    const user = await User.findOne({
      _id: memberId,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const response = {
      userinfo: user,
    };

    return res.status(200).json(response);
  } catch (err) {
    console.error(err);
    return next(
      new BadRequestError(
        500,
        "An error occurred while retrieving user information"
      )
    );
  }
};
