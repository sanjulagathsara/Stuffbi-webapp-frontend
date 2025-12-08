// components/Sidebar.tsx
"use client";

import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import Link from "next/link";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import CategoryIcon from "@mui/icons-material/Category";
import HistoryIcon from "@mui/icons-material/History";
import PersonIcon from "@mui/icons-material/Person";
import Image from "next/image";

const navItems = [
  { label: "Bundles", href: "/bundles", icon: <CategoryIcon /> },
  { label: "Items", href: "/items", icon: <Inventory2Icon /> },
  { label: "Activity", href: "/activity", icon: <HistoryIcon /> },
  { label: "Profile", href: "/profile", icon: <PersonIcon /> },
];
export default function Sidebar() {
  return (
    <Box
      sx={{
        width: 230,
        bgcolor: "#FFFFFF",
        borderRight: "1px solid #E3E6F0",
        minHeight: "100vh",
        p: 2,
      }}
    >
      <Box display="flex" alignItems="center" mb={4} ml={4} gap={1}>
        <Image
          src="/logo.png"
          alt="StuffBi Logo"
          width={100}
          height={100}
          style={{ borderRadius: "50%" }}
        />
      </Box>

      <List>
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <ListItemButton sx={{ borderRadius: 2, mb: 1 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </Link>
        ))}
      </List>
    </Box>
  );
}
