/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import axiosClient from "../../api/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faTrash,
  faAdd,
  faTasks,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { IconButton, Grid } from "@mui/material";
import swal from "sweetalert";
import AddTasksForm from "./AddTaskByBoardForm";
import EditTaskForm from "./EditTaskByBoardForm";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

const TasksByBoardTable = ({
  boardId,
  boardName,
  projectName,
  onDataUpdated,
}) => {
  const [boards, setBoards] = useState([]);
  const [boardInfo, setBoardInfo] = useState([]);
  const [rowDataForForm, setRowDataForForm] = useState(null);
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);

  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");
  const fullname = localStorage.getItem("fullname");
  const fetchData = async () => {
    try {
      const response = await axiosClient.get(`/tasks/${boardId}`);

      setBoards(response.data.tasks);
      if (onDataUpdated) {
        onDataUpdated();
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchBoardInfo = async () => {
    try {
      const response = await axiosClient.get(`/boards/boardInfo/${boardId}`);
      setBoardInfo(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchData();
    fetchBoardInfo();
  }, []);
  const openCreateForm = () => {
    setIsEditFormOpen(false);
    setIsCreateFormOpen(true);
  };
  const closeCreateForm = () => {
    setIsCreateFormOpen(false);
  };
  const openEditForm = (rowData) => {
    setIsCreateFormOpen(false);
    setIsEditFormOpen(false);
    setIsEditFormOpen(true);
    setRowDataForForm(rowData);
  };
  const closeEditForm = () => {
    setIsEditFormOpen(false);
  };
  const handleDelete = (taskId) => {
    swal({
      title: `You definitely want to delete ${taskId.title} task`,
      text: "Once deleted, you will not be able to restore this task",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        await axiosClient.delete(`/tasks/`, {
          data: { taskIds: taskId._id },
        });
        swal(`${taskId.title.toUpperCase()} has been deleted`, {
          icon: "success",
        });
        await fetchData();
      } else {
        return;
      }
    });
  };

  const handleCompletedTask = (task) => {
    swal({
      title: `Confirm the task ${task.title} is completed`,
      text: "Once confirmed, you will not be able to restore this status",
      icon: "info",
      buttons: true,
      dangerMode: true,
    }).then(async (willAccept) => {
      if (willAccept) {
        await axiosClient.patch(`/tasks/complete/${task._id}`);
        swal(`${task.title.toUpperCase()} has been confirmed as completed`, {
          icon: "success",
        });
        await fetchData();
      } else {
        return;
      }
    });
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
              style={
                fullname !== params.data.creator.fullname ||
                params.data.status === "complete"
                  ? { display: "none" }
                  : {}
              }
              onClick={() => openEditForm(params.data)}
              variant="outlined"
              color="primary"
            >
              <FontAwesomeIcon icon={faPenToSquare} />
            </IconButton>
          </Tippy>
          <Tippy content="Delete">
            <IconButton
              style={
                fullname !== params.data.creator.fullname ||
                params.data.status !== "not started"
                  ? { display: "none" }
                  : {}
              }
              onClick={() => handleDelete(params.data)}
              variant="outlined"
              color="error"
            >
              <FontAwesomeIcon icon={faTrash} />
            </IconButton>
          </Tippy>

          <Link to={`/tasking/report/${params.data._id}`}>
            <Tippy content="Reports">
              <IconButton variant="outlined" color="primary">
                <FontAwesomeIcon icon={faTasks} />
              </IconButton>
            </Tippy>
          </Link>
          <Tippy content="Complete">
            <IconButton
              style={
                params.data.status !== "in progress" ? { display: "none" } : {}
              }
              variant="outlined"
              color="primary"
              onClick={() => handleCompletedTask(params.data)}
            >
              <FontAwesomeIcon icon={faCheck} />
            </IconButton>
          </Tippy>
        </>
      </div>
    );
  };
  const columnDefs = [
    {
      headerName: "Title",
      field: "title",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Description",
      field: "description",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Due Date",
      field: "dueDate",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Creator",
      field: "creator.fullname",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Previous Task",
      field: "previousTask.title",
      sortable: true,
      filter: true,
      cellRenderer: (params) => {
        if (params.value === null || params.value === undefined) {
          return "-";
        } else {
          return params.value;
        }
      },
    },
    {
      headerName: "Status",
      field: "status",
      sortable: true,
      filter: true,
      cellStyle: (params) => {
        if (params.value === "completed") {
          return {
            color: "white",
            backgroundColor: "#33a47c",
            fontWeight: "500",
          };
        }
        if (params.value === "not started") {
          return {
            color: "white",
            backgroundColor: "#64687d",
            fontWeight: "500",
          };
        }
        if (params.value === "in progress") {
          return {
            color: "white",
            backgroundColor: "#c1945c",
            fontWeight: "500",
          };
        }
        if (params.value === "missed") {
          return {
            color: "white",
            backgroundColor: "#C70039",
            fontWeight: "500",
          };
        }
        return null;
      },
    },
    {
      headerName: "Members",
      field: "members",
      sortable: true,
      filter: true,
      valueGetter: function (params) {
        if (params.data && params.data.members) {
          return params.data.members.map((member) => member.fullname);
        }
        return "";
      },
    },
    {
      headerName: "Action",
      field: "action",
      cellRenderer: actionCellRenderer,
    },
  ];

  const defaultColDef = useMemo(() => {
    return {
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
          <div className="project-title">Board: {boardName}</div>
        </Grid>

        <Grid item>
          <IconButton
            style={
              role === "project manager" ||
              (role === "board manager" && userId === boardInfo.board_leader)
                ? {}
                : { display: "none" }
            }
            onClick={() => openCreateForm()}
            variant="outlined"
          >
            <FontAwesomeIcon icon={faAdd} />
          </IconButton>
        </Grid>
      </Grid>
      <Grid container justifyContent="space-between">
        <Grid item>
          <div className="project-title">Project: {projectName}</div>
        </Grid>

        <Grid item></Grid>
      </Grid>
      <div
        className="ag-theme-alpine"
        style={{ height: "300px", width: "100%" }}
      >
        <AgGridReact
          columnDefs={columnDefs}
          rowData={boards}
          defaultColDef={defaultColDef}
          onGridReady={fetchData}
          pagination={true}
          pivotPanelShow={"always"}
          rowGroupPanelShow={"always"}
          paginationPageSize={5}
          suppressRowClickSelection={true}
          rowSelection={"multiple"}
        ></AgGridReact>
      </div>
      {isCreateFormOpen && (
        <AddTasksForm
          onBoardCreated={fetchData}
          closeForm={closeCreateForm}
          boardId={boardId}
        />
      )}
      {isEditFormOpen && (
        <EditTaskForm
          onBoardCreated={fetchData}
          rowData={rowDataForForm}
          closeForm={closeEditForm}
        />
      )}
    </div>
  );
};

export default TasksByBoardTable;
