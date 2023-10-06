import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Card, CardContent, Divider, Typography } from "@mui/material";
import axiosClient from "../../api/api";
export const TaskInfo = () => {
  const [taskData, setTaskData] = useState(null);
  const { id } = useParams();
  const fetchData = async () => {
    try {
      const response = await axiosClient.get(`/tasks/taskinfo?id=${id}`);
      setTaskData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  });

  return (
    <Card
      sx={{
        border: "1px solid #30324e",
        borderRadius: "18px",
        mb: "10px",
      }}
    >
      <CardContent>
        {taskData ? (
          <Box
            sx={{
              alignItems: "left",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h3" gutterBottom>
              Task: {taskData.task.title}
            </Typography>
            <Typography variant="h4" gutterBottom>
              Project: {taskData.projectName}
            </Typography>
            <Typography variant="h4" gutterBottom>
              Board: {taskData.boardName}
            </Typography>

            <Typography color="text.secondary" variant="h5" gutterBottom>
              Description: {taskData.task.description}
            </Typography>
            <p>
              Member:{" "}
              {taskData.task.members.map((mb) => (
                <p>
                  {"-"}
                  {mb.fullname}
                </p>
              ))}
            </p>
          </Box>
        ) : (
          <Typography>Loading user data...</Typography>
        )}
      </CardContent>
      <Divider />
    </Card>
  );
};
