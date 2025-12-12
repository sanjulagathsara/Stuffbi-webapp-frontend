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

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      await signup(email, password);
      navigate("/bundles");
    } catch (err) {
      alert("Signup failed. Error: " + err.message);
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
          Register to StuffBi
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
          sx={{ mb: 2 }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <TextField
          label="Confirm Password"
          fullWidth
          type="password"
          sx={{ mb: 3 }}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <Button fullWidth variant="contained" onClick={handleSubmit}>
          Register 
        </Button>
      </Card>
    </Box>
  );
}
