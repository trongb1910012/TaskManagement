import * as React from "react";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Paper } from "@mui/material";
import cogoToast from "cogo-toast";
import "./signup.css";
const paperStyle = {
  padding: 20,
  height: "600px",
  width: 700,
  margin: "50px auto",
};
const backgroundColor = {
  backgroundColor: "#a2b9bc",
  padding: "3px",
};
function SignUp() {
  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    const formData = {
      username: form.username.value,
      fullname: form.fullname.value,
      email: form.email.value,
      password: form.password.value,
    };

    try {
      const response = await fetch("http://localhost:8080/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // User signup successful
        cogoToast.success("Đăng ký thành công !!!");
        // Add any additional logic or redirect the user to another page
      } else {
        // Error occurred during signup
        cogoToast.error("Failed to sign up the user");
        // Handle the error or display an error message to the user
      }
    } catch (error) {
      console.log("An error occurred:", error);
    }
  };
  return (
    <div style={backgroundColor}>
      <Paper elevation={10} style={paperStyle}>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "#878f99" }}>
            <LockOutlinedIcon />
          </Avatar>
          <h2 className="signup-title">TASK MANAGEMENT</h2>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="username"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="fullname"
                  label="Full name"
                  name="fullname"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
            </Grid>
            <Grid container justifyContent="center">
              <Grid item>
                <button className="signup-btn">Sign Up</button>
              </Grid>
            </Grid>

            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/tasking" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Paper>
    </div>
  );
}

export default SignUp;
