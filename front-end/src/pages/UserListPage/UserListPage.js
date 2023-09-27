import React from "react";

import classNames from "classnames/bind";
import styles from "../ProjectPage/ProjectPage.module.scss";
import UserListTable from "./UserListTable";
import { Grid } from "@mui/material";
const cx = classNames.bind(styles);

const UserListPage = () => {
  return (
    <div className={cx("wrapper")}>
      <Grid container spacing={2}>
        <Grid item xl={12}>
          <UserListTable />
        </Grid>
      </Grid>
    </div>
  );
};

export default UserListPage;
