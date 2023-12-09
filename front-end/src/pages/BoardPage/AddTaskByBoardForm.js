/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import axiosClient from "../../api/api";
import cogoToast from "cogo-toast";
import classNames from "classnames/bind";
import styles from "./PopupTaskForm.module.scss";
import { IconButton, Grid } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";
const cx = classNames.bind(styles);
const AddTasksForm = ({ onBoardCreated, closeForm, boardId }) => {
  const [formData, setFormData] = useState({
    board_id: boardId,
    title: "",
    description: "",
    dueDate: "",
    members: [],
    previousTask: "",
  });
  const [userList, setUserList] = useState([]);
  const [taskList, setTaskList] = useState([]);
  const [errors, setErrors] = useState({});
  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   if (!validateForm()) {
  //     return;
  //   }
  //   try {
  //     const token = localStorage.getItem("token");
  //     const response = await axiosClient.post(
  //       `/tasks?token=${token}`,
  //       formData
  //     );
  //     console.log(response);
  //     cogoToast.success("Adding board successfully", {
  //       position: "bottom-right",
  //     });

  //     // Cập nhật trực tiếp mảng dSKeHoach với dự án mới
  //     onBoardCreated();
  //     closeForm();
  //     // Xóa nội dung của hàng nhập liệu sau khi gửi thành công
  //     setFormData({
  //       board_id: boardId,
  //       title: "",
  //       description: "",
  //       dueDate: "",
  //       members: [],
  //       previousTask: "",
  //     });
  //   } catch (error) {
  //     cogoToast.error("An error occurred while adding board", {
  //       position: "bottom-right",
  //     }); // Xử lý lỗi một cách phù hợp
  //   }
  // };
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const response = await axiosClient.post(
        `/tasks?token=${token}`,
        formData
      );
      console.log(response);
      cogoToast.success("Adding board successfully", {
        position: "bottom-right",
      });

      // Cập nhật trực tiếp mảng dSKeHoach với dự án mới
      onBoardCreated();
      closeForm();
      // Xóa nội dung của hàng nhập liệu sau khi gửi thành công
      setFormData({
        board_id: boardId,
        title: "",
        description: "",
        dueDate: "",
        members: [],
        previousTask: "",
      });
    } catch (error) {
      if (error.response) {
        // Nếu có phản hồi từ server và có thông báo lỗi
        cogoToast.error(`${error.response.data.message}`, {
          position: "bottom-right",
        });
      } else {
        // Nếu có lỗi xảy ra nhưng không có phản hồi từ server
        cogoToast.error("An error occurred while adding task", {
          position: "bottom-right",
        });
      }
    }
  };
  useEffect(() => {
    const getListUser = async () => {
      const res = await axiosClient.get(`/users/dsUser`);
      setUserList(res.data);
    };
    getListUser();
  }, []);
  useEffect(() => {
    const getListUser = async () => {
      const res = await axiosClient.get(`/tasks/${boardId}`);
      setTaskList(res.data.tasks);
    };
    getListUser();
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "members") {
      const selectedOptions = Array.from(e.target.options)
        .filter((option) => option.selected)
        .map((option) => option.value);

      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: selectedOptions,
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };
  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
      isValid = false;
    }

    if (formData.dueDate < new Date().toISOString().substring(0, 10)) {
      newErrors.dueDate = "Due Date should be in the future";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  return (
    <div className={cx("popup-form")}>
      <Grid container justifyContent="flex-end">
        <Grid item>
          <IconButton className={cx("close-button")} onClick={closeForm}>
            <FontAwesomeIcon icon={faXmark} />
          </IconButton>
        </Grid>
      </Grid>
      <div className={cx("form-title")}>ADD TASK</div>
      <form onSubmit={handleSubmit}>
        <div>
          <label className={cx("pop-form-label")} htmlFor="board_name">
            Task title:
          </label>
          <input
            className={cx("pop-form-input")}
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
          {errors.title && (
            <span className={cx("error-message")}>{errors.title}</span>
          )}
        </div>
        <div>
          <label className={cx("pop-form-label")}>Description:</label>
          <textarea
            className={cx("pop-form-input")}
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className={cx("pop-form-label")}>Due Date:</label>
          <input
            className={cx("pop-form-input")}
            type="date"
            id="dueDate"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            required
          />
          {errors.dueDate && (
            <span className={cx("error-message")}>{errors.dueDate}</span>
          )}
        </div>
        <div>
          <label className={cx("pop-form-label")}>Previous Task:</label>
          <select
            className={cx("pop-form-input")}
            type="text"
            name="previousTask"
            id="previousTask"
            value={formData.previousTask}
            onChange={handleChange}
          >
            <option value="">-- Choose previous task --</option>
            {taskList.map((task) => (
              <option key={task._id} value={task._id}>
                {task.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={cx("pop-form-label")}>Members:</label>
          <Select
            className={cx("pop-form-input")}
            isMulti
            name="members"
            id="members"
            value={formData.members.map((memberId) => ({
              value: memberId,
              label:
                userList.find((user) => user._id === memberId)?.fullname || "",
            }))}
            options={userList.map((user) => ({
              value: user._id,
              label: user.fullname,
            }))}
            onChange={(selectedOptions) => {
              const selectedUserIds = selectedOptions.map(
                (option) => option.value
              );
              setFormData((prevFormData) => ({
                ...prevFormData,
                members: selectedUserIds,
              }));
            }}
          />
        </div>
        <div className={cx("group-button")}>
          <button className={cx("submit-button")} type="submit">
            Create Board
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTasksForm;
