import React, { useState, useEffect, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import axiosClient from "../../api/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useParams } from "react-router-dom";
import {
  faCheck,
  faEye,
  faTrash,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { IconButton } from "@mui/material";
import swal from "sweetalert";
import { Grid } from "@mui/material";
import { AddReportForm } from "./ReportAddForm";
import { TaskInfo } from "./TaskInfo";
import classNames from "classnames/bind";
import styles from "./ReportPage.module.scss";
import BackButton from "../../components/BackButton";

const cx = classNames.bind(styles);
var checkboxSelection = function (params) {
  return params.columnApi.getRowGroupColumns().length === 0;
};

var headerCheckboxSelection = function (params) {
  // we put checkbox on the name if we are not doing grouping
  return params.columnApi.getRowGroupColumns().length === 0;
};

export const ReportsList = () => {
  const [projects, setProjects] = useState([]);

  const [taskData, setTaskData] = useState([]);
  const { id } = useParams();
  const updateTasksStatus = async () => {
    await axiosClient.put(`/tasks`);
  };
  const role = localStorage.getItem("role");
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axiosClient.get(`/reports/${id}?token=${token}`);
      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchTaskInfo = async () => {
    try {
      const response = await axiosClient.get(`/tasks/taskinfo?id=${id}`);
      setTaskData(response.data.task);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchTaskInfo();
    updateTasksStatus();
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const shouldShowAddReportForm = useMemo(() => {
    const name = localStorage.getItem("fullname");

    return (
      taskData &&
      taskData.members?.some((member) => member.fullname === name) &&
      ["in progress"].includes(taskData.status)
    );
  }, [taskData]);

  const handleDelete = (projectId) => {
    swal({
      title: `You definitely want to delete ${projectId.title} report`,
      text: "Once deleted, you will not be able to restore this report",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        await axiosClient.delete(`/reports/`, {
          data: { id: projectId._id },
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
  const handleResolve = (projectId) => {
    swal({
      title: `Resolve ${projectId.title} report`,
      text: "Once resolved, you will not be able to restore this report status!",
      icon: "info",
      buttons: true,
      dangerMode: false,
    }).then(async (willDelete) => {
      if (willDelete) {
        await axiosClient.patch(`/reports/resolve/${projectId._id}`);
        swal(`${projectId.title.toUpperCase()} has been resolved`, {
          icon: "success",
        });
        await fetchData();
      } else {
        return;
      }
    });
  };
  const handleReject = (projectId) => {
    swal({
      title: `Reject ${projectId.title} report`,
      text: "Once reject, you will not be able to restore this report status!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        await axiosClient.patch(`/reports/reject/${projectId._id}`);
        swal(` ${projectId.title.toUpperCase()} has been reject`, {
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
        {role === "user" && (
          <>
            <IconButton
              style={params.data.status !== "open" ? { display: "none" } : {}}
              onClick={() => handleDelete(params.data)}
              variant="outlined"
              color="error"
            >
              <FontAwesomeIcon icon={faTrash} />
            </IconButton>
            <Link to={`/tasking/report/detail/${params.data._id}`}>
              <IconButton variant="outlined">
                <FontAwesomeIcon icon={faEye} />
              </IconButton>
            </Link>
          </>
        )}

        {role !== "user" && (
          <>
            <IconButton
              style={params.data.status !== "open" ? { display: "none" } : {}}
              onClick={() => handleResolve(params.data)}
              variant="outlined"
              color="info"
            >
              <FontAwesomeIcon icon={faCheck} />
            </IconButton>
            <IconButton
              style={params.data.status !== "open" ? { display: "none" } : {}}
              onClick={() => handleReject(params.data)}
              variant="outlined"
              color="error"
            >
              <FontAwesomeIcon icon={faX} />
            </IconButton>
            <Link to={`/tasking/report/detail/${params.data._id}`}>
              <IconButton variant="outlined">
                <FontAwesomeIcon icon={faEye} />
              </IconButton>
            </Link>
          </>
        )}
      </div>
    );
  };
  const columnDefs = [
    {
      headerName: "Title",
      field: "title",
      sortable: true,
      filter: true,
      checkboxSelection: checkboxSelection,
      headerCheckboxSelection: headerCheckboxSelection,
    },
    {
      headerName: "Description",
      field: "description",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Created at",
      field: "createdAt",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Author",
      field: "author.fullname",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Status",
      field: "status",
      sortable: true,
      filter: true,
      cellStyle: (params) => {
        if (params.value === "resolved") {
          return {
            color: "white",
            backgroundColor: "#33a47c",
            fontWeight: "500",
          };
        }
        if (params.value === "open") {
          return {
            color: "white",
            backgroundColor: "#64687d",
            fontWeight: "500",
          };
        }
        if (params.value === "rejected") {
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
    <div className={cx("wrapper")}>
      <BackButton />
      <TaskInfo />
      {shouldShowAddReportForm && <AddReportForm fetch={fetchData} />}
      <Grid container justifyContent="space-between">
        <Grid item>
          <h1>REPORTS</h1>{" "}
        </Grid>
        <Grid item></Grid>
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
          paginationPageSize={5}
          rowGroupPanelShow={"always"}
          suppressRowClickSelection={true}
          rowSelection={"multiple"}
        ></AgGridReact>
      </div>
    </div>
  );
};
