import React, { useState, useEffect } from "react";
import axiosClient from "../../api/api";
import cogoToast from "cogo-toast";
import classNames from "classnames/bind";
import styles from "./board.module.scss";
const cx = classNames.bind(styles);
const CreateBoardForm = ({ onBoardCreated }) => {
  const [formData, setFormData] = useState({
    board_name: "",
    project: "",
    board_leader: "",
  });
  const [dSKeHoach, setDSKeHoach] = useState([]);
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
      cogoToast.success("Thêm nhóm công việc thành công");

      // Cập nhật trực tiếp mảng dSKeHoach với dự án mới
      onBoardCreated();
      // Xóa nội dung của hàng nhập liệu sau khi gửi thành công
      setFormData({ board_name: "", project: "", board_leader: "" });
    } catch (error) {
      cogoToast.error("Cần điền các thông tin trống"); // Xử lý lỗi một cách phù hợp
    }
  };

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
            <option value="">-- Chọn kế hoạch --</option>
            {dSKeHoach.map((kh) => (
              <option key={kh._id} value={kh._id}>
                {kh.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={cx("pop-form-label")} htmlFor="boardName">
            Board Leader:
          </label>
          <input
            className={cx("pop-form-input")}
            type="text"
            id="board_leader"
            name="board_leader"
            value={formData.board_leader}
            onChange={handleChange}
            required
          />
        </div>
        <button className={cx("submit-button")} type="submit">
          Create Board
        </button>
      </form>
    </div>
  );
};

export default CreateBoardForm;
