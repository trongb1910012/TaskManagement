import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Card, CardContent, Divider, Typography } from "@mui/material";
import axiosClient from "../../api/api";
export const ProjectInfo = () => {
  const [projectData, setProjectData] = useState(null);
  const { id } = useParams();
  const fetchData = async () => {
    try {
      const response = await axiosClient.get(`/projects/projectInfo?id=${id}`);
      setProjectData(response.data.projects);
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
        {projectData ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              textAlign: "left",
            }}
          >
            <Typography variant="h3" gutterBottom>
              Project: {projectData.title}
            </Typography>
            <Typography variant="h4" gutterBottom>
              Project Manager: {projectData.owner.fullname}
            </Typography>
            <Typography color="text.secondary" variant="h5" gutterBottom>
              Description: {projectData.description}
            </Typography>
            <Typography variant="h5" gutterBottom>
              Start: {projectData.startDate}
            </Typography>
            <Typography variant="h5" gutterBottom>
              End: {projectData.endDate}
            </Typography>
            <Typography variant="h5" gutterBottom>
              Status: {projectData.status}
            </Typography>
          </Box>
        ) : (
          <Typography>Loading user data...</Typography>
        )}
      </CardContent>
      <Divider />
    </Card>
  );
};
