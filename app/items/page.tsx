"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
} from "@mui/material";

import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import ItemCard from "@/components/ItemCard";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

interface Item {
  id: number;
  name: string;
  subtitle?: string | null;
  image_url?: string | null;
  bundle_id?: number | null;
}

interface Bundle {
  id: number;
  title: string;
}

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [bundles, setBundles] = useState<Bundle[]>([]);

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [bundleId, setBundleId] = useState<number | null>(null);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return router.push("/login");

    api.get("/items").then((res) => setItems(res.data));
    api.get("/bundles").then((res) => setBundles(res.data));
  }, [router]);

  const handleAddItem = () => {
    api
      .post("/items", {
        name,
        subtitle,
        image_url: imageUrl || null,
        bundle_id: bundleId,
      })
      .then((res) => {
        setItems((prev) => [...prev, res.data]);
        setOpen(false);
        setName("");
        setSubtitle("");
        setImageUrl("");
        setBundleId(null);
      })
      .catch((err) => console.error("ITEM CREATE ERROR:", err));
  };

  return (
    <Box display="flex" bgcolor="#F5F7FF" minHeight="100vh">
      <Sidebar />

      <Box flex={1} display="flex" flexDirection="column">
        <Topbar />

        <Box component="main" sx={{ px: 4, pb: 4 }}>
          <Box
            sx={{
              bgcolor: "#FFF",
              borderRadius: 4,
              p: 3,
              boxShadow: "0 8px 24px rgba(15,23,42,0.06)",
            }}
          >
            <Box display="flex" justifyContent="space-between" mb={3}>
              <Typography variant="h6">Items</Typography>

              <Button
                variant="contained"
                sx={{ borderRadius: 2 }}
                onClick={() => setOpen(true)}
              >
                + Add Item
              </Button>
            </Box>

            <Box display="flex" gap={3} flexWrap="wrap">
              {items.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Modal */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add Item</DialogTitle>
        <DialogContent sx={{ width: 420 }}>
          <TextField
            label="Item Name"
            fullWidth
            required
            sx={{ mb: 2 }}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <TextField
            label="Subtitle"
            fullWidth
            sx={{ mb: 2 }}
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
          />

          <TextField
            label="Image URL"
            fullWidth
            sx={{ mb: 2 }}
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />

          <TextField
            select
            label="Select Bundle"
            fullWidth
            value={bundleId || ""}
            onChange={(e) => setBundleId(Number(e.target.value))}
          >
            {bundles.map((b) => (
              <MenuItem key={b.id} value={b.id}>
                {b.title}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddItem}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
