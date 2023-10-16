import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Card, CardContent, Divider, Typography } from "@mui/material";
import axiosClient from "../../api/api";
import { DataGrid } from "@mui/x-data-grid";
import { makeStyles } from "@mui/styles";
import Grid from "@mui/material/Grid";
const useStyles = makeStyles((theme) => ({
  dataGridContainer: {
    width: "100%",
    overflowX: "auto",
  },
  gridCell: {
    fontSize: "50px",
  },
}));
export const ProjectInfo = () => {
  const [projectData, setProjectData] = useState(null);
  const [projectMembers, setProjectMembers] = useState(null);
  const { id } = useParams();
  const classes = useStyles();
  const fetchData = async () => {
    try {
      const response = await axiosClient.get(`/projects/projectInfo?id=${id}`);
      const response1 = await axiosClient.get(`/projects/members/${id}`);
      setProjectData(response.data.projects);
      setProjectMembers(response1.data.members);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchData();
  });

  return (
    <>
      <Card
        sx={{
          border: "1px solid #30324e",
          borderRadius: "18px",
          mb: "10px",
          boxShadow: "rgba(0, 0, 0, 0.15) 0px 3px 3px 0px;",
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
      {projectMembers ? (
        <>
          <Typography variant="h5" gutterBottom>
            Members:
          </Typography>
          <div className={classes.dataGridContainer}>
            <Grid container>
              <Grid item xs={11} md={11} xl={11}>
                <DataGrid
                  columns={[
                    { field: "fullname", headerName: "Full Name", flex: 1 },
                    { field: "taskCount", headerName: "Task Count", flex: 1 },
                  ]}
                  rows={projectMembers.map((mb) => ({
                    id: mb.member,
                    fullname: mb.fullname,
                    taskCount: mb.taskCount,
                  }))}
                  disableColumnMenu
                  disableSelectionOnClick
                  hideFooter
                />
              </Grid>
            </Grid>
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
};
