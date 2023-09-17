import React from "react";
import TaskTable from "./taskTable";
import AssignedTaskTable from "./AssignedTaskTable";
const taskPage = () => {
  return (
    <div>
      <TaskTable />
      <AssignedTaskTable />
    </div>
  );
};

export default taskPage;
