import { useEffect, useState } from "react";
import { Box, Typography, Card, Divider } from "@mui/material";
import api from "../api/api";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function Activity() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    api.get("/activity").then((res) => {
      setLogs(res.data);
    });
  }, []);

  return (
    <Box display="flex" minHeight="100vh" bgcolor="#F5F7FF">
      <Sidebar />

      <Box flex={1}>
        <Topbar />

        <Box p={4}>
          <Typography variant="h5" mb={2}>
            Activity Log
          </Typography>

          {logs.map((log) => (
            <Card key={log.id} sx={{ p: 2, mb: 2 }}>
              <Typography>
                <strong>{log.action.toUpperCase()}</strong> {log.entity_type}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                {log.created_at}
              </Typography>

              <Divider sx={{ my: 1 }} />

              <pre style={{ fontSize: 12 }}>
                {JSON.stringify(log.new_value, null, 2)}
              </pre>
            </Card>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
