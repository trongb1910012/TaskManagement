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
import styles from "./board.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCancel,
  faPenToSquare,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { Pagination } from "@mui/material";
import cogoToast from "cogo-toast";
import swal from "sweetalert";
import "gantt-task-react/dist/index.css";
const cx = classNames.bind(styles);
const BoardComponent = () => {
  const [data, setData] = useState([]);
  const [newRow, setNewRow] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [sortColumn, setSortColumn] = useState(""); // Track the currently sorted column
  const [sortDirection, setSortDirection] = useState(""); // Track the sorting direction (asc or desc)
  const [editRow, setEditRow] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [projectList, setProjectList] = useState([]);
  const PAGE_SIZE = 3; // Số lượng dòng hiển thị trên mỗi trang
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const getPageData = () => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    return sortedData.slice(startIndex, endIndex);
  };
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axiosClient.get(
        `/boards/cv_leader?token=${token}`
      );
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchData();
  });
  useEffect(() => {
    const getProjectList = async () => {
      const token = localStorage.getItem("token");
      const response = await axiosClient.get(`/projects/nv?token=${token}`);
      setProjectList(response.data.projects);
    };
    getProjectList();
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

  const handleDelete = (projectId) => {
    swal({
      title: `Bạn chắc chắn muốn xóa công việc ${projectId.title} này`,
      text: "Sau khi xóa, bạn sẽ không thể khôi phục công việc này!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const token = localStorage.getItem("token");
        await axiosClient.delete(`/projects/${projectId._id}?token=${token}`);
        swal(`${projectId.title.toUpperCase()} đã được xóa`, {
          icon: "success",
        });
        await fetchData();
      } else {
        return;
      }
    });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const response = await axiosClient.post(
        `/boards?token=${token}`,
        newRow,
        {}
      );
      console.log(response);
      cogoToast.success("Thêm nhóm công việc thành công");

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
      setCurrentPage(1); // Đặt lại trang hiện tại về 1
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
  //Phân trang
  const pageCount = Math.ceil(sortedData.length / PAGE_SIZE); // Tính số trang
  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  return (
    <div className={cx("wrapper")}>
      <div className={cx("button-group")}>
        <button className={cx("add-button")} onClick={toggleForm}>
          {showForm ? (
            <FontAwesomeIcon icon={faCancel} />
          ) : (
            <FontAwesomeIcon icon={faPlus} />
          )}
        </button>
      </div>
      <div className={cx("table-wrapper")}>
        <Table className={cx("table")}>
          <TableHead className={cx("table-head")}>
            <TableRow>
              <TableCell>
                <Button
                  onClick={() => handleSort("board_name")}
                  variant="text"
                  color="inherit"
                >
                  Board Name
                  {sortColumn === "board_name" && (
                    <span
                      className={cx("sort-icon", {
                        asc: sortDirection === "asc",
                        desc: sortDirection === "desc",
                      })}
                    ></span>
                  )}
                </Button>
              </TableCell>
              <TableCell>Project</TableCell>
              <TableCell>
                <Button
                  onClick={() => handleSort("board_leader")}
                  variant="text"
                  color="inherit"
                >
                  Board Leader
                  {sortColumn === "board_leader" && (
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
            {getPageData().map((item) => (
              <TableRow className={cx("table-row")} key={item.id}>
                <TableCell className={cx("small-font")}>
                  {item.board_name}
                </TableCell>
                <TableCell className={cx("small-font")}>
                  {item.project.title}
                </TableCell>
                <TableCell className={cx("small-font")}>
                  {item.board_leader.fullname}
                </TableCell>
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
                    onClick={() => handleDelete(item)}
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
                    value={newRow.board_name || ""}
                    onChange={(e) => handleChange(e, "board_name")}
                    placeholder="Name"
                  />
                </TableCell>
                <TableCell>
                  <select
                    type="text"
                    name="project"
                    value={newRow.project}
                    onChange={(e) => handleChange(e, "project")}
                  >
                    <option value="">-- Chọn kế hoạch --</option>
                    {projectList.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </TableCell>
                <TableCell>
                  <input
                    className={cx("form-input")}
                    type="text"
                    value={newRow.board_leader || ""}
                    onChange={(e) => handleChange(e, "board_leader")}
                    placeholder="Board leader"
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
        <Pagination
          className={cx("pagination")}
          count={pageCount}
          page={currentPage}
          onChange={handlePageChange}
        />
      </div>

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

export default BoardComponent;