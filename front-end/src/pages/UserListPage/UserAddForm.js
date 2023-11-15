import React, { useState } from "react";
import axiosClient from "../../api/api";
import cogoToast from "cogo-toast";
import classNames from "classnames/bind";
import styles from "../BoardPage/PopupTaskForm.module.scss";
import { IconButton, Grid } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const cx = classNames.bind(styles);
const AddUserForm = ({ onBoardCreated, closeForm }) => {
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    birthDay: new Date().toISOString().substring(0, 10),
    email: "",
    password: "123123",
  });
  const [formErrors, setFormErrors] = useState({
    username: "",
    fullname: "",
    email: "",
    // Thêm các trường khác nếu cần
  });
  const validateForm = () => {
    let errors = {};
    let isValid = true;

    // Kiểm tra username
    if (!formData.username.trim()) {
      errors.username = "Username is required";
      isValid = false;
    }

    // Kiểm tra fullname
    if (!formData.fullname.trim()) {
      errors.fullname = "Fullname is required";
      isValid = false;
    }

    // Kiểm tra email
    if (!formData.email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      try {
        await axiosClient.post(`/auth/signup`, formData);
        cogoToast.success("Adding user successfully", {
          position: "bottom-right",
        });
        onBoardCreated();
        closeForm();
        console.log(formData);
        setFormData({
          fullname: "",
          username: "",
          birthDay: new Date().toISOString().substring(0, 10),
          email: "",
          password: "123123",
        });
      } catch (error) {
        cogoToast.error("Email is already in use", {
          position: "bottom-right",
        });
      }
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
      <div className={cx("form-title")}>ADD USER</div>
      <form onSubmit={handleSubmit}>
        <div>
          <label className={cx("pop-form-label")}>User name:</label>
          <input
            className={cx("pop-form-input")}
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          {formErrors.username && (
            <span className={cx("error-message")}>{formErrors.username}</span>
          )}
        </div>
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
          {formErrors.fullname && (
            <span className={cx("error-message")}>{formErrors.fullname}</span>
          )}
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
          <label className={cx("pop-form-label")}>Email:</label>
          <input
            className={cx("pop-form-input")}
            type="text"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {formErrors.email && (
            <span className={cx("error-message")}>{formErrors.email}</span>
          )}
        </div>
        <div className={cx("group-button")}>
          <button className={cx("submit-button")} type="submit">
            Add user
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddUserForm;
