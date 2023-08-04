import React from "react";
import {
  Grid,
  Paper,
  Avatar,
  TextField,
  Button,
  Typography,
  Link,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { useState } from "react";
import axiosClient from "../../api/api";
const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const paperStyle = {
    padding: 20,
    height: "70vh",
    width: 500,
    margin: "20px auto",
  };
  const avatarStyle = { backgroundColor: "#1bbd7e" };
  const btnstyle = { margin: "8px 0" };
  const headingStyle = {
    fontFamily: "Arial, sans-serif",
  };
  // Hàm xử lý đăng nhập
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosClient.post("/auth/signin ", {
        username,
        password,
      });
      const token = response.data.accessToken;
      localStorage.setItem("token", token);
      alert("đăng nhập thành công");
      // Lưu thông tin đăng nhập vào localStorage hoặc Redux nếu cần thiết
    } catch (error) {
      alert("Đăng nhập thất bại", error);
    }
  };
  return (
    <>
      <Grid>
        <h1 style={headingStyle}>TASKING</h1>
      </Grid>
      <Grid>
        <Paper elevation={10} style={paperStyle}>
          <Grid align="center">
            <Avatar style={avatarStyle}>
              <LockOutlinedIcon />
            </Avatar>
            <h2 style={headingStyle}>Sign In</h2>
          </Grid>
          <TextField
            style={{ marginBottom: "16px" }}
            label="Username"
            placeholder="Enter username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            required
          />
          <TextField
            style={{ marginBottom: "16px" }}
            label="Password"
            placeholder="Enter password"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
          />
          <FormControlLabel
            control={<Checkbox name="checkedB" color="primary" />}
            label="Remember me"
          />
          <Button
            onClick={handleLogin}
            color="primary"
            variant="contained"
            style={btnstyle}
            fullWidth
          >
            Sign in
          </Button>
          <Typography>
            <Link href="#">Forgot password ?</Link>
          </Typography>
          <Typography>
            {" "}
            Do you have an account ?<Link href="#">Sign Up</Link>
          </Typography>
        </Paper>
      </Grid>
    </>
  );
};

export default Login;
