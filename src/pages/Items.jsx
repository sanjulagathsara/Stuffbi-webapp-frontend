// src/pages/Items.jsx
// Page to display and manage items

import { useState, useEffect } from "react";
import {
  Box,
  Card,
  Typography,
  Button,
} from "@mui/material";

import api from "../api/api";
import PageWrapper from "../components/PageWrapper";
import ItemCard from "../components/ItemCard";
import ItemModal from "../components/ItemModal";

export default function Items() {
  const [items, setItems] = useState([]);

  // Add Modal
  const [openAdd, setOpenAdd] = useState(false);

  // Edit Modal
  const [openEdit, setOpenEdit] = useState(false);
  const [editItem, setEditItem] = useState(null);

  // Load items
  useEffect(() => {
    api.get("/items").then((res) => setItems(res.data));
  }, []);

  // ADD ITEM
  const addItem = ({ name, subtitle, imageUrl, bundleId }) => {
    api
      .post("/items", {
        name,
        subtitle,
        image_url: imageUrl,
        bundle_id: bundleId,
      })
      .then((res) => {
        setItems((prev) => [...prev, res.data]);
        setOpenAdd(false);
      })
      .catch(() => alert("Item creation failed"));
  };

  // DELETE ITEM
  const deleteItem = (itemId) => {
    api
      .delete(`/items/${itemId}`)
      .then(() => {
        setItems((prev) => prev.filter((i) => i.id !== itemId));
      })
      .catch(() => alert("Failed to delete item"));
  };

  // OPEN EDIT MODAL
  const openEditModal = (item) => {
    setEditItem(item);
    setOpenEdit(true);
  };

  // UPDATE ITEM
  const updateItem = ({ name, subtitle, imageUrl, bundleId }) => {
    api
      .put(`/items/${editItem.id}`, {
        name,
        subtitle,
        image_url: imageUrl,
        bundle_id: bundleId,
      })
      .then((res) => {
        setItems((prev) =>
          prev.map((i) => (i.id === editItem.id ? res.data : i))
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
              onDelete={() => deleteItem(item.id)}
            />
          ))}
        </Box>
      </Card>

      {/* ---------------------- ADD / EDIT MODALS ---------------------- */}
      <ItemModal
        open={openAdd}
        mode="add"
        onClose={() => setOpenAdd(false)}
        onSubmit={addItem}
      />

      <ItemModal
        open={openEdit}
        mode="edit"
        initialItem={editItem}
        onClose={() => setOpenEdit(false)}
        onSubmit={updateItem}
        onDelete={deleteItem}
      />
    </PageWrapper>
  );
}
