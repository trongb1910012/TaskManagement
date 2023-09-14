import React from "react";
import {
  Grid,
  Paper,
  Avatar,
  TextField,
  Typography,
  Link,
} from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { useState } from "react";
import axiosClient from "../../api/api";
import { useNavigate } from "react-router-dom";
import cogoToast from "cogo-toast";
import "./login.css";
const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const paperStyle = {
    padding: 20,
    height: "400px",
    width: 400,
    margin: "150px auto",
  };
  const backgroundColor = {
    backgroundColor: "#a2b9bc",
    padding: "3px",
  };
  const avatarStyle = { backgroundColor: "#30324e" };
  const headingStyle = {
    fontFamily: "Arial, sans-serif",
    padding: "20px",
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
      const fullname = response.data.fullname;
      localStorage.setItem("token", token);
      localStorage.setItem("fullname", fullname);
      navigate("/tasking/home");
    } catch (error) {
      cogoToast.error("Incorrect username or password!!");
    }
  };
  return (
    <div style={backgroundColor}>
      <Grid>
        <Paper elevation={10} style={paperStyle}>
          <Grid align="center">
            <Avatar style={avatarStyle}>
              <LockOutlinedIcon />
            </Avatar>
            <h2 style={headingStyle}>TASK MANAGEMENT</h2>
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
          <Grid container justifyContent="center">
            <Grid item>
              {/* <Button
                onClick={handleLogin}
                color="primary"
                variant="contained"
                style={btnstyle}
                fullWidth
              >
                Sign in
              </Button> */}
              <button
                onClick={handleLogin}
                color="primary"
                variant="contained"
                className="login-btn"
                fullWidth
              >
                Sign in
              </button>
            </Grid>
          </Grid>
          <Typography>
            <Link href="#">Forgot password ?</Link>
          </Typography>
          <Typography>
            {" "}
            Do you have an account ?<Link href="/tasking/signup">Sign Up</Link>
          </Typography>
        </Paper>
      </Grid>
    </div>
  );
};

export default Login;
