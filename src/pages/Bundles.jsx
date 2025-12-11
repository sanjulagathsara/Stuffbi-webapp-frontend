import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from "@mui/material";

import api from "../api/api";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import ItemCard from "../components/ItemCard";

export default function Bundles() {
  const [bundles, setBundles] = useState([]);
  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");

  useEffect(() => {
    api.get("/bundles").then((res) => setBundles(res.data));
  }, []);

  const addBundle = () => {
    api
      .post("/bundles", { title, subtitle })
      .then((res) => {
        setBundles((prev) => [...prev, res.data]);
        setOpen(false);
        setTitle("");
        setSubtitle("");
      })
      .catch(() => alert("Bundle create failed"));
  };

  return (
    <Box display="flex" minHeight="100vh" bgcolor="#F5F7FF">
      <Sidebar />

      <Box flex={1}>
        <Topbar />

        <Box p={4}>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h5">Bundles</Typography>

            <Button variant="contained" onClick={() => setOpen(true)}>
              + Add Bundle
            </Button>
          </Box>

          <Box display="flex" gap={3} mt={3} flexWrap="wrap">
            {bundles.map((b) => (
              <ItemCard key={b.id} item={b} />
            ))}
          </Box>
        </Box>
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add Bundle</DialogTitle>
        <DialogContent sx={{ width: 350 }}>
          <TextField
            fullWidth
            label="Title"
            sx={{ mb: 2 }}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <TextField
            fullWidth
            label="Subtitle"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={addBundle}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
