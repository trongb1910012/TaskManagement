import React, { useState, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./homepage.module.scss";
import axiosClient from "../../api/api";
import { Grid } from "@mui/material";
import AssignedTaskTable from "../TaskPage/AssignedTaskTable";
// import TableComponent from "../GanttTask/GanttTask";
// import MyCalendar from "../Calendar/Calendar";
const cx = classNames.bind(styles);
function HomePage() {
  const [dSKeHoach, setDSKeHoach] = useState([]);
  const [isCardOpen, setCardOpen] = useState({});
  const [role, setRole] = useState("");
  const getListProduct = async () => {
    const token = localStorage.getItem("token");
    const response = await axiosClient.get(`/boards/cv_leader?token=${token}`);
    setDSKeHoach(response.data);
  };
  useEffect(() => {
    getListProduct();
    const userRole = localStorage.getItem("role");
    setRole(userRole);
  }, []);
  const handleCardToggle = (boardId) => {
    setCardOpen((prevState) => ({
      ...prevState,
      [boardId]: !prevState[boardId],
    }));
  };
  return (
    <div className={cx("wrapper")}>
      <div className={cx("kaban")}>
        <Grid container spacing={2}>
          {/* <Grid item sm={12} xs={12} md={12} xl={12}>
            <TableComponent></TableComponent>
          </Grid> */}
          {/* <Grid item xs={12} md={6} xl={12}>
            <MyCalendar />
          </Grid> */}
        </Grid>
        <Grid container>
          {dSKeHoach.map((board) => (
            <Grid item xs={12} md={12} xl={12}>
              <div key={board._id} className={cx("board")}>
                <h2 className={cx("board_name")}>
                  {board.board_name}
                  <button
                    className={cx("board-btn")}
                    onClick={() => handleCardToggle(board._id)}
                  >
                    Task: {board.taskCount}
                  </button>
                </h2>

                {/* Hiển thị các task thuộc board */}
                {isCardOpen[board._id] && (
                  <>
                    {board.tasks.map((task) => (
                      <div key={task._id} className={cx("task")}>
                        <h3>Task: {task.title}</h3>
                        <p>Description: {task.description}</p>
                        <p>Status: {task.status}</p>
                        <p>
                          Member:{" "}
                          {task.members.map((mb) => (
                            <p>
                              {"-"}
                              {mb.fullname}
                            </p>
                          ))}
                        </p>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </Grid>
          ))}
          {role === "user" && (
            <Grid item xs={12} md={12} xl={12}>
              <AssignedTaskTable />
            </Grid>
          )}
        </Grid>
      </div>
    </div>
  );
}

export default HomePage;
