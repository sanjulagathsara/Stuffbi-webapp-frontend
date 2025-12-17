// src/pages/Login.jsx
// Page to handle user login


import { useState } from "react";
import {
  Box,
  Card,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    try {
      await login(email, password);
      navigate("/bundles");
    } catch (err) {
      alert("Login failed. Error: " + err.message);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#F5F7FF"
    >
      <Card
        sx={{
          p: 4,
          width: 400,
          borderRadius: 3,
          textAlign: "center",
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
        }}
      >
        <img
          src="/logo.png"
          alt="StuffBi Logo"
          style={{
            width: 180,
            margin: "0 auto 20px",
            display: "block",
          }}
        />

        <Typography variant="h5" fontWeight={600} mb={3}>
          Welcome!
        </Typography>

        <TextField
          label="Email Address"
          fullWidth
          sx={{ mb: 2 }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          label="Password"
          fullWidth
          type="password"
          sx={{ mb: 3 }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button fullWidth variant="contained" onClick={handleSubmit}>
          Login
        </Button>
          <div style={{ marginTop: 16 }}></div>
              <Typography variant="caption" >
        Don't have an account? <a href="/signup">Create one</a>
      </Typography>
      </Card>
    </Box>
  );
}
