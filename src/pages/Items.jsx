import { useState, useEffect } from "react";
import {
  Box,
  Card,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  TextField,
  DialogContent,
  DialogActions,
} from "@mui/material";

import api from "../api/api";
import PageWrapper from "../components/PageWrapper";
import ItemCard from "../components/ItemCard";

export default function Items() {
  const [items, setItems] = useState([]);

  // Add Modal
  const [openAdd, setOpenAdd] = useState(false);
  const [name, setName] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  // Edit Modal
  const [openEdit, setOpenEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editSubtitle, setEditSubtitle] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");

  // Load items
  useEffect(() => {
    api.get("/items").then((res) => setItems(res.data));
  }, []);

  // ADD ITEM
  const addItem = () => {
    api
      .post("/items", {
        name,
        subtitle,
        image_url: imageUrl,
      })
      .then((res) => {
        setItems((prev) => [...prev, res.data]);
        setOpenAdd(false);
        setName("");
        setSubtitle("");
        setImageUrl("");
      })
      .catch(() => alert("Item creation failed"));
  };

  // OPEN EDIT MODAL
  const openEditModal = (item) => {
    setEditId(item.id);
    setEditName(item.name);
    setEditSubtitle(item.subtitle || "");
    setEditImageUrl(item.image_url || "");
    setOpenEdit(true);
  };

  // UPDATE ITEM
  const updateItem = () => {
    api
      .put(`/items/${editId}`, {
        name: editName,
        subtitle: editSubtitle,
        image_url: editImageUrl,
      })
      .then((res) => {
        setItems((prev) =>
          prev.map((i) => (i.id === editId ? res.data : i))
        );
        setOpenEdit(false);
      })
      .catch(() => alert("Update failed"));
  };

  return (
    <PageWrapper>
      <Typography
        variant="h5"
        fontWeight={600}
        color="#1E293B"
        mb={2}
        sx={{ ml: 1 }}
      >
        Items
      </Typography>

      <Card
        sx={{
          p: 3,
          borderRadius: 3,
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        }}
      >
        <Box display="flex" justifyContent="flex-end" mb={3}>
          <Button variant="contained" onClick={() => setOpenAdd(true)}>
            + Add Item
          </Button>
        </Box>

        <Box display="flex" gap={3} flexWrap="wrap">
          {items.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onEdit={openEditModal}
            />
          ))}
        </Box>
      </Card>

      {/* ---------------- ADD ITEM MODAL ---------------- */}
      <Dialog open={openAdd} onClose={() => setOpenAdd(false)}>
        <DialogTitle>Add New Item</DialogTitle>
        <DialogContent sx={{ width: 350 }}>
          <TextField
            fullWidth
            label="Name"
            sx={{ mb: 2 }}
            value={name}
            onChange={(e) => setName(e.target.value)}
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
          <Button onClick={() => setOpenAdd(false)}>Cancel</Button>
          <Button variant="contained" onClick={addItem}>
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* ---------------- EDIT ITEM MODAL ---------------- */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
        <DialogTitle>Edit Item</DialogTitle>
        <DialogContent sx={{ width: 350 }}>
          <TextField
            fullWidth
            label="Name"
            sx={{ mb: 2 }}
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
          />

          <TextField
            fullWidth
            label="Subtitle"
            sx={{ mb: 2 }}
            value={editSubtitle}
            onChange={(e) => setEditSubtitle(e.target.value)}
          />

          <TextField
            fullWidth
            label="Image URL"
            value={editImageUrl}
            onChange={(e) => setEditImageUrl(e.target.value)}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
          <Button variant="contained" onClick={updateItem}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </PageWrapper>
  );
}
