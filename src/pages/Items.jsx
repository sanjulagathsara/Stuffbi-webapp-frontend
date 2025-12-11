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
  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");
  const [subtitle, setSubtitle] = useState("");

  useEffect(() => {
    api.get("/items").then((res) => setItems(res.data));
  }, []);

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
          <Button variant="contained" onClick={() => setOpen(true)}>
            + Add Item
          </Button>
        </Box>

        <Box display="flex" gap={3} flexWrap="wrap">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </Box>
      </Card>

      {/* Add Modal */}
      <Dialog open={open} onClose={() => setOpen(false)}>
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
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained">Add</Button>
        </DialogActions>
      </Dialog>
    </PageWrapper>
  );
}
