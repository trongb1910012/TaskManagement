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
export const AccountProfileDetails = () => {
  const [userData, setUserData] = useState(null);
  const [values, setValues] = useState({
    id: "",
    username: "",
    fullname: "",
    email: "",
    role: "",
    phoneNumber: "",
    birthDay: "",
  });

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axiosClient.get(`/users/userinfo?token=${token}`);
      setUserData(response.data.userinfo);
      setValues({
        id: response.data.userinfo._id,
        username: response.data.userinfo.username,
        fullname: response.data.userinfo.fullname,
        email: response.data.userinfo.email,
        role: response.data.userinfo.role,
        phoneNumber: response.data.userinfo.phoneNumber,
        birthDay: response.data.userinfo.birthdate,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  const handleChange = (event) => {
    setValues((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axiosClient.put(`/users/${values.id}`, values);
      console.log(response);
      localStorage.setItem("fullname", values.fullname);
      cogoToast.success("Information update successful !!!");
    } catch (error) {
      cogoToast.error("Information update failed !!!"); // Xử lý lỗi một cách phù hợp
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card sx={{ border: "1px solid #30324e", borderRadius: "18px" }}>
        <CardHeader subheader="The information can be edited" title="Profile" />
        <CardContent sx={{ pt: 0 }}>
          {userData ? (
            <Box sx={{ m: 2 }}>
              <Grid container spacing={3}>
                <Grid xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Full name"
                    name="fullname"
                    onChange={handleChange}
                    required
                    value={values.fullname}
                  />
                </Grid>
                <Grid xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="User name"
                    name="username"
                    onChange={handleChange}
                    required
                    value={values.username}
                  />
                </Grid>
                <Grid xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    name="email"
                    onChange={handleChange}
                    required
                    value={values.email}
                  />
                </Grid>
                <Grid xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Role"
                    name="role"
                    InputProps={{
                      readOnly: true,
                    }}
                    onChange={handleChange}
                    required
                    value={values.role}
                  />
                </Grid>
                <Grid xs={12} md={6}>
                  <TextField
                    type="date"
                    fullWidth
                    label="Birth"
                    name="birthDay"
                    onChange={handleChange}
                    required
                    value={values.birthDay}
                  />
                </Grid>
                <Grid xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Phone"
                    name="phoneNumber"
                    onChange={handleChange}
                    required
                    value={values.phoneNumber}
                  />
                </Grid>
              </Grid>
            </Box>
          ) : (
            <Box>Loading user data...</Box>
          )}
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
