import React from "react";
import TaskTable from "./taskTable";

const tasks = [
  {
    name: "Task 1",
    assignee: ["hello", "hi"],
    dueDate: "2023-09-10",
    status: "In Progress",
  },
  {
    name: "Task 2",
    assignee: "Jane Smith",
    dueDate: "2023-09-15",
    status: "Pending",
  },
  // ...
];

const taskPage = () => {
  return (
    <div>
      <h1>Task Table</h1>
      <TaskTable tasks={tasks} />
    </div>
  );
};

export default taskPage;
