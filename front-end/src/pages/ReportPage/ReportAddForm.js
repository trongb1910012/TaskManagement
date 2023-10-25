import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../../api/api";
import classNames from "classnames/bind";
import styles from "./ReportPage.module.scss";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Grid, IconButton } from "@mui/material";
import cogoToast from "cogo-toast";
const cx = classNames.bind(styles);
export const AddReportForm = ({ fetch }) => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    taskId: id,
  });
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axiosClient.post(`/reports?token=${token}`, formData);
      cogoToast.success("Report add successful !!!", {
        position: "bottom-right",
      });
      fetch();
      setFormData({
        title: "",
        description: "",
        taskId: id,
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
  return (
    <div className={cx("popup-form")}>
      <Grid container justifyContent="flex-end">
        <Grid item>
          <IconButton className={cx("close-button")}>
            <FontAwesomeIcon icon={faXmark} />
          </IconButton>
        </Grid>
      </Grid>
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
        <div className={cx("group-button")}>
          <button className={cx("submit-button")} type="submit">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};
