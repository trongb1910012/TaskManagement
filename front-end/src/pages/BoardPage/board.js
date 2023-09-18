import React from "react";
import ProjectTable from "./BoardTable";
import classNames from "classnames/bind";
import styles from "./board.module.scss";

const cx = classNames.bind(styles);
const ProjectPage = () => {
  return (
    <div className={cx("wrapper")}>
      <ProjectTable />
    </div>
  );
};

export default ProjectPage;
