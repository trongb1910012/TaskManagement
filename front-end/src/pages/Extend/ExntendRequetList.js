import React, { useState, useEffect, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import axiosClient from "../../api/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useParams } from "react-router-dom";
import { faCheck, faTrash, faX } from "@fortawesome/free-solid-svg-icons";
import { IconButton } from "@mui/material";
import swal from "sweetalert";
import { Grid } from "@mui/material";

import classNames from "classnames/bind";
import styles from "../ReportPage/ReportPage.module.scss";
import { ExtendRequestForm } from "../Extend/AddExtendForm";
import BackButton from "../../components/BackButton";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
const cx = classNames.bind(styles);

export const ExtendRequestList = () => {
  const [projects, setProjects] = useState([]);

  const [taskData, setTaskData] = useState([]);
  const { id } = useParams();
  const role = localStorage.getItem("role");
  const fetchData = async () => {
    try {
      const response = await axiosClient.get(`/comments/${id}`);
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
      title: `You definitely want to delete this extend request`,
      text: "Once deleted, you will not be able to restore this report",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        await axiosClient.delete(`/comments/${projectId._id}`);
        swal(`This extend request has been deleted`, {
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
      title: `Resolve this request`,
      text: "Once resolved, you will not be able to restore this request status!",
      icon: "info",
      buttons: true,
      dangerMode: false,
    }).then(async (willDelete) => {
      if (willDelete) {
        await axiosClient.patch(`/comments/resolve/${projectId._id}`);
        swal(`This extend request has been resolved`, {
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
      title: `Reject this request `,
      text: "Once reject, you will not be able to restore this extend request status",
      icon: "info",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        await axiosClient.patch(`/comments/reject/${projectId._id}`);
        swal(` The request has been rejected`, {
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
            <Tippy content="Delete">
              <IconButton
                style={params.data.status !== "open" ? { display: "none" } : {}}
                onClick={() => handleDelete(params.data)}
                variant="outlined"
                color="error"
              >
                <FontAwesomeIcon icon={faTrash} />
              </IconButton>
            </Tippy>
          </>
        )}

        {role !== "user" && (
          <>
            <Tippy content="Resolve">
              <IconButton
                style={params.data.status !== "open" ? { display: "none" } : {}}
                onClick={() => handleResolve(params.data)}
                variant="outlined"
                color="info"
              >
                <FontAwesomeIcon icon={faCheck} />
              </IconButton>
            </Tippy>
            <Tippy content="Reject">
              <IconButton
                style={params.data.status !== "open" ? { display: "none" } : {}}
                onClick={() => handleReject(params.data)}
                variant="outlined"
                color="error"
              >
                <FontAwesomeIcon icon={faX} />
              </IconButton>
            </Tippy>
          </>
        )}
      </div>
    );
  };
  const columnDefs = [
    {
      headerName: "Task",
      field: "task_id.title",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Reason",
      field: "comment_text",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Request due date",
      field: "new_dueDate",
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
      field: "user_id.fullname",
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
      <BackButton></BackButton>
      <Grid container justifyContent="space-between">
        <Grid item xl={12}>
          {" "}
          <h1>Task: {taskData.title}</h1>
          <h3>Due date: {taskData.dueDate}</h3>
        </Grid>
        <Grid item xl={12}>
          {shouldShowAddReportForm && <ExtendRequestForm fetch={fetchData} />}
        </Grid>
      </Grid>
      <h1>Extend Requests</h1>
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
