import React, { useState, useEffect, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import axiosClient from "../../api/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faSave,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { IconButton } from "@mui/material";
import swal from "sweetalert";
import cogoToast from "cogo-toast";
import CreateBoardForm from "./CreateBoardForm";
var headerCheckboxSelection = function (params) {
  // we put checkbox on the name if we are not doing grouping
  return params.columnApi.getRowGroupColumns().length === 0;
};
const ProjectTable = () => {
  const [projects, setProjects] = useState([]);
  const [newRowData, setNewRowData] = useState({});
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axiosClient.get(
        `/boards/cv_leader?token=${token}`
      );
      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
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
  const handleEdit = async (rowData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axiosClient.put(
        `/boards/${rowData._id}?token=${token}`,
        rowData
      );

      console.log(response.data); // Xử lý phản hồi theo ý muốn
      cogoToast.success("Cập nhật dự án thành công");
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
  const columnDefs = [
    {
      headerName: "Name",
      field: "board_name",
      sortable: true,
      filter: true,
      headerCheckboxSelection: headerCheckboxSelection,
    },
    {
      headerName: "Project",
      field: "projectName",
      sortable: true,
      filter: true,
      editable: false,
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
      field: "leaderName",
      sortable: true,
      filter: true,
      editable: false,
    },
    {
      headerName: "Action",
      field: "action",
      cellRenderer: (params) => (
        <div>
          {params.data !== newRowData && (
            <>
              <IconButton
                onClick={() => handleEdit(params.data)}
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
      ),
    },
  ];

  // const autoGroupColumnDef = useMemo(() => {
  //   return {
  //     headerName: "Group",
  //     minWidth: 170,
  //     field: "Title",
  //     valueGetter: (params) => {
  //       if (params.node.group) {
  //         return params.node.key;
  //       } else {
  //         return params.data[params.colDef.field];
  //       }
  //     },
  //     headerCheckboxSelection: true,
  //     cellRenderer: "agGroupCellRenderer",
  //     cellRendererParams: {
  //       checkbox: true,
  //     },
  //   };
  // }, []);
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
      <CreateBoardForm onBoardCreated={fetchData} />
    </div>
  );
};

export default ProjectTable;
