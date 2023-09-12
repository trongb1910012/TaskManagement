import React, { useState, useEffect } from "react";
import axiosClient from "../../api/api";
import cogoToast from "cogo-toast";
import classNames from "classnames/bind";
import styles from "./PopupTaskForm.module.scss";
const cx = classNames.bind(styles);
const EditTaskForm = ({ onBoardCreated, rowData, closeForm }) => {
  const [formData, setFormData] = useState({
    board_id: rowData.board.id,
    board_name: rowData.board.board_name,
    title: rowData.title,
    description: rowData.description,
    dueDate: rowData.dueDate,
    members: rowData.members,
  });
  const [boardsList, setBoardsList] = useState([]);
  const [userList, setUserList] = useState([]);
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(formData);
    try {
      const response = await axiosClient.put(`/tasks/${rowData._id}`, formData);
      console.log(response);
      cogoToast.success("Thêm nhóm công việc thành công");

      // Cập nhật trực tiếp mảng dSKeHoach với dự án mới
      onBoardCreated();
      closeForm();
      // Xóa nội dung của hàng nhập liệu sau khi gửi thành công
      setFormData({
        board_id: "",
        title: "",
        description: "",
        dueDate: "",
        members: [],
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
  useEffect(() => {
    const getBoardsList = async () => {
      const resKH = await axiosClient.get(
        `/boards/cv_leader?token=${localStorage.getItem("token")}`
      );
      setBoardsList(resKH.data);
    };
    getBoardsList();
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "members") {
      const selectedOptions = Array.from(e.target.options)
        .filter((option) => option.selected)
        .map((option) => option.value);

      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: selectedOptions,
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  return (
    <div className={cx("popup-form")}>
      <form onSubmit={handleSubmit}>
        <div>
          <label className={cx("pop-form-label")} htmlFor="board_name">
            Task title:
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
        </div>
        <div>
          <label className={cx("pop-form-label")}>Description:</label>
          <input
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
          <label className={cx("pop-form-label")}>Due Date:</label>
          <input
            className={cx("pop-form-input")}
            type="date"
            id="dueDate"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className={cx("pop-form-label")}>Board:</label>
          <select
            className={cx("pop-form-input")}
            type="text"
            name="board_id"
            id="board_id"
            value={formData.board_id}
            onChange={handleChange}
          >
            <option value={formData.board_id}>{formData.board_name}</option>
            {boardsList.map((b) => (
              <option key={b._id} value={b._id}>
                {b.board_name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <select
            className={cx("pop-form-input")}
            multiple
            type="text"
            name="members"
            id="members"
            value={formData.members}
            onChange={handleChange}
          >
            {userList.map((user) => (
              <option key={user._id} value={user._id}>
                {user.fullname}
              </option>
            ))}
          </select>
        </div>

        <button className={cx("submit-button")} type="submit">
          Update task
        </button>
        <button className={cx("submit-button")} onClick={closeForm}>
          Close
        </button>
      </form>
    </div>
  );
};

export default EditTaskForm;
