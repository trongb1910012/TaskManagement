import React from "react";
import TaskTable from "./taskTable";
import AssignedTaskTable from "./AssignedTaskTable";
const taskPage = () => {
  return (
    <div>
      <h1>Created task</h1>
      <TaskTable />
      <h1>Assigned task</h1>
      <AssignedTaskTable />
    </div>
  );
};

export default taskPage;
