import React, { useState, useEffect } from "react";
import axiosClient from "../../api/api";
import cogoToast from "cogo-toast";
import classNames from "classnames/bind";
import styles from "./board.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconButton, Grid } from "@mui/material";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
const cx = classNames.bind(styles);
const CreateBoardForm = ({ onBoardCreated, onClose }) => {
  const [formData, setFormData] = useState({
    board_name: "",
    project: "",
    board_leader: "",
  });
  const [dSKeHoach, setDSKeHoach] = useState([]);
  const [userList, setUserList] = useState([]);
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const response = await axiosClient.post(
        `/boards?token=${token}`,
        formData,
        {}
      );
      console.log(response);
      cogoToast.success("Adding board successfully", {
        position: "bottom-right",
      });

      // Cập nhật trực tiếp mảng dSKeHoach với dự án mới
      onBoardCreated();
      onClose();
      // Xóa nội dung của hàng nhập liệu sau khi gửi thành công
      setFormData({ board_name: "", project: "", board_leader: "" });
    } catch (error) {
      cogoToast.error("An error occurred while adding board", {
        position: "bottom-right",
      }); // Xử lý lỗi một cách phù hợp
    }
  };
  useEffect(() => {
    const getListUser = async () => {
      const res = await axiosClient.get(`/users/dsBM`);
      setUserList(res.data);
    };
    getListUser();
  }, []);
  useEffect(() => {
    const getListKeHoach = async () => {
      const resKH = await axiosClient.get(
        `/projects/nv?token=${localStorage.getItem("token")}`
      );
      setDSKeHoach(resKH.data.projects);
    };
    getListKeHoach();
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
          <IconButton className={cx("close-button")} onClick={onClose}>
            <FontAwesomeIcon icon={faXmark} />
          </IconButton>
        </Grid>
      </Grid>
      <div className={cx("form-title")}>ADD BOARD</div>
      <form onSubmit={handleSubmit}>
        <div>
          <label className={cx("pop-form-label")} htmlFor="board_name">
            Board Name:
          </label>
          <input
            className={cx("pop-form-input")}
            type="text"
            id="board_name"
            name="board_name"
            value={formData.board_name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className={cx("pop-form-label")} htmlFor="project">
            Project:
          </label>
          <select
            className={cx("pop-form-input")}
            type="text"
            name="project"
            id="project"
            value={formData.project}
            onChange={handleChange}
          >
            <option value="">-- Choose project --</option>
            {dSKeHoach.map((kh) => (
              <option key={kh._id} value={kh._id}>
                {kh.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={cx("pop-form-label")} htmlFor="project">
            Leader:
          </label>
          <select
            className={cx("pop-form-input")}
            type="text"
            name="board_leader"
            id="board_leader"
            value={formData.board_leader}
            onChange={handleChange}
          >
            <option value="">-- Choose user --</option>
            {userList.map((user) => (
              <option key={user._id} value={user._id}>
                {user.fullname}
              </option>
            ))}
          </select>
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

export default CreateBoardForm;
