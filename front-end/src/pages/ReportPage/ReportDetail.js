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
const cx = classNames.bind(styles);
export const ReportDetail = () => {
  const [data, setData] = useState(null);
  const { reportId } = useParams();
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
  });

  return (
    <div className={cx("wrapper")}>
      {" "}
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
            </Box>
          ) : (
            <Typography>Loading user data...</Typography>
          )}
        </CardContent>
        <Divider />
      </Card>
      <Card
        sx={{
          border: "1px solid #30324e",
          borderRadius: "18px",
          mb: "10px",
          boxShadow: "rgba(0, 0, 0, 0.15) 0px 3px 3px 0px;",
        }}
      >
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Button>aaa</Button>
          <Button>bbb</Button>
        </Box>
      </Card>
    </div>
  );
};
