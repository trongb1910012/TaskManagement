import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Table,
  TableRow,
  TableCell,
  Avatar,
} from "@mui/material";
import axiosClient from "../../api/api";
import classNames from "classnames/bind";
import styles from "./ProfilePage.scss";
const cx = classNames.bind(styles);
const StudentProfile = () => {
  const [userinfo, setUserinfo] = useState([]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axiosClient.get(`/users/userinfo?token=${token}`);
      setUserinfo(response.data.userinfo);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div className={cx("student-profile")} style={{ padding: "1rem" }}>
      <div className="container">
        <div className="row">
          <div className="col-lg-4">
            <Card
              className={cx("card")}
              sx={{ boxShadow: "none", marginBottom: "1rem" }}
            >
              <CardHeader
                sx={{ background: "transparent", textAlign: "center" }}
                avatar={
                  <Avatar
                    alt={localStorage.getItem("fullname")}
                    src="/static/images/avatar.jpg"
                  />
                }
              />
              <CardContent>
                <p style={{ marginBottom: 0 }}>
                  <strong style={{ paddingRight: "0.25rem" }}>Name:</strong>
                  {userinfo.fullname}
                </p>
                <p style={{ marginBottom: 0 }}>
                  <strong style={{ paddingRight: "0.25rem" }}>User ID:</strong>
                  {userinfo._id}
                </p>
                <p style={{ marginBottom: 0 }}>
                  <strong style={{ paddingRight: "0.25rem" }}>Role:</strong>
                  {userinfo.role}
                </p>
                <p style={{ marginBottom: 0 }}>
                  <strong style={{ paddingRight: "0.25rem" }}>Email:</strong>
                  {userinfo.email}
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="col-lg-8">
            <Card sx={{ boxShadow: "none", marginBottom: "1rem" }}>
              <CardHeader
                sx={{ background: "transparent", border: "none" }}
                title={
                  <h3 style={{ marginBottom: 0 }}>
                    <i className="far fa-clone pr-1"></i>General Information
                  </h3>
                }
              />
              <CardContent
                sx={{
                  paddingTop: 0,
                  borderRadius: "18px",
                  background: "#dfdff5",
                }}
              >
                <Table>
                  <TableRow>
                    <TableCell sx={{ fontSize: "20px" }} width="30%">
                      Sign up Date
                    </TableCell>
                    <TableCell width="2%">:</TableCell>
                    <TableCell sx={{ fontSize: "20px" }}>
                      {userinfo.createdAt}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontSize: "20px" }} width="30%">
                      Task
                    </TableCell>
                    <TableCell width="2%">:</TableCell>
                    <TableCell sx={{ fontSize: "20px" }}>
                      {userinfo.taskCount}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontSize: "20px" }} width="30%">
                      Project
                    </TableCell>
                    <TableCell width="2%">:</TableCell>
                    <TableCell sx={{ fontSize: "20px" }}>
                      {userinfo.projectCount}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontSize: "20px" }} width="30%">
                      Board
                    </TableCell>
                    <TableCell width="2%">:</TableCell>
                    <TableCell sx={{ fontSize: "20px" }}>
                      {userinfo.boardCount}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontSize: "20px" }} width="30%">
                      Blood
                    </TableCell>
                    <TableCell width="2%">:</TableCell>
                    <TableCell sx={{ fontSize: "20px" }}>B+</TableCell>
                  </TableRow>
                </Table>
              </CardContent>
            </Card>
            <div style={{ height: "26px" }}></div>
            <Card sx={{ boxShadow: "none" }}>
              <CardHeader
                sx={{ background: "transparent", border: "none" }}
                title={
                  <h3 style={{ marginBottom: 0 }}>
                    <i className="far fa-clone pr-1"></i>Other Information
                  </h3>
                }
              />
              <CardContent sx={{ paddingTop: 0 }}>
                <p style={{ marginBottom: 0 }}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
