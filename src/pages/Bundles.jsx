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

  // EDIT modal state
  const [editOpen, setEditOpen] = useState(false);
  const [editBundle, setEditBundle] = useState(null);

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    api.get("/bundles").then((res) => setBundles(res.data));
  }, []);

  // --------------------------
  // ADD BUNDLE
  // --------------------------
  const addBundle = () => {
    api
      .post("/bundles", { title, subtitle, image_url: imageUrl })
      .then((res) => {
        setBundles((prev) => [...prev, res.data]);
        setOpen(false);
        setTitle("");
        setSubtitle("");
        setImageUrl("");
      })
      .catch(() => alert("Bundle create failed"));
  };

  // --------------------------
  // OPEN EDIT MODAL
  // --------------------------
  const openEditModal = (bundle) => {
    setEditBundle(bundle);
    setTitle(bundle.title);
    setSubtitle(bundle.subtitle);
    setImageUrl(bundle.image_url || "");
    setEditOpen(true);
  };

  // --------------------------
  // SAVE EDIT
  // --------------------------
  const saveEdit = () => {
    api
      .put(`/bundles/${editBundle.id}`, {
        title,
        subtitle,
        image_url: imageUrl,
      })
      .then((res) => {
        setBundles((prev) =>
          prev.map((b) => (b.id === res.data.id ? res.data : b))
        );

        setEditOpen(false);
        setTitle("");
        setSubtitle("");
        setImageUrl("");
      })
      .catch(() => alert("Failed to update bundle"));
  };

  return (
    <Box display="flex" minHeight="100vh" bgcolor="#F5F7FF">
      <Sidebar />

      <Box flex={1}>
        <Topbar />

        <Box p={4}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" fontWeight={600}>
              Bundles
            </Typography>

            <Button variant="contained" onClick={() => setOpen(true)}>
              + Add Bundle
            </Button>
          </Box>

          <Box display="flex" gap={3} mt={3} flexWrap="wrap">
            {bundles.map((b) => (
              <ItemCard
                key={b.id}
                item={{
                  id: b.id,
                  name: b.title,
                  subtitle: b.subtitle,
                  image_url: b.image_url,
                }}
                onEdit={() => openEditModal(b)}
              />
            ))}
          </Box>
        </Box>
      </Box>

      {/* ---------------------- ADD MODAL ---------------------- */}
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
            sx={{ mb: 2 }}
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
          />

          <TextField
            fullWidth
            label="Image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={addBundle}>
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* ---------------------- EDIT MODAL ---------------------- */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>Edit Bundle</DialogTitle>
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
            sx={{ mb: 2 }}
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
          />

          <TextField
            fullWidth
            label="Image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={saveEdit}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
