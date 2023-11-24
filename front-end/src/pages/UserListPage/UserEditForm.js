import React, { useState } from "react";
import axiosClient from "../../api/api";
import cogoToast from "cogo-toast";
import classNames from "classnames/bind";
import styles from "../BoardPage/PopupTaskForm.module.scss";
import { IconButton, Grid } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
const cx = classNames.bind(styles);
const EditUserForm = ({ onBoardCreated, rowData, closeForm }) => {
  const [formData, setFormData] = useState({
    fullname: rowData.fullname,
    birthDay: rowData.birthDay,
    role: rowData.role,
    phoneNumber: rowData.phoneNumber,
    email: rowData.email,
  });
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await axiosClient.put(`/users/${rowData._id}`, formData);
      cogoToast.success("Updating user successfully");

      // Cập nhật trực tiếp mảng dSKeHoach với dự án mới
      onBoardCreated();
      closeForm();
      // Xóa nội dung của hàng nhập liệu sau khi gửi thành công
      setFormData({
        fullname: "",
        birthDay: "",
        role: "",
        phoneNumber: "",
        email: "",
      });
    } catch (error) {
      cogoToast.error("Updating user failed"); // Xử lý lỗi một cách phù hợp
    }
  };

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
      <div className={cx("form-title")}>EDIT USER</div>
      <form onSubmit={handleSubmit}>
        <div>
          <label className={cx("pop-form-label")}>Full name:</label>
          <input
            className={cx("pop-form-input")}
            type="text"
            id="fullname"
            name="fullname"
            value={formData.fullname}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className={cx("pop-form-label")}>Phone:</label>
          <input
            className={cx("pop-form-input")}
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className={cx("pop-form-label")}>Birth date:</label>
          <input
            className={cx("pop-form-input")}
            type="date"
            id="birthDay"
            name="birthDay"
            value={formData.birthDay}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className={cx("pop-form-label")}>Role:</label>
          <select
            className={cx("pop-form-input")}
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="project manager">Project manager</option>
            <option value="board manager">Board manager</option>
          </select>
        </div>
        <div className={cx("group-button")}>
          <button className={cx("submit-button")} type="submit">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditUserForm;
