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
  const [errors, setErrors] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
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
  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };

    // Validate Full name
    if (values.fullname.trim() === "") {
      newErrors.fullname = "Full name is required";
      valid = false;
    } else {
      newErrors.fullname = "";
    }

    // Validate Email
    if (!/^\S+@\S+\.\S+$/.test(values.email)) {
      newErrors.email = "Invalid email address";
      valid = false;
    } else {
      newErrors.email = "";
    }

    // Validate Phone
    if (!/^\d{10}$/.test(values.phoneNumber)) {
      newErrors.phoneNumber = "Invalid phone number (10 digits)";
      valid = false;
    } else {
      newErrors.phoneNumber = "";
    }

    setErrors(newErrors);
    return valid;
  };
  const handleChange = (event) => {
    setValues((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      try {
        await axiosClient.put(`/users/${values.id}`, values);
        localStorage.setItem("fullname", values.fullname);
        cogoToast.success("Information update successful !!!", {
          position: "bottom-right",
        });
      } catch (error) {
        cogoToast.error("Information update failed !!!", {
          position: "bottom-right",
        }); // Xử lý lỗi một cách phù hợp
      }
    } else {
      cogoToast.error("Please correct the validation errors", {
        position: "bottom-right",
      });
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
                    error={!!errors.fullname}
                    helperText={errors.fullname}
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
                    error={!!errors.email}
                    helperText={errors.email}
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
                    error={!!errors.phoneNumber}
                    helperText={errors.phoneNumber}
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
