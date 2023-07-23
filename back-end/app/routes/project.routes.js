const express = require("express");
const projects = require("../controllers/project.controller");

module.exports = (app) => {
  const router = express.Router();

  router.get("/", projects.get_KeHoach);
  router.post("/", projects.them_KeHoach);
  router.put("/:id", projects.sua_KeHoach);
  router.delete("/:id", projects.xoa_KeHoach);
  router.get("/nv", projects.get_KeHoach_Nv);
  app.use("/api/projects", router);
};
