import React from "react";

import classNames from "classnames/bind";
import styles from "../ProjectPage/ProjectPage.module.scss";
import UserListTable from "./UserListTable";
const cx = classNames.bind(styles);

const UserListPage = () => {
  return (
    <div className={cx("wrapper")}>
      <UserListTable />
    </div>
  );
};

export default UserListPage;
