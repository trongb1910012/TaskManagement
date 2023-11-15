/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Divider,
  Typography,
  Button,
} from "@mui/material";
import axiosClient from "../../api/api";
import classNames from "classnames/bind";
import styles from "../HomePage/homepage.module.scss";
import swal from "sweetalert";
import BackButton from "../../components/BackButton";
const cx = classNames.bind(styles);
export const ReportDetail = () => {
  const [data, setData] = useState(null);
  const { reportId } = useParams();
  const role = localStorage.getItem("role");
  const fetchData = async () => {
    try {
      const response = await axiosClient.get(
        `/reports/reportInfo?id=${reportId}`
      );
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const handleResolve = (reportId) => {
    swal({
      title: `Resolve this report`,
      text: "Once resolved, you will not be able to restore this report status!",
      icon: "info",
      buttons: true,
      dangerMode: false,
    }).then(async (willDelete) => {
      if (willDelete) {
        await axiosClient.patch(`/reports/resolve/${reportId}`);
        swal(`This report has been resolved`, {
          icon: "success",
        });
        await fetchData();
      } else {
        return;
      }
    });
  };
  const handleReject = (reportId) => {
    swal({
      title: `Reject this report`,
      text: "Once reject, you will not be able to restore this report status!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        await axiosClient.patch(`/reports/reject/${reportId}`);
        swal(` This has been reject`, {
          icon: "success",
        });
        await fetchData();
      } else {
        return;
      }
    });
  };
  const handleDownload = async (fileTitle) => {
    try {
      // Gửi yêu cầu tải xuống file bằng cách sử dụng ID của file (nếu có)
      const response = await axiosClient.get(`/reports/download/${fileTitle}`, {
        responseType: "blob", // Yêu cầu dữ liệu trả về dạng blob
      });

      // Xử lý dữ liệu blob và tạo URL tải xuống
      const file = new Blob([response.data]);
      const fileURL = URL.createObjectURL(file);

      // Tạo một thẻ a ẩn để tải xuống file
      const downloadLink = document.createElement("a");
      downloadLink.href = fileURL;
      downloadLink.download = fileTitle;
      downloadLink.click();

      // Giải phóng URL tải xuống
      URL.revokeObjectURL(fileURL);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };
  return (
    <div className={cx("wrapper")}>
      <BackButton />
      <Card
        sx={{
          border: "1px solid #30324e",
          borderRadius: "18px",
          mb: "10px",
          boxShadow: "rgba(0, 0, 0, 0.15) 0px 3px 3px 0px;",
        }}
      >
        <CardContent>
          {data ? (
            <Box
              sx={{
                alignItems: "center",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography variant="h3" gutterBottom>
                Title: {data.title}
              </Typography>
              <Typography variant="h3" gutterBottom>
                Task: {data.taskName}
              </Typography>
              <Typography variant="h4" gutterBottom>
                Project: {data.projectName}
              </Typography>
              <Typography variant="h4" gutterBottom>
                Board: {data.boardName}
              </Typography>
              <Typography color="text.secondary" variant="h5" gutterBottom>
                Status: {data.status}
              </Typography>
              <Typography color="text.secondary" variant="h5" gutterBottom>
                Description: {data.description}
              </Typography>
              <Typography color="text.secondary" variant="h5" gutterBottom>
                Attached file:{" "}
                <Button onClick={() => handleDownload(data.file)}>
                  {data.file}
                </Button>
              </Typography>
            </Box>
          ) : (
            <Typography>Loading user data...</Typography>
          )}
        </CardContent>
        {role === "user" || (data && data.status !== "open") ? null : (
          <Box
            sx={{
              alignItems: "center",
              display: "flex",
              flexDirection: "column",
              mb: "10px",
            }}
          >
            <Button
              variant="contained"
              onClick={() => handleResolve(reportId)}
              style={{
                backgroundColor: "#30324e",
                color: "#ffffff",
                marginBottom: "10px",
              }}
            >
              Resolve
            </Button>
            <Button
              variant="contained"
              onClick={() => handleReject(reportId)}
              style={{ backgroundColor: "red", color: "#ffffff" }}
            >
              Reject
            </Button>
          </Box>
        )}
        <Divider />
      </Card>
    </div>
  );
};
