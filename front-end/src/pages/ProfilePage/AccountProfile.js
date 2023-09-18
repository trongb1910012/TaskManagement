import { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Divider,
  Typography,
} from "@mui/material";
import axiosClient from "../../api/api";
export const AccountProfile = () => {
  const [userData, setUserData] = useState(null);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axiosClient.get(`/users/userinfo?token=${token}`);
      setUserData(response.data.userinfo);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Card>
      <CardContent>
        {userData ? (
          <Box
            sx={{
              alignItems: "center",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Avatar
              alt={localStorage.getItem("fullname")}
              src="/static/images/avatar.jpg"
              sx={{
                height: 80,
                mb: 2,
                width: 80,
              }}
            />
            <Typography gutterBottom variant="h5">
              {userData.fullname}
            </Typography>
            <Typography color="text.secondary" variant="h6">
              {userData.role}
            </Typography>
            <Typography color="text.secondary" variant="h6">
              {userData._id}
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
