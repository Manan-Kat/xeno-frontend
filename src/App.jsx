import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Import React Router
import LoginPage from "./components/LoginPage";
import Home from "./components/Home";
import { AuthProvider } from "./contexts/AuthContext";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />{" "}
          {/* Login page as the home page */}
          <Route path="/home" element={<Home />} />{" "}
          {/* Protected Route for Home */}
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
