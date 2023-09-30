const express = require("express");
const reports = require("../controllers/report.controller");

module.exports = (app) => {
  const router = express.Router();
  router.get("/", reports.get_BaoCao_Nv);
  router.get("/:task_id", reports.getReport_ByTaskId);
  router.post("/", reports.addReport);
  router.delete("/", reports.deleteReportById);
  app.use("/api/reports", router);
};
