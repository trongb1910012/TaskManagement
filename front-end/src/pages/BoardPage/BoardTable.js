import React, { useState, useEffect, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import axiosClient from "../../api/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAdd,
  faBriefcase,
  faEye,
  faPenToSquare,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { IconButton, Grid } from "@mui/material";
import swal from "sweetalert";
import cogoToast from "cogo-toast";
import CreateBoardForm from "./CreateBoardForm";
import TasksByBoardTable from "./TasksByBoardId";
import { Link } from "react-router-dom";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

const ProjectTable = () => {
  const [projects, setProjects] = useState([]);
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [isTaskTableOpen, setIsTaskTableOpen] = useState(false);
  const [selectedProjectId, setSelectedBoardId] = useState(null);
  const [selectedBoardName, setSelectedBoardName] = useState(null);
  const [selectedProjectName, setSelectedProjectName] = useState(null);
  const role = localStorage.getItem("role");
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axiosClient.get(
        `/boards/cv_leader?token=${token}`
      );
      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  const handleOpenForm = () => {
    setIsCreateFormOpen(true);
  };
  const handleCloseForm = () => {
    setIsCreateFormOpen(false);
  };
  const handleEdit = async (rowData) => {
    try {
      const { _id, board_name } = rowData;
      const requestBody = { board_name };
      const token = localStorage.getItem("token");
      await axiosClient.put(`/boards/${_id}?token=${token}`, requestBody);

      console.log(requestBody); // Xử lý phản hồi theo ý muốn
      cogoToast.success("Board updated successfully", {
        position: "bottom-right",
      });
      fetchData(); // Cập nhật dữ liệu sau khi chỉnh sửa thành công
    } catch (error) {
      console.error(error); // Xử lý lỗi một cách phù hợp
    }
  };

  const handleDelete = (projectId) => {
    swal({
      title: `You definitely want to delete ${projectId.board_name} board`,
      text: "Once deleted, you will not be able to restore this board",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const token = localStorage.getItem("token");
        await axiosClient.delete(`/boards/${projectId._id}?token=${token}`);
        swal(`${projectId.board_name} has been deleted`, {
          icon: "success",
        });
        await fetchData();
      } else {
        return;
      }
    });
  };
  const handleOpenTable = (boardID, boardName, PName) => {
    setIsTaskTableOpen(!isTaskTableOpen);
    setSelectedBoardId(boardID);
    setSelectedBoardName(boardName);
    setSelectedProjectName(PName);
  };
  const actionCellRenderer = (params) => {
    if (params.columnApi.getRowGroupColumns().length > 0) {
      return null;
    }

    return (
      <div>
        <>
          <Tippy content="Edit">
            <IconButton
              onClick={() => handleEdit(params.data)}
              variant="outlined"
              color="primary"
            >
              <FontAwesomeIcon icon={faPenToSquare} />
            </IconButton>
          </Tippy>
          <Tippy content="Delete">
            <IconButton
              onClick={() => handleDelete(params.data)}
              variant="outlined"
              color="error"
              disabled={params.data.completedTaskCount > 0}
            >
              <FontAwesomeIcon icon={faTrash} />
            </IconButton>
          </Tippy>
          <Tippy content="Show tasks">
            <IconButton
              onClick={() =>
                handleOpenTable(
                  params.data._id,
                  params.data.board_name,
                  params.data.projectName
                )
              }
              variant="outlined"
            >
              <FontAwesomeIcon icon={faBriefcase} />
            </IconButton>
          </Tippy>

          <Link to={`/tasking/project/${params.data.project}`}>
            <Tippy content="Project detail">
              <IconButton
                variant="outlined"
                style={role !== "board manager" ? { display: "none" } : {}}
              >
                <FontAwesomeIcon icon={faEye} />
              </IconButton>
            </Tippy>
          </Link>
        </>
      </div>
    );
  };
  const columnDefs = [
    {
      headerName: "Name",
      field: "board_name",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Project",
      field: "projectName",
      sortable: true,
      filter: true,
      editable: false,
    },
    {
      headerName: "Create Date",
      field: "createdAt",
      sortable: true,
      filter: true,
      editable: false,
    },
    {
      headerName: "Leader",
      field: "leaderName",
      sortable: true,
      filter: true,
      editable: false,
    },
    {
      headerName: "Completed tasks",
      field: "completedTaskCount",
      sortable: true,
      filter: true,
      editable: false,
    },
    {
      headerName: "Total tasks",
      field: "taskCount",
      sortable: true,
      filter: true,
      editable: false,
    },
    {
      headerName: "Action",
      field: "action",
      editable: "false",
      cellRenderer: actionCellRenderer,
    },
  ];
  const defaultColDef = useMemo(() => {
    return {
      editable: true,
      enableRowGroup: true,
      enablePivot: true,
      enableValue: true,
      sortable: true,
      resizable: true,
      filter: true,
      flex: 1,
      minWidth: 100,
    };
  }, []);
  return (
    <div>
      <Grid container justifyContent="space-between">
        <Grid item>
          <h1>BOARDS</h1>
        </Grid>
        <Grid item>
          {" "}
          {role !== "board manager" && (
            <IconButton onClick={() => handleOpenForm()} variant="outlined">
              <FontAwesomeIcon icon={faAdd} />
            </IconButton>
          )}
        </Grid>
      </Grid>
      <div
        className="ag-theme-alpine"
        style={{ height: "350px", width: "100%" }}
      >
        <AgGridReact
          columnDefs={columnDefs}
          rowData={projects}
          defaultColDef={defaultColDef}
          onGridReady={fetchData}
          pagination={true}
          pivotPanelShow={"always"}
          rowGroupPanelShow={"always"}
          paginationPageSize={5}
        ></AgGridReact>
      </div>
      {isCreateFormOpen && (
        <CreateBoardForm onBoardCreated={fetchData} onClose={handleCloseForm} />
      )}
      <div>
        {" "}
        {isTaskTableOpen && (
          <TasksByBoardTable
            boardId={selectedProjectId}
            boardName={selectedBoardName}
            projectName={selectedProjectName}
            onDataUpdated={fetchData}
          />
        )}
      </div>
    </div>
  );
};

export default ProjectTable;
