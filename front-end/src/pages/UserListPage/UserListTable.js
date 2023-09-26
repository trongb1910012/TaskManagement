import React, { useState, useEffect, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import axiosClient from "../../api/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAdd,
  faEye,
  faFile,
  faPenToSquare,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { Grid, IconButton } from "@mui/material";
import swal from "sweetalert";
// import ProjectBoardTable from "./ProjectBoardTable";
import { Link } from "react-router-dom";
// import AddProjectForm from "./AddProjectForm";
import EditUserForm from "./UserEditForm";
const UserListTable = () => {
  const [projects, setProjects] = useState([]);

  const [isUserListTableOpen, setIsUserListTableOpen] = useState(false);
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [rowDataForForm, setRowDataForForm] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [selectedProjectName, setSelectedProjectName] = useState(null);
  const fetchData = async () => {
    try {
      const response = await axiosClient.get(`/users`);
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
    setIsEditFormOpen(false);
  };
  const openEditForm = (rowData) => {
    setIsCreateFormOpen(false);
    setIsEditFormOpen(false);
    setIsEditFormOpen(true);
    setRowDataForForm(rowData);
  };

  const handleOpenTable = (projectId, projectName) => {
    setIsUserListTableOpen(!isUserListTableOpen);
    setSelectedProjectId(projectId);
    setSelectedProjectName(projectName);
  };
  const actionCellRenderer = (params) => {
    if (params.columnApi.getRowGroupColumns().length > 0) {
      return null;
    }

    return (
      <div>
        <>
          <IconButton
            onClick={() => openEditForm(params.data)}
            variant="outlined"
            color="primary"
          >
            <FontAwesomeIcon icon={faPenToSquare} />
          </IconButton>
          <IconButton
            onClick={() => handleOpenTable(params.data._id, params.data.title)}
            variant="outlined"
          >
            <FontAwesomeIcon icon={faFile} style={{ color: "#657795" }} />
          </IconButton>
          {/* <Link to={`${params.data._id}`}>
            <IconButton variant="outlined">
              <FontAwesomeIcon icon={faEye} />
            </IconButton>
          </Link> */}
        </>
      </div>
    );
  };

  const columnDefs = [
    {
      headerName: "Full name",
      field: "fullname",
      sortable: true,
      filter: true,
    },
    {
      headerName: "User name",
      field: "username",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Email",
      field: "email",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Birth date",
      field: "birthDay",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Role",
      field: "role",
      sortable: true,
      cellStyle: (params) => {
        if (params.value === "user") {
          //mark police cells as red
          return {
            color: "white",
            backgroundColor: "#33a47c",
            fontWeight: "500",
          };
        }
        if (params.value === "admin") {
          return {
            color: "white",
            backgroundColor: "#64687d",
            fontWeight: "500",
          };
        }
        return null;
      },
      filter: true,
    },
    {
      headerName: "Action",
      field: "action",
      cellRenderer: actionCellRenderer,
    },
  ];

  const autoGroupColumnDef = useMemo(() => {
    return {
      headerName: "Group",
      minWidth: 170,
      field: "Title",
      valueGetter: (params) => {
        if (params.node.group) {
          return params.node.key;
        } else {
          return params.data[params.colDef.title];
        }
      },
      headerCheckboxSelection: true,
      cellRenderer: "agGroupCellRenderer",
      cellRendererParams: {
        checkbox: true,
      },
    };
  }, []);
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
          <h1>USER LIST</h1>
        </Grid>
        <Grid item>
          {" "}
          <IconButton onClick={() => handleOpenForm()} variant="outlined">
            <FontAwesomeIcon icon={faAdd} />
          </IconButton>
        </Grid>
      </Grid>
      <div
        className="ag-theme-alpine"
        style={{ height: "500px", width: "100%" }}
      >
        <AgGridReact
          columnDefs={columnDefs}
          rowData={projects}
          defaultColDef={defaultColDef}
          onGridReady={fetchData}
          pagination={true}
          pivotPanelShow={"always"}
          autoGroupColumnDef={autoGroupColumnDef}
          rowGroupPanelShow={"always"}
          paginationPageSize={10}
        ></AgGridReact>
      </div>
      {/* {isCreateFormOpen && (
        <AddProjectForm
          onBoardCreated={fetchData}
          closeForm={handleCloseForm}
        />
      )}*/}
      {isEditFormOpen && (
        <EditUserForm
          onBoardCreated={fetchData}
          rowData={rowDataForForm}
          closeForm={handleCloseForm}
        />
      )}
      {/* <Grid container spacing={0}>
        <Grid item xs={12} xl={6}>
          {isUserListTableOpen && (
            <ProjectBoardTable
              projectId={selectedProjectId}
              projectName={selectedProjectName}
            />
          )}
        </Grid>
      </Grid> */}
    </div>
  );
};

export default UserListTable;
