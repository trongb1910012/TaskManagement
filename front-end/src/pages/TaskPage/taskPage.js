import React from "react";
import TaskTable from "./taskTable";
import AssignedTaskTable from "./AssignedTaskTable";
const taskPage = () => {
  return (
    <div>
      <AssignedTaskTable />
      <TaskTable />
    </div>
  );
};

export default taskPage;
