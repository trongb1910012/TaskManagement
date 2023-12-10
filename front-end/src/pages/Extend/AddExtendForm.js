import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../../api/api";
import classNames from "classnames/bind";
import styles from "../ReportPage/ReportPage.module.scss";
import cogoToast from "cogo-toast";
const cx = classNames.bind(styles);
export const ExtendRequestForm = ({ fetch }) => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    new_dueDate: "",
    comment_text: "",
    task_id: id,
  });
  const [errors, setErrors] = useState({});
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axiosClient.post(`/comments?token=${token}`, formData);
      cogoToast.success("Extend request add successfully !!!", {
        position: "bottom-right",
      });
      fetch();
      setFormData({
        new_dueDate: "",
        comment_text: "",
        task_id: id,
      });
    } catch (error) {
      cogoToast.error(
        "New due date must be greater than the current due date",
        {
          position: "bottom-right",
        }
      );
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    if (!formData.comment_text.trim()) {
      newErrors.comment_text = "Reason is required";
      isValid = false;
    }

    const currentDate = new Date().toISOString().substring(0, 10);
    if (formData.new_dueDate <= currentDate) {
      newErrors.new_dueDate =
        "New Due Date must be greater than the current date";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };
  return (
    <div className={cx("popup-form")}>
      <div className={cx("form-title")}>Extend Request</div>
      <form onSubmit={handleSubmit}>
        <div>
          <label className={cx("pop-form-label")}>Reason: </label>
          <textarea
            className={cx("pop-form-input")}
            type="text"
            id="comment_text"
            name="comment_text"
            value={formData.comment_text}
            onChange={handleChange}
            required
          />
          {errors.comment_text && (
            <span className={cx("error-message")}>{errors.comment_text}</span>
          )}
        </div>
        <div>
          <label className={cx("pop-form-label")}>New Due Date:</label>
          <input
            className={cx("pop-form-input")}
            type="date"
            id="new_dueDate"
            name="new_dueDate"
            value={formData.new_dueDate}
            onChange={handleChange}
            required
          />
          {errors.new_dueDate && (
            <span className={cx("error-message")}>{errors.new_dueDate}</span>
          )}
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
