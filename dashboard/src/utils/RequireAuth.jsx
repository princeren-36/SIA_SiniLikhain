import React from "react";
import { Navigate, useLocation } from "react-router-dom";

// Example: get token from localStorage (customize as needed)
function isAuthenticated() {
  return !!localStorage.getItem("token");
}

export default function RequireAuth({ children }) {
  const location = useLocation();
  if (!isAuthenticated()) {
    // Redirect to login, preserving the current location
    return <Navigate to="/Login" state={{ from: location }} replace />;
  }
  return children;
}
