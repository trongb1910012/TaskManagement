import React, { useState, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./homepage.module.scss";
import axiosClient from "../../api/api";
import { Grid } from "@mui/material";
import TableComponent from "../GanttTask/GanttTask";
const cx = classNames.bind(styles);
function HomePage() {
  const [dSKeHoach, setDSKeHoach] = useState([]);
  // const [newRow, setNewRow] = useState({});
  // const [showForm, setShowForm] = useState(false); // State variable for form toggle
  // const [sortField, setSortField] = useState(""); // State variable for sorting field
  // const [sortOrder, setSortOrder] = useState(""); // State variable for sorting order
  // const [filterField, setFilterField] = useState(""); // State variable for filtering field
  // const [filterValue, setFilterValue] = useState(""); // State variable for filtering value
  const getListProduct = async () => {
    const token = localStorage.getItem("token");
    const response = await axiosClient.get(`/boards/cv_leader?token=${token}`);
    setDSKeHoach(response.data);
  };
  useEffect(() => {
    getListProduct();
  }, []);
  // const handleSubmit = async (event) => {
  //   event.preventDefault();

  //   try {
  //     const token = localStorage.getItem("token");
  //     const response = await axiosClient.post(
  //       `/projects?token=${token}`,
  //       newRow,
  //       {}
  //     );

  //     console.log(response.data); // Xử lý phản hồi theo ý muốn

  //     // Cập nhật trực tiếp mảng dSKeHoach với dự án mới
  //     getListProduct();

  //     // Xóa nội dung của hàng nhập liệu sau khi gửi thành công
  //     setNewRow({});
  //   } catch (error) {
  //     console.error(error); // Xử lý lỗi một cách phù hợp
  //   }
  // };
  // const handleChange = (e, field) => {
  //   setNewRow({ ...newRow, [field]: e.target.value });
  // };
  // const toggleForm = () => {
  //   setShowForm(!showForm); // Toggle the state variable
  // };
  // const handleSort = (field) => {
  //   if (sortField === field) {
  //     // If the same field is clicked again, toggle the sort order
  //     setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  //   } else {
  //     // If a new field is clicked, set the sort field and default sort order to ascending
  //     setSortField(field);
  //     setSortOrder("asc");
  //   }
  // };
  // const renderSortIcon = (field) => {
  //   if (sortField === field) {
  //     if (sortOrder === "asc") {
  //       return <span>&uarr;</span>; // Up arrow for ascending order
  //     } else {
  //       return <span>&darr;</span>; // Down arrow for descending order
  //     }
  //   }
  //   return null; // No icon if the field is not sorted
  // };
  // const handleFilterFieldChange = (e) => {
  //   setFilterField(e.target.value);
  // };

  // const handleFilterValueChange = (e) => {
  //   setFilterValue(e.target.value);
  // };
  return (
    <div className={cx("wrapper")}>
      <div className={cx("kaban")}>
        <Grid item xl={6}>
          <TableComponent></TableComponent>
        </Grid>
        <Grid container>
          {dSKeHoach.map((board) => (
            <Grid xs={4} md={3} xl={12}>
              <div key={board.id} className={cx("board")}>
                <h2 className={cx("board_name")}>{board.board_name}</h2>

                {/* Hiển thị các task thuộc board */}
                {board.tasks.map((task) => (
                  <div key={task.id} className={cx("task")}>
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
              </div>
            </Grid>
          ))}
        </Grid>
      </div>
    </div>
  );
}

export default HomePage;
