import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Login from "./pages/Login";
import Bundles from "./pages/Bundles";
import Items from "./pages/Items";
import Profile from "./pages/Profile";
import Activity from "./pages/Activity";
import Signup from "./pages/Signup.jsx";

// ---------------------------
// Protected Route Wrapper
// ---------------------------
function PrivateRoute({ children }) {
  const { user } = useAuth();
  const token = localStorage.getItem("accessToken");

  if (!user || !token) {
    return <Navigate to="/" replace />;
  }
  return children;
}

// ---------------------------
// App Routes
// ---------------------------
export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected Routes */}


      <Route
        path="/bundles"
        element={
          <PrivateRoute>
            <Bundles />
          </PrivateRoute>
        }
      />

      <Route
        path="/items"
        element={
          <PrivateRoute>
            <Items />
          </PrivateRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />

      {/* Admin: view another user's profile */}
      <Route
        path="/profile/:id"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />

      <Route
        path="/activity"
        element={
          <PrivateRoute>
            <Activity />
          </PrivateRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
