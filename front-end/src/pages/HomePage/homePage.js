import React, { useState, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./homepage.module.scss";
import { Grid, Button } from "@mui/material";
import AssignedTaskTable from "../TaskPage/AssignedTaskTable";
// import ProjectList from "../TaskPage/taskTable";
import { AdminStat } from "./AdminStat";
import PieChart from "../PieChart/PieChart";
import ProjectPieChart from "../PieChart/ProjectPieChart";
import ProjectMangerTasks from "../TaskPage/PmTaskTable";
import BMTasks from "../TaskPage/BmTaskTable";
import { PMStat, BMStat } from "./PMStat";
import { PMExtendRequestList } from "../Extend/PMExtendList";
// import TableComponent from "../GanttTask/GanttTask";
// import MyCalendar from "../Calendar/Calendar";
const cx = classNames.bind(styles);
function HomePage() {
  const [role, setRole] = useState("");

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    setRole(userRole);
  }, []);
  const [showTasks, setShowTasks] = useState(true);

  const handleToggle = () => {
    setShowTasks(!showTasks);
  };
  return (
    <div className={cx("wrapper")}>
      {role === "admin" && <AdminStat />}
      <div className={cx("kaban")}>
        <Grid container>
          {role === "user" && (
            <Grid item xs={12} md={12} xl={12}>
              <AssignedTaskTable />
            </Grid>
          )}
          {role === "project manager" && (
            <>
              <Grid item xs={12} md={12} xl={12}>
                <PMStat />
              </Grid>

              <Grid item xs={6} md={3} xl={3}>
                <Button
                  variant="contained"
                  onClick={handleToggle}
                  style={{ backgroundColor: "#30324e", color: "#ffffff" }}
                >
                  Chart
                </Button>
              </Grid>
              {showTasks ? (
                <>
                  <Grid item xs={12} md={12} xl={12}>
                    <ProjectMangerTasks />
                  </Grid>
                </>
              ) : (
                <>
                  <Grid item xs={6} md={6} xl={3}>
                    Tasks
                    <PieChart />
                  </Grid>
                  <Grid item xs={6} md={6} xl={3}>
                    Projects
                    <ProjectPieChart />
                  </Grid>
                </>
              )}
              <Grid item xs={12} md={12} xl={12}>
                <PMExtendRequestList />
              </Grid>
            </>
          )}
          {/* {role === "admin" && (
            <Grid item xs={6} md={6} xl={3}>
              <PieChart />
            </Grid>
          )} */}
          {role === "board manager" && (
            <Grid item xs={6} md={6} xl={12}>
              <>
                <BMStat></BMStat>
                <BMTasks></BMTasks>
              </>
            </Grid>
          )}
        </Grid>
      </div>
    </div>
  );
}

export default HomePage;
