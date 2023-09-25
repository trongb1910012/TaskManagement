import React, { useEffect, useState } from "react";
import axiosClient from "../../api/api";
import classNames from "classnames/bind";
import styles from "./project.module.scss";

import { Gantt } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
const cx = classNames.bind(styles);
const TableComponent = () => {
  const [tasks, setTasks] = useState([]);
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axiosClient.get(`/projects/nv?token=${token}`);

      // Create tasks array from the API response
      const tasksData = response.data.projects.map((project) => ({
        start: new Date(project.startDate),
        end: new Date(project.endDate),
        name: project.title,
        id: project._id,
        type: "task",
        progress: 100,
        isDisabled: false, // Assuming all tasks are enabled
        styles: {
          progressColor: "#7171e8",
          progressSelectedColor: "#7171e8",
        },
      }));

      setTasks(tasksData); // Update the tasks state with the fetched data
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  // const handleDelete = async (projectId) => {
  //   try {
  //     const token = localStorage.getItem("token");
  //     const response = await axiosClient.delete(
  //       `/projects/${projectId}?token=${token}`
  //     );
  //     if (response.status === 200) {
  //       console.log("Project deleted successfully");
  //       fetchData(); // Fetch updated data after deletion
  //     }
  //   } catch (error) {
  //     console.error("Error deleting project:", error);
  //   }
  // };

  return (
    <div className={cx("wrapper")}>
      <div className={cx("gantt")}>
        {tasks.length > 0 && <Gantt tasks={tasks} />}
      </div>
    </div>
  );
};

export default TableComponent;
