import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../../api/api";
import classNames from "classnames/bind";
import styles from "./ReportPage.module.scss";
import cogoToast from "cogo-toast";
const cx = classNames.bind(styles);
export const AddReportForm = ({ fetch }) => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    taskId: id,
    file: null, // Initialize file as null
  });
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const form = new FormData();
      form.append("title", formData.title);
      form.append("description", formData.description);
      form.append("taskId", formData.taskId);
      form.append("file", formData.file); // Append the file to the form data

      await axiosClient.post(`/reports?token=${token}`, form, {
        headers: {
          "Content-Type": "multipart/form-data", // Set the content type as multipart/form-data
        },
      });

      cogoToast.success("Report add successful !!!", {
        position: "bottom-right",
      });

      fetch();

      setFormData({
        title: "",
        description: "",
        taskId: id,
        file: null, // Reset the file property in the form data state
      });
    } catch (error) {
      cogoToast.error("Report add failed !!!", {
        position: "bottom-right",
      });
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Get the first selected file
    setFormData((prevFormData) => ({
      ...prevFormData,
      file: file, // Update the file property in the form data state
    }));
  };
  return (
    <div className={cx("popup-form")}>
      <div className={cx("form-title")}>REPORT</div>
      <form onSubmit={handleSubmit}>
        <div>
          <label className={cx("pop-form-label")}>Report title:</label>
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
          <label className={cx("pop-form-label")}>File:</label>
          <input
            className={cx("pop-form-input")}
            type="file"
            id="file"
            name="file"
            onChange={handleFileChange}
            required
          />
        </div>
        <div className={cx("group-button")}>
          <button className={cx("submit-button")} type="submit">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};
