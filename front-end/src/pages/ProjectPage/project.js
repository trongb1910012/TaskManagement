import React, { useEffect, useState } from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
} from "@mui/material";
import axiosClient from "../../api/api";
import classNames from "classnames/bind";
import styles from "./project.module.scss";
const cx = classNames.bind(styles);
const TableComponent = () => {
  const [data, setData] = useState([]);
  const [newRow, setNewRow] = useState({});
  const [showForm, setShowForm] = useState(false);
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axiosClient.get(`/projects/nv?token=${token}`);
      setData(response.data.projects);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchData();
  });

  function handleUpdate(projectId) {
    // Handle update logic for the selected project
    console.log("Update project:", projectId);
  }

  const handleDelete = async (projectId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axiosClient.delete(
        `/projects/${projectId}?token=${token}`
      );
      if (response.status === 200) {
        console.log("Project deleted successfully");
        fetchData(); // Fetch updated data after deletion
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const response = await axiosClient.post(
        `/projects?token=${token}`,
        newRow,
        {}
      );

      console.log(response.data); // Xử lý phản hồi theo ý muốn

      // Cập nhật trực tiếp mảng dSKeHoach với dự án mới
      fetchData();

      // Xóa nội dung của hàng nhập liệu sau khi gửi thành công
      setNewRow({});
    } catch (error) {
      console.error(error); // Xử lý lỗi một cách phù hợp
    }
  };
  const handleChange = (e, field) => {
    setNewRow({ ...newRow, [field]: e.target.value });
  };
  const toggleForm = () => {
    setShowForm(!showForm); // Toggle the state variable
  };
  return (
    <div>
      <Table className={cx("table")}>
        <TableHead className={cx("table-head")}>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Start Date</TableCell>
            <TableCell>End Date</TableCell>
            <TableCell>Budget</TableCell>
            <TableCell>Owner</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item) => (
            <TableRow className={cx("table-row")} key={item._id}>
              <TableCell>{item.title}</TableCell>
              <TableCell>{item.description}</TableCell>
              <TableCell>{item.startDate}</TableCell>
              <TableCell>{item.endDate}</TableCell>
              <TableCell>{item.budget}</TableCell>
              <TableCell>{item.owner.fullname}</TableCell>
              <TableCell>
                <Button
                  className={cx("button")}
                  variant="outlined"
                  color="primary"
                  onClick={() => handleUpdate(item._id)}
                >
                  Update
                </Button>
                <Button
                  className={cx("button")}
                  variant="outlined"
                  color="error"
                  onClick={() => handleDelete(item._id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {showForm && (
            <TableRow className={cx("table-row")}>
              <TableCell>
                <input
                  type="text"
                  value={newRow.title || ""}
                  onChange={(e) => handleChange(e, "title")}
                  placeholder="Title"
                />
              </TableCell>
              <TableCell>
                <input
                  type="text"
                  value={newRow.description || ""}
                  onChange={(e) => handleChange(e, "description")}
                  placeholder="Description"
                />
              </TableCell>
              <TableCell>
                <input
                  type="date"
                  value={newRow.startDate || ""}
                  onChange={(e) => handleChange(e, "startDate")}
                  placeholder="Start Date"
                />
              </TableCell>
              <TableCell>
                <input
                  type="date"
                  value={newRow.endDate || ""}
                  onChange={(e) => handleChange(e, "endDate")}
                  placeholder="End Date"
                />
              </TableCell>
              <TableCell>
                <input
                  type="text"
                  value={newRow.budget || ""}
                  onChange={(e) => handleChange(e, "budget")}
                  placeholder="Budget"
                />
              </TableCell>

              <TableCell>{localStorage.getItem("fullname")}</TableCell>
              <TableCell>
                <Button
                  className={cx("button")}
                  variant="outlined"
                  color="primary"
                  onClick={handleSubmit}
                >
                  Add Row
                </Button>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Button
        className={cx("button")}
        variant="outlined"
        color="primary"
        onClick={toggleForm}
      >
        {showForm ? "Hủy Thêm" : "Thêm"}
      </Button>
    </div>
  );
};

export default TableComponent;
