import React, { useState, useEffect, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import axiosClient from "../../api/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useParams } from "react-router-dom";
import { faAdd, faTrash } from "@fortawesome/free-solid-svg-icons";
import { IconButton } from "@mui/material";
import swal from "sweetalert";
import { Grid } from "@mui/material";
import { AddReportForm } from "./ReportAddForm";
import { TaskInfo } from "./TaskInfo";
import classNames from "classnames/bind";
import styles from "./ReportPage.module.scss";
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
  const [selectedRows, setSelectedRows] = useState([]);
  const [isAnyCheckboxSelected, setIsAnyCheckboxSelected] = useState(false);
  const [taskData, setTaskData] = useState([]);
  const { id } = useParams();
  const updateTasksStatus = async () => {
    await axiosClient.put(`/tasks`);
  };
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
    const nameFromLocalStorage = localStorage.getItem("fullname");
    return (
      taskData &&
      taskData.members &&
      taskData.members.some(
        (member) => member.fullname === nameFromLocalStorage
      )
    );
  }, [taskData]);
  console.log(taskData.members);
  const handleDelete = (projectId) => {
    swal({
      title: `Bạn chắc chắn muốn xóa công việc ${projectId.title} này`,
      text: "Sau khi xóa, bạn sẽ không thể khôi phục công việc này!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        await axiosClient.delete(`/reports/`, {
          data: { id: projectId._id },
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
  const handleDeleteSelectedTasks = () => {
    swal({
      title: "Bạn chắc chắn muốn xóa những công việc đã chọn?",
      text: "Sau khi xóa, bạn sẽ không thể khôi phục công việc này!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const selectedTaskIds = selectedRows.map((row) => row._id);
        await axiosClient.delete("/report/", {
          data: { taskIds: selectedTaskIds },
        });
        swal("Các công việc đã được xóa thành công!", {
          icon: "success",
        });
        await fetchData();
      }
    });
  };
  const handleCheckboxChange = (selectedRows) => {
    setSelectedRows(selectedRows);
    setIsAnyCheckboxSelected(selectedRows.length > 0);
  };

  const actionCellRenderer = (params) => {
    if (params.columnApi.getRowGroupColumns().length > 0) {
      return null;
    }

    return (
      <div>
        {/* <IconButton
          onClick={() => openEditForm(params.data)}
          variant="outlined"
          color="primary"
        >
          <FontAwesomeIcon icon={faPenToSquare} />
        </IconButton> */}
        <IconButton
          onClick={() => handleDelete(params.data)}
          variant="outlined"
          color="error"
        >
          <FontAwesomeIcon icon={faTrash} />
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
        if (params.value === "solved") {
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
      <TaskInfo />
      {shouldShowAddReportForm && <AddReportForm fetch={fetchData} />}
      <Grid container justifyContent="space-between">
        <Grid item>
          <h1>REPORTS</h1>{" "}
        </Grid>
        <Grid item>
          {isAnyCheckboxSelected ? (
            <IconButton
              sx={{ color: "red" }}
              onClick={handleDeleteSelectedTasks}
              variant="outlined"
            >
              <FontAwesomeIcon icon={faTrash} />
            </IconButton>
          ) : (
            <IconButton variant="outlined">
              <FontAwesomeIcon icon={faAdd} />
            </IconButton>
          )}
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
          paginationPageSize={5}
          rowGroupPanelShow={"always"}
          suppressRowClickSelection={true}
          rowSelection={"multiple"}
          onSelectionChanged={(event) =>
            handleCheckboxChange(event.api.getSelectedRows())
          }
        ></AgGridReact>
      </div>
    </div>
  );
};
