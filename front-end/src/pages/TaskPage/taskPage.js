import React from "react";
import TaskTable from "./taskTable";
import AssignedTaskTable from "./AssignedTaskTable";
import classNames from "classnames/bind";
import styles from "./AddTaskForm.module.scss";
const cx = classNames.bind(styles);

const taskPage = () => {
  // Đọc giá trị "role" từ localStorage
  const role = localStorage.getItem("role");

  return (
    <div className={cx("wrapper")}>
      {role === "user" ? <AssignedTaskTable /> : <TaskTable />}
    </div>
  );
};

export default taskPage;
