"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  CircularProgress,
} from "@mui/material";

import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import api from "@/lib/api";

import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

interface Activity {
  id: number;
  user_id: number;
  entity_type: string;
  entity_id: number | null;
  action: string;
  old_value?: any;
  new_value?: any;
  created_at: string;
}

export default function ActivityPage() {
  const [activity, setActivity] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    api
      .get("/activity")
      .then((res) => setActivity(res.data))
      .catch((err) => console.error("ACTIVITY LOAD ERROR:", err))
      .finally(() => setLoading(false));
  }, []);

  const getActionIcon = (action: string) => {
    switch (action) {
      case "create":
        return <AddCircleIcon color="success" />;
      case "update":
        return <EditIcon color="warning" />;
      case "delete":
        return <DeleteIcon color="error" />;
      default:
        return <></>;
    }
  };

  const getEntityLabel = (entity: string) => {
    switch (entity) {
      case "item":
        return "Item";
      case "bundle":
        return "Bundle";
      case "profile":
        return "Profile";
      default:
        return "Unknown";
    }
  };

  if (loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        bgcolor="#F5F7FF"
      >
        <CircularProgress />
      </Box>
    );

  return (
    <Box display="flex" bgcolor="#F5F7FF" minHeight="100vh">
      <Sidebar />

      <Box flex={1} display="flex" flexDirection="column">
        <Topbar />

        <Box component="main" sx={{ px: 4, pb: 4 }}>
          <Card
            sx={{
              p: 3,
              borderRadius: 4,
              boxShadow: "0 8px 24px rgba(15,23,42,0.06)",
            }}
          >
            <Typography variant="h6" fontWeight={600} mb={2}>
              Activity Log
            </Typography>

            <Divider sx={{ mb: 2 }} />

            <List>
              {activity.map((log) => (
                <Box key={log.id}>
                  <ListItem alignItems="flex-start">
                    <ListItemIcon>{getActionIcon(log.action)}</ListItemIcon>

                    <ListItemText
                      primary={
                        <>
                          <strong>{getActionLabel(log.action)}</strong> —{" "}
                          {getEntityLabel(log.entity_type)}
                          {log.entity_id ? ` (#${log.entity_id})` : ""}
                        </>
                      }
                      secondary={
                        <>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(log.created_at).toLocaleString()}
                          </Typography>

                          {log.old_value && (
                            <Typography
                              variant="body2"
                              sx={{
                                background: "#fff3f3",
                                p: 1,
                                mt: 1,
                                borderRadius: 1,
                                fontFamily: "monospace",
                                whiteSpace: "pre-wrap",
                              }}
                            >
                              OLD: {JSON.stringify(log.old_value, null, 2)}
                            </Typography>
                          )}

                          {log.new_value && (
                            <Typography
                              variant="body2"
                              sx={{
                                background: "#f3fff3",
                                p: 1,
                                mt: 1,
                                borderRadius: 1,
                                fontFamily: "monospace",
                                whiteSpace: "pre-wrap",
                              }}
                            >
                              NEW: {JSON.stringify(log.new_value, null, 2)}
                            </Typography>
                          )}
                        </>
                      }
                    />
                  </ListItem>

                  <Divider sx={{ my: 1 }} />
                </Box>
              ))}
            </List>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}

function getActionLabel(action: string) {
  if (action === "create") return "Created";
  if (action === "update") return "Updated";
  if (action === "delete") return "Deleted";
  return action;
}
