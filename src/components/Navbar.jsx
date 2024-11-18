// src/components/Navbar.js
import React, { useContext } from "react";
import { Button, AppBar, Toolbar, Typography, Container } from "@mui/material";
import AuthContext from "../contexts/AuthContext";

const Navbar = ({ onLogout }) => {
  const { user } = useContext(AuthContext);

  const shortenedUserId = user ? `${user.userId.substring(0, 4)}....` : "Guest";

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          CRM APP
        </Typography>
        <Typography variant="body1" sx={{ marginRight: 2 }}>
          USER: {shortenedUserId}
        </Typography>
        <Button color="inherit" onClick={onLogout}>Logout</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
