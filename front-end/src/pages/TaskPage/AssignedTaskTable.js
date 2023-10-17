import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import axiosClient from "../../api/api";
import "./TaskTable.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClipboardCheck,
  faClock,
  faPenToSquare,
  faTasks,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { Grid, IconButton } from "@mui/material";
import swal from "sweetalert";
import AddTasksForm from "./AddTaskForm";
import EditTaskForm from "./EditTaskForm";

const AssignedTaskTable = () => {
  const [projects, setProjects] = useState([]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [rowDataForForm, setRowDataForForm] = useState(null);
  const [userinfo, setUserinfo] = useState([]);
  const updateTasksStatus = async () => {
    await axiosClient.put(`/tasks`);
  };
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axiosClient.get(`/tasks/nv?token=${token}`);
      setProjects(response.data.tasks);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getUserInfo = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axiosClient.get(`/users/userinfo?token=${token}`);
      setUserinfo(response.data.userinfo);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    getUserInfo();
    updateTasksStatus();
    fetchData();
  }, []);
  const handleDelete = (projectId) => {
    swal({
      title: `Bạn chắc chắn muốn xóa công việc ${projectId.title} này`,
      text: "Sau khi xóa, bạn sẽ không thể khôi phục công việc này!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        await axiosClient.delete(`/tasks/`, {
          data: { taskIds: projectId._id },
        });
        swal(`${projectId.title.toUpperCase()} đã được xóa`, {
          icon: "success",
        });
        await fetchData();
      } else {
        return;
      }
    });
  };
  const handleAcceptTask = (task) => {
    swal({
      title: `Bạn sẽ nhận công việc ${task.title} này`,
      text: "Sau khi nhận, bạn sẽ không thể khôi phục công việc này!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willAccept) => {
      if (willAccept) {
        await axiosClient.patch(`/tasks/start/${task._id}`);
        swal(`${task.title.toUpperCase()} đã được nhận`, {
          icon: "success",
        });
        await fetchData();
      } else {
        return;
      }
    });
  };
  const closeCreateForm = () => {
    setIsCreateFormOpen(false);
  };
  const openEditForm = (rowData) => {
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
    // Kiểm tra id người dùng và id creator
    if (userinfo._id !== params.data.creator._id) {
      return (
        <>
          {params.data.status === "not started" ? null : (
            <>
              {" "}
              <Link to={`/tasking/report/${params.data._id}`}>
                <IconButton variant="outlined" color="primary">
                  <FontAwesomeIcon icon={faTasks} />
                </IconButton>
              </Link>{" "}
              <Link to={`/tasking/extend/${params.data._id}`}>
                <IconButton variant="outlined" color="secondary">
                  <FontAwesomeIcon icon={faClock} />
                </IconButton>
              </Link>
            </>
          )}

          <IconButton
            style={
              params.data.status !== "not started" ? { display: "none" } : {}
            }
            variant="outlined"
            color="primary"
            onClick={() => handleAcceptTask(params.data)}
          >
            <FontAwesomeIcon icon={faClipboardCheck} />
          </IconButton>
        </>
      );
    }
    return (
      <div>
        <IconButton
          onClick={() => openEditForm(params.data)}
          variant="outlined"
          color="primary"
        >
          <FontAwesomeIcon icon={faPenToSquare} />
        </IconButton>
        <IconButton
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
      headerName: "Board",
      field: "board.board_name",
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
      headerName: "Creator",
      field: "creator.fullname",
      sortable: true,
      filter: true,
      valueGetter: function (params) {
        if (params.data && params.data.creator) {
          return params.data.creator.fullname;
        }
        return "";
      },
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
            backgroundColor: "red",
            fontWeight: "500",
          };
        }
        return null;
      },
    },
    // {
    //   headerName: "Members",
    //   field: "members",
    //   sortable: true,
    //   filter: true,
    //   valueGetter: function (params) {
    //     if (params.data && params.data.members) {
    //       return params.data.members.map((member) => member.fullname);
    //     }
    //     return "";
    //   },
    // },
    {
      headerName: "Action",
      field: "action",
      sortable: false,
      filter: false,
      editable: false,
      cellRenderer: actionCellRenderer,
    },
  ];

  // const onFilterTextBoxChanged = (event) => {
  //   gridApi.setQuickFilter(event.target.value);
  // };
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
      <Grid container justifyContent="flex-start">
        <Grid item>
          <h1>ASSIGNED TASKS</h1>
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
      <Grid container spacing={2}>
        <Grid item xs={6}>
          {isCreateFormOpen && (
            <AddTasksForm
              onBoardCreated={fetchData}
              closeForm={closeCreateForm}
            />
          )}
        </Grid>
        <Grid item xs={6}>
          {isFormOpen && (
            <EditTaskForm
              onBoardCreated={fetchData}
              rowData={rowDataForForm}
              closeForm={closeForm}
            />
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default AssignedTaskTable;
