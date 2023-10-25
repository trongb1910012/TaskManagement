const express = require("express");
const reports = require("../controllers/report.controller");
const upload = require("../middlewares/uploads");
module.exports = (app) => {
  const router = express.Router();
  router.get("/", reports.get_BaoCao_Nv);
  router.get("/reportInfo", reports.getReportById);
  router.get("/:task_id", reports.getReport_ByTaskId);
  router.get("/download/:filename", reports.downloadFile);
  router.post("/", upload.single("file"), reports.addReport);
  router.patch("/resolve/:reportId", reports.resolveReport);
  router.patch("/reject/:reportId", reports.rejectReport);
  router.delete("/", reports.deleteReportById);
  app.use("/api/reports", router);
};
