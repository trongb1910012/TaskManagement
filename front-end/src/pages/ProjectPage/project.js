import React, { useEffect, useState } from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  IconButton,
} from "@mui/material";
import axiosClient from "../../api/api";
import classNames from "classnames/bind";
import styles from "./project.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCancel,
  faPenToSquare,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import cogoToast from "cogo-toast";
const cx = classNames.bind(styles);
const TableComponent = () => {
  const [data, setData] = useState([]);
  const [newRow, setNewRow] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [sortColumn, setSortColumn] = useState(""); // Track the currently sorted column
  const [sortDirection, setSortDirection] = useState(""); // Track the sorting direction (asc or desc)
  const [editRow, setEditRow] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
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
      console.log(response);
      cogoToast.success("Thêm dự án thành công");

      // Cập nhật trực tiếp mảng dSKeHoach với dự án mới
      fetchData();

      // Xóa nội dung của hàng nhập liệu sau khi gửi thành công
      setNewRow({});
    } catch (error) {
      cogoToast.error("Cần điền các thông tin trống"); // Xử lý lỗi một cách phù hợp
    }
  };
  const handleChange = (e, field) => {
    setNewRow({ ...newRow, [field]: e.target.value });
  };
  const toggleForm = () => {
    setShowForm(!showForm); // Toggle the state variable
  };
  const handleSort = (column) => {
    if (column === sortColumn) {
      // If the same column is clicked, toggle the sorting direction
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // If a different column is clicked, set the new column and default sorting direction to ascending
      setSortColumn(column);
      setSortDirection("asc");
    }
  };
  // Inside the return statement, before mapping the data
  // Inside the return statement, before mapping the data
  // Inside the return statement, before mapping the data
  const sortedData = [...data];
  if (sortColumn) {
    sortedData.sort((a, b) => {
      const valueA = new Date(a[sortColumn]);
      const valueB = new Date(b[sortColumn]);

      if (valueA < valueB) {
        return sortDirection === "asc" ? -1 : 1;
      }
      if (valueA > valueB) {
        return sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    });
  }
  // Sua ke hoach
  const handleEdit = (row) => {
    setEditRow(row); // Lưu thông tin của hàng dữ liệu đang được chỉnh sửa
    setShowEditForm(true); // Hiển thị pop-up form
  };
  const handleUpdateSubmit = async (event) => {
    event.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const response = await axiosClient.put(
        `/projects/${editRow._id}?token=${token}`,
        editRow
      );

      console.log(response.data); // Xử lý phản hồi theo ý muốn
      cogoToast.success("Cập nhật dự án thành công");
      fetchData(); // Cập nhật dữ liệu sau khi chỉnh sửa thành công

      // Đặt lại giá trị cho editRow và đóng pop-up form
      setEditRow(null);
      setShowEditForm(false);
    } catch (error) {
      console.error(error); // Xử lý lỗi một cách phù hợp
    }
  };
  const handleCancelEdit = () => {
    setEditRow(null); // Đặt lại giá trị cho editRow
    setShowEditForm(false); // Tắt pop-up form
  };
  return (
    <div>
      <div className={cx("button-group")}>
        <IconButton
          className={cx("add-button")}
          color="primary"
          onClick={toggleForm}
        >
          {showForm ? (
            <FontAwesomeIcon icon={faCancel} />
          ) : (
            <FontAwesomeIcon icon={faPlus} />
          )}
        </IconButton>
      </div>
      <Table className={cx("table")}>
        <TableHead className={cx("table-head")}>
          <TableRow>
            <TableCell>
              <Button
                onClick={() => handleSort("title")}
                variant="text"
                color="inherit"
              >
                Title
                {sortColumn === "title" && (
                  <span
                    className={cx("sort-icon", {
                      asc: sortDirection === "asc",
                      desc: sortDirection === "desc",
                    })}
                  ></span>
                )}
              </Button>
            </TableCell>
            <TableCell>Description</TableCell>
            <TableCell>
              <Button
                onClick={() => handleSort("startDate")}
                variant="text"
                color="inherit"
              >
                Start Date
                {sortColumn === "startDate" && (
                  <span
                    className={cx("sort-icon", {
                      asc: sortDirection === "asc",
                      desc: sortDirection === "desc",
                    })}
                  ></span>
                )}
              </Button>
            </TableCell>
            <TableCell>
              <Button
                onClick={() => handleSort("endDate")}
                variant="text"
                color="inherit"
              >
                End Date
                {sortColumn === "endDate" && (
                  <span
                    className={cx("sort-icon", {
                      asc: sortDirection === "asc",
                      desc: sortDirection === "desc",
                    })}
                  ></span>
                )}
              </Button>
            </TableCell>
            <TableCell>
              <Button
                onClick={() => handleSort("budget")}
                variant="text"
                color="inherit"
              >
                Budget
                {sortColumn === "budget" && (
                  <span
                    className={cx("sort-icon", {
                      asc: sortDirection === "asc",
                      desc: sortDirection === "desc",
                    })}
                  ></span>
                )}
              </Button>
            </TableCell>
            {/* <TableCell>Owner</TableCell> */}
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedData.map((item) => (
            <TableRow className={cx("table-row")} key={item._id}>
              <TableCell className={cx("small-font")}>{item.title}</TableCell>
              <TableCell className={cx("small-font")}>
                {item.description}
              </TableCell>
              <TableCell className={cx("small-font")}>
                {item.startDate}
              </TableCell>
              <TableCell className={cx("small-font")}>{item.endDate}</TableCell>
              <TableCell className={cx("small-font")}>{item.budget}</TableCell>
              {/* <TableCell>{item.owner.fullname}</TableCell> */}
              <TableCell className={cx("small-font")}>
                <IconButton
                  className={cx("button")}
                  variant="outlined"
                  color="primary"
                  onClick={() => handleEdit(item)}
                >
                  <FontAwesomeIcon icon={faPenToSquare} />
                </IconButton>
                <IconButton
                  className={cx("button")}
                  variant="outlined"
                  color="error"
                  onClick={() => handleDelete(item._id)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
          {showForm && (
            <TableRow className={cx("table-row")}>
              <TableCell>
                <input
                  className={cx("form-input")}
                  type="text"
                  value={newRow.title || ""}
                  onChange={(e) => handleChange(e, "title")}
                  placeholder="Title"
                />
              </TableCell>
              <TableCell>
                <input
                  className={cx("form-input")}
                  type="text"
                  value={newRow.description || ""}
                  onChange={(e) => handleChange(e, "description")}
                  placeholder="Description"
                />
              </TableCell>
              <TableCell>
                <input
                  className={cx("form-input")}
                  type="date"
                  value={newRow.startDate || ""}
                  onChange={(e) => handleChange(e, "startDate")}
                  placeholder="Start Date"
                />
              </TableCell>
              <TableCell>
                <input
                  className={cx("form-input")}
                  type="date"
                  value={newRow.endDate || ""}
                  onChange={(e) => handleChange(e, "endDate")}
                  placeholder="End Date"
                />
              </TableCell>
              <TableCell>
                <input
                  className={cx("form-input")}
                  type="text"
                  value={newRow.budget || ""}
                  onChange={(e) => handleChange(e, "budget")}
                  placeholder="Budget"
                />
              </TableCell>

              {/* <TableCell>{localStorage.getItem("fullname")}</TableCell> */}
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
      {showEditForm && (
        <div className={cx("popup-form")}>
          <form onSubmit={handleUpdateSubmit}>
            {/* Hiển thị các trường dữ liệu để chỉnh sửa */}
            <input
              className={cx("pop-form-input")}
              type="text"
              value={editRow.title || ""}
              onChange={(e) =>
                setEditRow({ ...editRow, title: e.target.value })
              }
              placeholder="Title"
            />
            <input
              className={cx("pop-form-input")}
              type="text"
              value={editRow.description || ""}
              onChange={(e) =>
                setEditRow({ ...editRow, description: e.target.value })
              }
              placeholder="Description"
            />
            <input
              className={cx("pop-form-input")}
              type="date"
              value={editRow.startDate || ""}
              onChange={(e) =>
                setEditRow({ ...editRow, startDate: e.target.value })
              }
              placeholder="Start date"
            />
            <input
              className={cx("pop-form-input")}
              type="date"
              value={editRow.endDate || ""}
              onChange={(e) =>
                setEditRow({ ...editRow, endDate: e.target.value })
              }
              placeholder="End date"
            />
            <input
              className={cx("pop-form-input")}
              type="text"
              value={editRow.budget || ""}
              onChange={(e) =>
                setEditRow({ ...editRow, budget: e.target.value })
              }
              placeholder="Budget"
            />
            <div className={cx("edit-button")}>
              <Button
                className={cx("edit-save-button")}
                variant="outlined"
                color="primary"
                type="submit"
                style={{ display: "inline-block", marginRight: "10px" }}
              >
                Update
              </Button>
              <Button
                className={cx("edit-cancel-button")}
                variant="outlined"
                color="secondary"
                onClick={handleCancelEdit}
                style={{ display: "inline-block" }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default TableComponent;
