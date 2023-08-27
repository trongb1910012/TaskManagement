import React from "react";
import { Grid } from "@material-ui/core";
import TableComponent from "./project";
import classNames from "classnames/bind";
import styles from "./projectpage.module.scss";
const cx = classNames.bind(styles);
const CustomGrid = ({ items }) => {
  return (
    <div className={cx("wrapper")}>
      <Grid container spacing={5}>
        <Grid item xs={9}>
          <TableComponent></TableComponent>
        </Grid>
        <Grid item xs={3}></Grid>
      </Grid>
      <Grid container spacing={5}>
        <Grid item xs={9}>
          <TableComponent></TableComponent>
        </Grid>
        <Grid item xs={3}></Grid>
      </Grid>
    </div>
  );
};

export default CustomGrid;
