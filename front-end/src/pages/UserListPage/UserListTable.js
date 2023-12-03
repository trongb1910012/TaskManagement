import React, { useState, useEffect, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import axiosClient from "../../api/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAdd,
  faPenToSquare,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { Grid, IconButton } from "@mui/material";
import AddUserForm from "./UserAddForm";
import EditUserForm from "./UserEditForm";
import swal from "sweetalert";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
const UserListTable = () => {
  const [projects, setProjects] = useState([]);
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [rowDataForForm, setRowDataForForm] = useState(null);
  const fetchData = async () => {
    try {
      const response = await axiosClient.get(`/users`);
      setProjects(response.data.users);
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
  const handleDelete = (userId) => {
    swal({
      title: `You definitely want to delete ${userId.fullname} user`,
      text: "Once deleted, user data cannot be restored",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        await axiosClient.delete(`/users/${userId._id}`);
        swal(`${userId.fullname.toUpperCase()} has been deleted`, {
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
              onClick={() => openEditForm(params.data)}
              variant="outlined"
              color="primary"
            >
              <FontAwesomeIcon icon={faPenToSquare} />
            </IconButton>
          </Tippy>
          <Tippy content="Delete">
            <IconButton
              onClick={() => handleDelete(params.data)}
              variant="outlined"
              color="error"
            >
              <FontAwesomeIcon icon={faTrash} />
            </IconButton>
          </Tippy>
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
      {isCreateFormOpen && (
        <AddUserForm onBoardCreated={fetchData} closeForm={handleCloseForm} />
      )}
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
