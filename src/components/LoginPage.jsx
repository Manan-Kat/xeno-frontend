import React, { useState, useEffect, useContext } from "react";
import { Button, Box, Paper, Typography } from "@mui/material";
import AuthContext from "../contexts/AuthContext";
AuthContext

const LoginPage = () => {
  const { user, isAuthenticated, setIsAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    console.log(user);
  }, [isAuthenticated, user]);

  const handleLogin = () => {
    // Redirect to the Google OAuth route in your backend
    window.location.href = "http://localhost:3000/auth/google"; // Redirect to backend Google login route
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh" // Centers the content vertically
      bgcolor="background.default" // Optional: Set the background color of the page
    >
      <Paper
        elevation={3}
        style={{
          padding: "20px",
          width: 1500,
          height: 500,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h3" gutterBottom>
          {`<--`} CRM APP {`-->`}
        </Typography>
        <br />
        <br />
        <Typography variant="h4" gutterBottom>
          Hi! You are not logged in yet!
        </Typography>
        <br />
        <br />
        <Typography variant="h5" gutterBottom>
          Login with Google:
        </Typography>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleLogin} // Trigger login on button click
          style={{ padding: "10px", width: 500 }}
        >
          Login with Google
        </Button>
      </Paper>
    </Box>
  );
};

export default LoginPage;
