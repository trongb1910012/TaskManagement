import { useEffect, useState } from "react";

import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Unstable_Grid2 as Grid,
} from "@mui/material";
import axiosClient from "../../api/api";
import classNames from "classnames/bind";
import styles from "./ProfilePage.scss";
import cogoToast from "cogo-toast";
const cx = classNames.bind(styles);
export const ChangePassword = () => {
  const [formData, setFormData] = useState({
    userId: "",
    currentPassword: "",
    newPassword: "",
  });
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axiosClient.get(`/users/userinfo?token=${token}`);
      setFormData({
        userId: response.data.userinfo._id,
        currentPassword: "",
        newPassword: "",
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  const handleChange = (event) => {
    setFormData((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(formData);
    try {
      await axiosClient.put(`/auth/${formData.userId}/password`, formData);

      cogoToast.success("Password changed successfully !!!");
      setFormData({
        userId: formData.userId,
        currentPassword: "",
        newPassword: "",
      });
    } catch (error) {
      cogoToast.error("Mật khẩu hiện tại không hợp lệ "); // Xử lý lỗi một cách phù hợp
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card sx={{ border: "1px solid #30324e", borderRadius: "18px" }}>
        <CardHeader
          subheader="The information can be edited"
          title="Change Password"
        />
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: 2 }}>
            <Grid container spacing={3}>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  type="password"
                  label="Current password"
                  name="currentPassword"
                  onChange={handleChange}
                  required
                  value={formData.currentPassword}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  type="password"
                  label="New Password"
                  name="newPassword"
                  onChange={handleChange}
                  required
                  value={formData.newPassword}
                />
              </Grid>
            </Grid>
          </Box>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: "center" }}>
          <button className={cx("submit-button")} type="submit">
            Save
          </button>
        </CardActions>
      </Card>
    </form>
  );
};
