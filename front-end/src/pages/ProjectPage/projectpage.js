import React from "react";
import ProjectTable from "./ProjectTable";
import ProjectList from "../TaskPage/taskTable";
const ProjectPage = () => {
  return (
    <div>
      <h1>Project Page</h1>
      <ProjectTable />
      <h1>All Project Page</h1>
      <ProjectList />
    </div>
  );
};

export default ProjectPage;
