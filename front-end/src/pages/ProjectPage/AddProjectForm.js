import React, { useState } from "react";
import axiosClient from "../../api/api";
import cogoToast from "cogo-toast";
import classNames from "classnames/bind";
import styles from "../BoardPage/PopupTaskForm.module.scss";
import { IconButton, Grid } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const cx = classNames.bind(styles);
const AddProjectForm = ({ onBoardCreated, closeForm }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: new Date().toISOString().substring(0, 10),
    endDate: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axiosClient.post(
        `/projects?token=${token}`,
        formData
      );
      console.log(response);
      cogoToast.success("Thêm dự án thành công");

      // Cập nhật trực tiếp mảng dSKeHoach với dự án mới
      onBoardCreated();
      closeForm();
      // Xóa nội dung của hàng nhập liệu sau khi gửi thành công
      setFormData({
        title: "",
        description: "",
        startDate: new Date().toISOString().substring(0, 10),
        endDate: "",
      });
    } catch (error) {
      cogoToast.error("Cần điền các thông tin trống"); // Xử lý lỗi một cách phù hợp
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
      <div className={cx("form-title")}>ADD PROJECT</div>
      <form onSubmit={handleSubmit}>
        <div>
          <label className={cx("pop-form-label")}>Project title:</label>
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
          <label className={cx("pop-form-label")}>Start Date:</label>
          <input
            className={cx("pop-form-input")}
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className={cx("pop-form-label")}>End Date:</label>
          <input
            className={cx("pop-form-input")}
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className={cx("group-button")}>
          <button className={cx("submit-button")} type="submit">
            Add Project
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProjectForm;
