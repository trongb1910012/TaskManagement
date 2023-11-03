import React, { useState, useEffect, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import axiosClient from "../../api/api";
import "./TaskTable.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAdd,
  faPenToSquare,
  faTrash,
  faTasks,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { IconButton } from "@mui/material";
import swal from "sweetalert";
import AddTasksForm from "./AddTaskForm";
import EditTaskForm from "./EditTaskForm";
import { Grid } from "@mui/material";
import "ag-grid-enterprise";
import { LicenseManager } from "ag-grid-enterprise";
import { Link } from "react-router-dom";
LicenseManager.setLicenseKey("AG-047238");

const ProjectMangerTasks = () => {
  const [projects, setProjects] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [rowDataForForm, setRowDataForForm] = useState(null);

  const updateTasksStatus = async () => {
    await axiosClient.put(`/tasks`);
  };
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axiosClient.get(
        `/tasks/ownerTasks?token=${token}`
      );
      setProjects(response.data.tasks);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    updateTasksStatus();
    fetchData();
  }, []);
  const handleDelete = (projectId) => {
    swal({
      title: `You definitely want to delete ${projectId.title} task`,
      text: "Once deleted, you will not be able to restore this report",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        await axiosClient.delete(`/tasks/`, {
          data: { taskIds: projectId._id },
        });
        swal(`${projectId.title.toUpperCase()} has been deleted`, {
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
  const openCreateForm = () => {
    setIsFormOpen(false);
    setIsCreateFormOpen(false);
    setIsCreateFormOpen(true);
  };
  const closeCreateForm = () => {
    setIsCreateFormOpen(false);
  };
  const openEditForm = (rowData) => {
    setIsCreateFormOpen(false);
    setIsFormOpen(false);
    setIsFormOpen(true);
    setRowDataForForm(rowData);
  };
  const closeForm = () => {
    setIsFormOpen(false);
  };
  const actionCellRenderer = (params) => {
    if (params.columnApi.getRowGroupColumns().length > 0) {
      return null;
    }

    return (
      <div>
        <IconButton
          style={
            params.data.status !== "not started" ? { display: "none" } : {}
          }
          onClick={() => openEditForm(params.data)}
          variant="outlined"
          color="primary"
        >
          <FontAwesomeIcon icon={faPenToSquare} />
        </IconButton>
        <IconButton
          style={
            params.data.status !== "not started" ? { display: "none" } : {}
          }
          onClick={() => handleDelete(params.data)}
          variant="outlined"
          color="error"
        >
          <FontAwesomeIcon icon={faTrash} />
        </IconButton>

        <Link to={`/tasking/report/${params.data._id}`}>
          <IconButton variant="outlined" color="primary">
            <FontAwesomeIcon icon={faTasks} />
          </IconButton>
        </Link>
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
      headerName: "Project",
      field: "board.project.title",
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
      headerName: "Status",
      field: "status",
      sortable: true,
      filter: true,
      cellStyle: (params) => {
        if (params.value === "completed") {
          //mark police cells as red
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
      sortable: false,
      filter: false,
      editable: false,
      rowGroup: false,
      cellRenderer: actionCellRenderer,
    },
  ];

  // const onFilterTextBoxChanged = (event) => {
  //   gridApi.setQuickFilter(event.target.value);
  // };
  const defaultColDef = useMemo(() => {
    return {
      enablePivot: true,
      enableValue: true,
      enableRowGroup: true,
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
          <h1>My project's tasks</h1>{" "}
        </Grid>
        <Grid item>
          <IconButton onClick={() => openCreateForm()} variant="outlined">
            <FontAwesomeIcon icon={faAdd} />
          </IconButton>
        </Grid>
      </Grid>
      <div
        className="ag-theme-alpine"
        style={{ height: "350px", width: "100%", borderRadius: "10px" }}
      >
        <AgGridReact
          columnDefs={columnDefs}
          rowData={projects}
          defaultColDef={defaultColDef}
          onGridReady={fetchData}
          pagination={true}
          pivotPanelShow={"always"}
          paginationPageSize={10}
          rowGroupPanelShow={"always"}
          suppressRowClickSelection={true}
        ></AgGridReact>
      </div>
      {isCreateFormOpen && (
        <AddTasksForm onBoardCreated={fetchData} closeForm={closeCreateForm} />
      )}
      {isFormOpen && (
        <EditTaskForm
          onBoardCreated={fetchData}
          rowData={rowDataForForm}
          closeForm={closeForm}
        />
      )}
    </div>
  );
};

export default ProjectMangerTasks;
