import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import { Link, useLocation } from "react-router-dom";

import WidgetsIcon from "@mui/icons-material/Widgets";
import InventoryIcon from "@mui/icons-material/Inventory";
import HistoryIcon from "@mui/icons-material/History";
import PersonIcon from "@mui/icons-material/Person";

export default function Sidebar() {
  const location = useLocation();

  const menu = [
    { label: "Bundles", path: "/bundles", icon: <WidgetsIcon /> },
    { label: "Items", path: "/items", icon: <InventoryIcon /> },
    { label: "Activity", path: "/activity", icon: <HistoryIcon /> },
    { label: "Profile", path: "/profile", icon: <PersonIcon /> },
  ];

  return (
    <Box
      sx={{
        width: 200,
        bgcolor: "white",
        borderRight: "1px solid #E2E8F0",
        p: 2,
        minHeight: "100vh",
      }}
    >
      {/* Logo Section */}
      <Box display="flex" alignItems="center" gap={1} p={2}>
        <img src="/logo.png" alt="logo" style={{ width: 150}} />
      </Box>

      {/* Navigation */}
      <List sx={{ mt: 2 }}>
        {menu.map((item) => {
          const active = location.pathname === item.path;

          return (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                component={Link}
                to={item.path}
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  bgcolor: active ? "#EFF6FF" : "transparent",
                }}
              >
                <ListItemIcon
                  sx={{
                    color: active ? "#2563EB" : "#94A3B8",
                    minWidth: 36,
                  }}
                >
                  {item.icon}
                </ListItemIcon>

                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: 14,
                    color: active ? "#2563EB" : "#64748B",
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
}
