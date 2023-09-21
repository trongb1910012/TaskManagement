import React, { useState, useEffect } from "react";
import axiosClient from "../../api/api";
import cogoToast from "cogo-toast";
import classNames from "classnames/bind";
import styles from "../BoardPage/board.module.scss";
import { IconButton, Grid } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
const cx = classNames.bind(styles);
const AddBoardByProject = ({ onBoardCreated, closeForm, projectId }) => {
  const [formData, setFormData] = useState({
    project: projectId,
    board_name: "",
    board_leader: "",
  });
  const [userList, setUserList] = useState([]);
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(formData);
    try {
      const token = localStorage.getItem("token");
      const response = await axiosClient.post(
        `/boards?token=${token}`,
        formData
      );
      console.log(response);
      cogoToast.success("Thêm nhóm công việc thành công");

      // Cập nhật trực tiếp mảng dSKeHoach với dự án mới
      onBoardCreated();
      closeForm();
      // Xóa nội dung của hàng nhập liệu sau khi gửi thành công
      setFormData({
        project: projectId,
        board_name: "",
        board_leader: "",
      });
    } catch (error) {
      cogoToast.error("Cần điền các thông tin trống"); // Xử lý lỗi một cách phù hợp
    }
  };
  useEffect(() => {
    const getListUser = async () => {
      const res = await axiosClient.get(`/users`);
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
      <div className={cx("form-title")}>ADD BOARD</div>
      <form onSubmit={handleSubmit}>
        <div>
          <label className={cx("pop-form-label")}>Board name:</label>
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
          <label className={cx("pop-form-label")}>Leader:</label>
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

export default AddBoardByProject;
