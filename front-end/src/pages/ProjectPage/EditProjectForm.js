import React, { useState } from "react";
import axiosClient from "../../api/api";
import cogoToast from "cogo-toast";
import classNames from "classnames/bind";
import styles from "../BoardPage/PopupTaskForm.module.scss";
import { IconButton, Grid } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const cx = classNames.bind(styles);

const EditProjectForm = ({ onBoardCreated, rowData, closeForm }) => {
  const [formData, setFormData] = useState({
    title: rowData.title,
    description: rowData.description,
    startDate: rowData.startDate,
    endDate: rowData.endDate,
    status: rowData.status,
  });

  const [errors, setErrors] = useState({}); // State to store validation errors

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    // Validate the 'title' field
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
      isValid = false;
    }

    // Validate the 'startDate' and 'endDate' fields (you can add more complex date validation if needed)
    if (formData.startDate > formData.endDate) {
      newErrors.startDate = "Start Date should be before End Date";
      newErrors.endDate = "End Date should be after Start Date";
      isValid = false;
    }
    if (formData.endDate < new Date().toISOString().substring(0, 10)) {
      newErrors.endDate = "End Date should be in the future";
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axiosClient.put(
        `/projects/${rowData._id}?token=${token}`,
        formData
      );
      cogoToast.success("Update project successfully", {
        position: "bottom-right",
      });

      // Cập nhật trực tiếp mảng dSKeHoach với dự án mới
      onBoardCreated();
      closeForm();
      // Xóa nội dung của hàng nhập liệu sau khi gửi thành công
      setFormData({
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        status: "",
      });
    } catch (error) {
      cogoToast.error("Update project fail", {
        position: "bottom-right",
      }); // Xử lý lỗi một cách phù hợp
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
      <div className={cx("form-title")}>EDIT PROJECT</div>
      <form onSubmit={handleSubmit}>
        <div>
          <label className={cx("pop-form-label")} htmlFor="board_name">
            Project title:
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
          <label className={cx("pop-form-label")}>Start:</label>
          <input
            className={cx("pop-form-input")}
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
          />
          {errors.startDate && (
            <span className={cx("error-message")}>{errors.startDate}</span>
          )}
        </div>
        <div>
          <label className={cx("pop-form-label")}>End:</label>
          <input
            className={cx("pop-form-input")}
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
          />
          {errors.endDate && (
            <span className={cx("error-message")}>{errors.endDate}</span>
          )}
        </div>
        <div>
          <label className={cx("pop-form-label")}>Status:</label>
          <select
            className={cx("pop-form-input")}
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="planned">Planned</option>
            <option value="in progress">In progress</option>
            <option value="completed">Completed</option>
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

export default EditProjectForm;
