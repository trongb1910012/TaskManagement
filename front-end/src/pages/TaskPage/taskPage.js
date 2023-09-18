import React from "react";
import TaskTable from "./taskTable";
import AssignedTaskTable from "./AssignedTaskTable";
import classNames from "classnames/bind";
import styles from "./AddTaskForm.module.scss";
const cx = classNames.bind(styles);
const taskPage = () => {
  return (
    <div className={cx("wrapper")}>
      <AssignedTaskTable />
      <TaskTable />
    </div>
  );
};

export default taskPage;
