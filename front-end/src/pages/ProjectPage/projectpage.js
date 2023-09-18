import React from "react";
import ProjectTable from "./ProjectTable";
import classNames from "classnames/bind";
import styles from "./ProjectPage.module.scss";

const cx = classNames.bind(styles);

const ProjectPage = () => {
  return (
    <div className={cx("wrapper")}>
      <ProjectTable />
    </div>
  );
};

export default ProjectPage;
