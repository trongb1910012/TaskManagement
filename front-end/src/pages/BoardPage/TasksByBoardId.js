import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import axiosClient from "../../api/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faSave,
  faTrash,
  faAdd,
  faTasks,
} from "@fortawesome/free-solid-svg-icons";
import { IconButton, Grid } from "@mui/material";
import swal from "sweetalert";
import cogoToast from "cogo-toast";
import AddTasksForm from "./AddTaskByBoardForm";
import EditTaskForm from "./EditTaskByBoardForm";
var headerCheckboxSelection = function (params) {
  // we put checkbox on the name if we are not doing grouping
  return params.columnApi.getRowGroupColumns().length === 0;
};
var checkboxSelection = function (params) {
  return params.columnApi.getRowGroupColumns().length === 0;
};
const TasksByBoardTable = ({ boardId, boardName }) => {
  const [boards, setBoards] = useState([]);
  const [newRowData, setNewRowData] = useState({});
  const [rowDataForForm, setRowDataForForm] = useState(null);
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isAnyCheckboxSelected, setIsAnyCheckboxSelected] = useState(false);
  const fetchData = async () => {
    try {
      const response = await axiosClient.get(`/tasks/${boardId}`);
      setBoards(response.data.tasks);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRowSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axiosClient.post(
        `/boards?token=${token}`,
        newRowData
      );

      console.log(response.data);
      cogoToast.success("Tạo hàng mới thành công");

      fetchData();
      setNewRowData({}); // Đặt lại dữ liệu hàng mới về trạng thái ban đầu
    } catch (error) {
      console.error(error);
    }
  };
  // const handleAddRow = () => {
  //   const emptyRow = {
  //     title: "",
  //     description: "",
  //     startDate: "",
  //     endDate: "",
  //     status: "",
  //     budget: "",
  //     owner: {
  //       fullname: "",
  //     },
  //   };

  //   setProjects([...projects, emptyRow]);
  // };
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
      title: `Bạn chắc chắn muốn xóa công việc ${taskId.title} này`,
      text: "Sau khi xóa, bạn sẽ không thể khôi phục công việc này!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        await axiosClient.delete(`/tasks/`, {
          data: { taskIds: taskId._id },
        });
        swal(`Công việc ${taskId.title.toUpperCase()} đã được xóa`, {
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
  const actionCellRenderer = (params) => {
    if (params.columnApi.getRowGroupColumns().length > 0) {
      return null;
    }

    return (
      <div>
        {params.data !== newRowData && (
          <>
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
          </>
        )}

        {params.data === newRowData && (
          <IconButton
            onClick={handleRowSubmit}
            variant="outlined"
            color="primary"
          >
            <FontAwesomeIcon icon={faSave} />
          </IconButton>
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
          onSelectionChanged={(event) =>
            handleCheckboxChange(event.api.getSelectedRows())
          }
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
