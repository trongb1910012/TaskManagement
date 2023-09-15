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
} from "@fortawesome/free-solid-svg-icons";
import { IconButton } from "@mui/material";
import swal from "sweetalert";
import AddTasksForm from "./AddTaskForm";
import EditTaskForm from "./EditTaskForm";
import { Grid } from "@mui/material";
var checkboxSelection = function (params) {
  return params.columnApi.getRowGroupColumns().length === 0;
};

var headerCheckboxSelection = function (params) {
  // we put checkbox on the name if we are not doing grouping
  return params.columnApi.getRowGroupColumns().length === 0;
};

const ProjectList = () => {
  const [projects, setProjects] = useState([]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [rowDataForForm, setRowDataForForm] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isAnyCheckboxSelected, setIsAnyCheckboxSelected] = useState(false);
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axiosClient.get(`/tasks/created?token=${token}`);
      setProjects(response.data.tasks);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
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
        await axiosClient.delete("/tasks/", {
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
        return null;
      },
    },
    {
      headerName: "Members",
      field: "members",
      sortable: true,
      filter: true,
      valueGetter: function (params) {
        return params.data.members.map(function (member) {
          return member.fullname;
        });
      },
    },
    {
      headerName: "Action",
      field: "action",
      sortable: false,
      filter: false,
      editable: false,
      rowGroup: false,
      cellRenderer: (params) => (
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
        </div>
      ),
    },
  ];

  // const onFilterTextBoxChanged = (event) => {
  //   gridApi.setQuickFilter(event.target.value);
  // };
  const defaultColDef = useMemo(() => {
    return {
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
      <Grid container justifyContent="flex-end">
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
            <IconButton onClick={() => openCreateForm()} variant="outlined">
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
          suppressRowClickSelection={true}
          rowSelection={"multiple"}
          onSelectionChanged={(event) =>
            handleCheckboxChange(event.api.getSelectedRows())
          }
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

export default ProjectList;
