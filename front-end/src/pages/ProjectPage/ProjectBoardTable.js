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
import { IconButton, Grid } from "@mui/material";
import swal from "sweetalert";
import cogoToast from "cogo-toast";
import "./ProjectTable.css";
import AddBoardByProject from "./AddBoardByProject";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

const ProjectBoardTable = ({ projectId, projectName }) => {
  const [projects, setProjects] = useState([]);
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const fetchData = async () => {
    try {
      const response = await axiosClient.get(`/boards/${projectId}`);
      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleEdit = async (rowData) => {
    try {
      const { _id, board_name } = rowData;
      const requestBody = { board_name };
      const token = localStorage.getItem("token");
      await axiosClient.put(`/boards/${_id}?token=${token}`, requestBody);

      console.log(requestBody); // Xử lý phản hồi theo ý muốn
      cogoToast.success("Update project successfully", {
        position: "bottom-right",
      });
      fetchData(); // Cập nhật dữ liệu sau khi chỉnh sửa thành công
    } catch (error) {
      console.error(error); // Xử lý lỗi một cách phù hợp
    }
  };

  const handleDelete = (projectId) => {
    swal({
      title: `Bạn chắc chắn muốn xóa công việc ${projectId.board_name} này`,
      text: "Sau khi xóa, bạn sẽ không thể khôi phục công việc này!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const token = localStorage.getItem("token");
        await axiosClient.delete(`/boards/${projectId._id}?token=${token}`);
        swal(`${projectId.board_name} đã được xóa`, {
          icon: "success",
        });
        await fetchData();
      } else {
        return;
      }
    });
  };
  const openCreateForm = () => {
    setIsCreateFormOpen(true);
  };
  const closeCreateForm = () => {
    setIsCreateFormOpen(false);
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
              onClick={() => handleEdit(params.data)}
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
      headerName: "Name",
      field: "board_name",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Leader",
      field: "board_leader.fullname",
      sortable: true,
      filter: true,
      editable: false,
    },
    {
      headerName: "Action",
      field: "action",
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
      <Grid container justifyContent={"space-between"}>
        <Grid item>
          {" "}
          <div className="project-title">Project: {projectName}</div>
        </Grid>
        <Grid item>
          <IconButton onClick={() => openCreateForm()} variant="outlined">
            <FontAwesomeIcon icon={faAdd} />
          </IconButton>
        </Grid>
      </Grid>
      <div
        className="ag-theme-alpine"
        style={{ height: "300px", width: "100%" }}
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
      {isCreateFormOpen && (
        <AddBoardByProject
          onBoardCreated={fetchData}
          closeForm={closeCreateForm}
          projectId={projectId}
        />
      )}
    </div>
  );
};

export default ProjectBoardTable;
