import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Pagination,
  CircularProgress,
  Chip,
} from "@mui/material";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import api from "../api/api";

export default function Activity() {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const limit = 10;

  const loadActivity = async (pageNumber = 1) => {
    try {
      setLoading(true);
      const res = await api.get(`/activity?page=${pageNumber}&limit=${limit}`);

      setLogs(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("ACTIVITY FETCH ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivity(page);
  }, [page]);

  const getActionColor = (action) => {
    switch (action) {
      case "create":
        return "success";
      case "update":
        return "warning";
      case "delete":
        return "error";
      default:
        return "default";
    }
  };

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
              boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
            }}
          >
            <Typography variant="h6" fontWeight={600} mb={3}>
              Activity Log
            </Typography>

            {loading ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="200px"
              >
                <CircularProgress />
              </Box>
            ) : logs.length === 0 ? (
              <Typography>No activity found.</Typography>
            ) : (
              <>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Date</strong></TableCell>
                      <TableCell><strong>Action</strong></TableCell>
                      <TableCell><strong>Entity Type</strong></TableCell>
                      <TableCell><strong>Entity Name</strong></TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {logs.map((log) => (
                      <TableRow key={log.id} hover>
                        {/* Date */}
                        <TableCell>
                          {new Date(log.created_at).toLocaleString()}
                        </TableCell>

                        {/* Action with Chip color */}
                        <TableCell>
                          <Chip
                            label={log.action}
                            size="small"
                            color={getActionColor(log.action)}
                            sx={{ textTransform: "capitalize" }}
                          />
                        </TableCell>

                        {/* Entity type */}
                        <TableCell sx={{ textTransform: "capitalize" }}>
                          {log.entity_type}
                        </TableCell>

                        {/* Entity name instead of ID */}
                        <TableCell>
                          {log.entity_name || "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </>
            )}

            <Box display="flex" justifyContent="center" mt={3}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(e, value) => setPage(value)}
                shape="rounded"
                color="primary"
              />
            </Box>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}
