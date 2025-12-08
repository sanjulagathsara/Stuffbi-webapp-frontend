// components/Topbar.tsx
"use client";

import { Avatar, Box, IconButton, Typography } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useRouter } from "next/navigation";

export default function Topbar() {
  const router = useRouter();

  function handleLogout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    router.push("/login");
  }

  return (
    <Box
      display="flex"
      justifyContent="flex-end"
      alignItems="center"
      py={2}
      pr={3}
      gap={2}
    >
      <Typography variant="body2">Hello, User</Typography>
      <Avatar sx={{ width: 32, height: 32 }}>U</Avatar>
      <IconButton onClick={handleLogout}>
        <LogoutIcon fontSize="small" />
      </IconButton>
    </Box>
  );
}
