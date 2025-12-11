import { Box, Typography, Button } from "@mui/material";
import { useAuth } from "../context/AuthContext";

export default function Topbar() {
  const { logout } = useAuth();

  return (
    <Box
      sx={{
        bgcolor: "white",
        p: 2,
        display: "flex",
        justifyContent: "space-between",
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
      }}
    >
      <Typography variant="h6">StuffBi Dashboard</Typography>

      <Button variant="contained" onClick={logout}>
        Logout
      </Button>
    </Box>
  );
}
