import React, { useState, useEffect } from "react";
import axiosClient from "../../api/api";
import cogoToast from "cogo-toast";
import classNames from "classnames/bind";
import styles from "./PopupTaskForm.module.scss";
import { IconButton, Grid } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Select from "react-select";
const cx = classNames.bind(styles);
const EditTaskForm = ({ onBoardCreated, rowData, closeForm }) => {
  const [userList, setUserList] = useState([]);
  const defaultMembersWithLabels = rowData.members.map((member) => {
    return {
      value: member._id,
      label: member.fullname, // hoặc lấy từ tên, email, ...
    };
  });
  const [defaultValue, setDefaultValue] = useState(defaultMembersWithLabels);
  const defaultValues = {
    board_id: rowData.board.id,
    board_name: rowData.board.board_name,
    title: rowData.title,
    description: rowData.description,
    dueDate: rowData.dueDate,
    members: rowData.members,
  };
  const schema = Yup.object().shape({
    title: Yup.string().required(),
    description: Yup.string().required(),
    dueDate: Yup.date().required(),
  });
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const getListUser = async () => {
      const res = await axiosClient.get(`/users`);
      setUserList(res.data);
    };
    getListUser();
  }, []);
  const options = userList.map((user) => ({
    value: user._id.toString(),
    label: user.fullname,
  }));
  const onSubmit = async (data) => {
    try {
      await axiosClient.put(`/tasks/${rowData._id}`, data);
      cogoToast.success("Add board successfully");
      onBoardCreated();
      closeForm();
      reset();
    } catch (error) {
      cogoToast.error("Adding failed board");
    }
  };
  const onChange = (selected) => {
    setDefaultValue(selected);

    setValue("members", selected);
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
      <div className={cx("form-title")}>UPDATE TASK</div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className={cx("pop-form-label")}>Title:</label>
          <input
            className={cx("pop-form-input")}
            type="text"
            id="title"
            name="title"
            {...register(
              "title",
              { defaultValue: "" },
              {
                required: "Title is required",
              }
            )}
          />
        </div>
        {errors.title && <p>Title is a required field</p>}
        <div>
          <label className={cx("pop-form-label")}>Description:</label>
          <input
            className={cx("pop-form-input")}
            id="description"
            name="description"
            {...register("description")}
          />
          {errors.description && <p>Description is a required field</p>}
        </div>
        <div>
          <label className={cx("pop-form-label")}>Due Date:</label>
          <input
            className={cx("pop-form-input")}
            type="date"
            id="dueDate"
            name="dueDate"
            {...register(
              "dueDate",
              {
                defaultValue: new Date().toISOString().substring(0, 10),
              },
              {
                required: "Due date is required",
                validate: (value) => value > new Date(),
              }
            )}
          />
          {errors.startDate && <p>{errors.startDate.message}</p>}
        </div>
        <div>
          <label className={cx("pop-form-label")}>Member:</label>
          <Select
            {...register("members")}
            isMulti
            value={defaultValue}
            options={options}
            onChange={onChange}
          />
          {errors.members && <p>Members is a required field</p>}
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

export default EditTaskForm;
