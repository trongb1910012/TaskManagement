import React, { useState, useEffect } from "react";
import axiosClient from "../../api/api";
import cogoToast from "cogo-toast";
import classNames from "classnames/bind";
import styles from "./PopupTaskForm.module.scss";
import Select from "react-select";
import { IconButton, Grid } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
const cx = classNames.bind(styles);
const EditTaskForm = ({ onBoardCreated, rowData, closeForm }) => {
  const [formData, setFormData] = useState({
    board_id: rowData.board.id,
    title: rowData.title,
    description: rowData.description,
    dueDate: rowData.dueDate,
    members: rowData.members,
  });

  const [userList, setUserList] = useState([]);
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axiosClient.put(`/tasks/${rowData._id}`, formData);
      console.log(response);
      cogoToast.success("Update task successfully");

      // Cập nhật trực tiếp mảng dSKeHoach với dự án mới
      onBoardCreated();
      closeForm();
      // Xóa nội dung của hàng nhập liệu sau khi gửi thành công
      setFormData({
        title: "",
        description: "",
        dueDate: "",
        members: [],
      });
    } catch (error) {
      cogoToast.error("Update task fail", {
        position: "bottom-right",
      }); // Xử lý lỗi một cách phù hợp
    }
  };
  useEffect(() => {
    const getListUser = async () => {
      const res = await axiosClient.get(`/users/dsUser`);
      setUserList(res.data);
    };
    getListUser();
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
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
      <div className={cx("form-title")}>Update Task</div>
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
                userList.find((user) => user._id === memberId)?.fullname ||
                userList.find((user) => user._id === memberId._id)?.fullname,
            }))}
            options={userList.map((user) => ({
              value: user._id,
              label: `${user.fullname}(${user.username})`,
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
            Update Task
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTaskForm;
