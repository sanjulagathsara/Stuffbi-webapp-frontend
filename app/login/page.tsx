// app/login/page.tsx
"use client";

import {
  Box,
  Button,
  Card,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Link as MuiLink,
  Divider,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import GoogleIcon from "@mui/icons-material/Google";
import AppleIcon from "@mui/icons-material/Apple";
import FacebookIcon from "@mui/icons-material/Facebook";
import { useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("accessToken", res.data.accessToken);
      // optional: store user info too
      localStorage.setItem("user", JSON.stringify(res.data.user));
      router.push("/items");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Login failed");
    }
  }

  return (
    <Box
      minHeight="100vh"
      bgcolor="#F5F7FF"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Card
        sx={{
          maxWidth: 900,
          width: "90%",
          p: 4,
          borderRadius: 4,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: 420,
            textAlign: "center",
          }}
        >
          {/* Illustration placeholder */}
          <Box
            sx={{
              width: 160,
              height: 160,
              borderRadius: 3,
              bgcolor: "#E5EEFF",
              mx: "auto",
              mb: 2,
            }}
          >
            <img src="/logo.png" alt="Logo" width={160} height={160} />
          </Box>

          <Typography variant="h5" fontWeight={600} mb={1}>
            Welcome!
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              sx={{ mt: 3, mb: 2 }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((v) => !v)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {error && (
              <Typography color="error" mt={1} fontSize={14}>
                {error}
              </Typography>
            )}

            <Box
              display="flex"
              justifyContent="space-between"
              mt={1}
              mb={2}
              fontSize={14}
            >
              <MuiLink href="#" underline="hover">
                Forgot password?
              </MuiLink>
              <MuiLink href="#" underline="hover">
                Continue as Guest
              </MuiLink>
            </Box>

            <Button
              fullWidth
              variant="contained"
              type="submit"
              sx={{ py: 1.2, mt: 1 }}
            >
              Login
            </Button>

            <Typography mt={1.5} fontSize={14}>
              Not a member?{" "}
              <MuiLink href="#" underline="hover">
                Register now
              </MuiLink>
            </Typography>
          </form>

          <Divider sx={{ my: 3 }}>Or continue with</Divider>

          <Box display="flex" justifyContent="center" gap={2}>
            <IconButton sx={{ bgcolor: "#F5F5F5" }}>
              <GoogleIcon />
            </IconButton>
            <IconButton sx={{ bgcolor: "#F5F5F5" }}>
              <AppleIcon />
            </IconButton>
            <IconButton sx={{ bgcolor: "#F5F5F5" }}>
              <FacebookIcon />
            </IconButton>
          </Box>
        </Box>
      </Card>
    </Box>
  );
}
