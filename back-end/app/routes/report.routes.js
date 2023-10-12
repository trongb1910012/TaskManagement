const express = require("express");
const reports = require("../controllers/report.controller");

module.exports = (app) => {
  const router = express.Router();
  router.get("/", reports.get_BaoCao_Nv);
  router.get("/reportInfo", reports.getReportById);
  router.get("/:task_id", reports.getReport_ByTaskId);
  router.post("/", reports.addReport);
  router.patch("/resolve/:reportId", reports.resolveReport);
  router.patch("/reject/:reportId", reports.rejectReport);
  router.delete("/", reports.deleteReportById);
  app.use("/api/reports", router);
};
