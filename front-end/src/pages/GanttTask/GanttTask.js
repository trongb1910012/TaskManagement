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
import { Pagination } from "@mui/material";
import cogoToast from "cogo-toast";
import swal from "sweetalert";
import { Gantt } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
const cx = classNames.bind(styles);
const TableComponent = () => {
  const [data, setData] = useState([]);
  const [newRow, setNewRow] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [sortColumn, setSortColumn] = useState(""); // Track the currently sorted column
  const [sortDirection, setSortDirection] = useState(""); // Track the sorting direction (asc or desc)
  const [editRow, setEditRow] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const PAGE_SIZE = 3; // Số lượng dòng hiển thị trên mỗi trang
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const getPageData = () => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    return sortedData.slice(startIndex, endIndex);
  };
  const [tasks, setTasks] = useState([]);
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axiosClient.get(`/projects/nv?token=${token}`);
      setData(response.data.projects);

      // Create tasks array from the API response
      const tasksData = response.data.projects.map((project) => ({
        start: new Date(project.startDate),
        end: new Date(project.endDate),
        name: project.title,
        id: project._id,
        type: "project",
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
  });

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
      <div className={cx("gantt")}>
        {tasks.length > 0 && <Gantt tasks={tasks} />}
      </div>
    </div>
  );
};

export default TableComponent;
