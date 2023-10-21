const express = require("express");
const tasks = require("../controllers/task.controller");

module.exports = (app) => {
  const router = express.Router();

  router.get("/", tasks.get_CongViec);
  router.get("/nv", tasks.get_CongViec_Nv);
  router.get("/chart", tasks.getTaskStatusCounts);
  router.get("/created", tasks.get_created_tasks);
  router.get("/ownerTasks", tasks.getProjectsBoardsTasks);
  router.get("/leaderTasks", tasks.getBoardsTasks);
  router.get("/taskinfo", tasks.getTaskById);
  router.get("/deadline", tasks.getTasksNearDeadline);
  router.get("/:id", tasks.get_CV_KeHoach);
  router.post("/", tasks.them_CongViec);
  router.post("/updateStatus", tasks.updateTaskStatus);
  router.put("/", tasks.updateTaskStatus);
  router.patch("/start/:taskId", tasks.AcceptTask1);
  router.patch("/complete/:taskId", tasks.ConfirmCompletedTask);
  router.put("/:id", tasks.sua_CongViec);
  router.delete("/", tasks.xoa_CongViec);
  app.use("/api/tasks", router);
};
