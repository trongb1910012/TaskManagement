const express = require("express");
const users = require("../controllers/user.controller");

module.exports = (app) => {
  const router = express.Router();

  router.get("/", users.get_all_user);
  router.get("/dsAdmin", users.get_all_admin);
  router.get("/userinfo", users.get_user_info);
  app.use("/api/users", router);
};
