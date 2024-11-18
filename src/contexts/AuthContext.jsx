// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

// Create a Context for Authentication
const AuthContext = createContext();

// Create a Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Stores the user information
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Tracks if the user is logged in

  useEffect(() => {
    console.log(user, isAuthenticated);
  }, [user, isAuthenticated]);
  
  useEffect(() => {
    // Check if the user is logged in when the app starts
    axios
      .get("http://localhost:3000/protected", { withCredentials: true })
      .then((response) => {
        setUser(response.data); // Store user data if authenticated
        setIsAuthenticated(true); // Set authentication state
        console.log("User data:", response.data, isAuthenticated);
      })
      .catch((error) => {
        console.log(error, isAuthenticated);
        setUser(null); // Clear user data on failure
        setIsAuthenticated(false); // Set authentication state to false
      });
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, setIsAuthenticated, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
