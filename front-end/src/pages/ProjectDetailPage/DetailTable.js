import React, { useState, useEffect, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import axiosClient from "../../api/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAdd,
  faEye,
  faPenToSquare,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { IconButton, Grid } from "@mui/material";
import swal from "sweetalert";
import cogoToast from "cogo-toast";
import CreateBoardForm from "./CreateBoardForm";
import TasksByBoardTable from "../BoardPage/TasksByBoardId";
var headerCheckboxSelection = function (params) {
  // we put checkbox on the name if we are not doing grouping
  return params.columnApi.getRowGroupColumns().length === 0;
};
const DetailTable = (project) => {
  const [projects, setProjects] = useState([]);
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [isTaskTableOpen, setIsTaskTableOpen] = useState(false);
  const [selectedProjectId, setSelectedBoardId] = useState(null);
  const [selectedProjectName, setSelectedBoardName] = useState(null);
  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");
  const fetchData = async () => {
    try {
      const response = await axiosClient.get(`/boards/${project.id}`);
      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  const handleOpenForm = () => {
    setIsCreateFormOpen(true);
  };
  const handleCloseForm = () => {
    setIsCreateFormOpen(false);
  };
  const handleEdit = async (rowData) => {
    try {
      const token = localStorage.getItem("token");
      const { board_name } = rowData; // Lấy thuộc tính "name" từ "rowData"
      const updatedData = { board_name }; // Tạo đối tượng mới chỉ chứa thuộc tính "name"

      const response = await axiosClient.put(
        `/boards/${rowData._id}?token=${token}`,
        updatedData
      );

      console.log(response.data); // Xử lý phản hồi theo ý muốn
      cogoToast.success("Added project successfully");
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
        swal(`${projectId.board_name} has been deleted `, {
          icon: "success",
        });
        await fetchData();
      } else {
        return;
      }
    });
  };
  const handleOpenTable = (boardID, boardName) => {
    setIsTaskTableOpen(!isTaskTableOpen);
    setSelectedBoardId(boardID);
    setSelectedBoardName(boardName);
  };
  const actionCellRenderer = (params) => {
    if (params.columnApi.getRowGroupColumns().length > 0) {
      return null;
    }

    return (
      <div>
        <>
          <IconButton
            style={
              role === "project manager" ||
              (role === "board manager" &&
                userId === params.data.board_leader._id)
                ? {}
                : { display: "none" }
            }
            onClick={() => handleEdit(params.data)}
            variant="outlined"
            color="primary"
          >
            <FontAwesomeIcon icon={faPenToSquare} />
          </IconButton>
          <IconButton
            style={
              role === "project manager" ||
              (role === "board manager" &&
                userId === params.data.board_leader._id)
                ? {}
                : { display: "none" }
            }
            disabled={params.data.countCompletedTasks > 0}
            onClick={() => handleDelete(params.data)}
            variant="outlined"
            color="error"
          >
            <FontAwesomeIcon icon={faTrash} />
          </IconButton>
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
            <FontAwesomeIcon icon={faEye} />
          </IconButton>
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
      headerCheckboxSelection: headerCheckboxSelection,
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
      field: "board_leader.fullname",
      sortable: true,
      filter: true,
      editable: false,
    },
    {
      headerName: "Complete",
      field: "countCompletedTasks",
      sortable: true,
      filter: true,
      editable: false,
    },
    {
      headerName: "Total",
      field: "countTasks",
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
      <Grid container justifyContent="flex-end">
        <Grid item>
          {" "}
          <IconButton onClick={() => handleOpenForm()} variant="outlined">
            <FontAwesomeIcon icon={faAdd} />
          </IconButton>
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
          // autoGroupColumnDef={autoGroupColumnDef}
          rowGroupPanelShow={"always"}
          paginationPageSize={5}
        ></AgGridReact>
      </div>
      {isCreateFormOpen && (
        <CreateBoardForm
          onBoardCreated={fetchData}
          onClose={handleCloseForm}
          project={project.id}
        />
      )}
      <div>
        {" "}
        {isTaskTableOpen && (
          <TasksByBoardTable
            boardId={selectedProjectId}
            boardName={selectedProjectName}
          />
        )}
      </div>
    </div>
  );
};

export default DetailTable;
