"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";

import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import ItemCard from "@/components/ItemCard";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

interface Bundle {
  id: number;
  title: string;
  subtitle?: string | null;
  image_url?: string | null;
}

export default function BundlesPage() {
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const router = useRouter();

  // Load bundles on mount
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push("/login");
      return;
    }

    api
      .get("/bundles")
      .then((res) => setBundles(res.data))
      .catch(() => router.push("/login"));
  }, [router]);

  const handleAddBundle = () => {
    api
      .post("/bundles", {
        title,
        subtitle,
        image_url: imageUrl || null,
      })
      .then((res) => {
        setBundles((prev) => [...prev, res.data]);
        setOpen(false);
        setTitle("");
        setSubtitle("");
        setImageUrl("");
      })
      .catch((err) => console.error("BUNDLE CREATE ERROR:", err));
  };

  return (
    <Box display="flex" bgcolor="#F5F7FF" minHeight="100vh">
      <Sidebar />

      <Box flex={1} display="flex" flexDirection="column">
        <Topbar />

        <Box component="main" sx={{ px: 4, pb: 4 }}>
          <Box
            sx={{
              bgcolor: "#FFFFFF",
              borderRadius: 4,
              p: 3,
              boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
            }}
          >
            <Box display="flex" justifyContent="space-between" mb={3}>
              <Typography variant="h6" fontWeight={600}>
                Bundles
              </Typography>

              <Button
                variant="contained"
                sx={{ borderRadius: 2, textTransform: "none" }}
                onClick={() => setOpen(true)}
              >
                + Add Bundle
              </Button>
            </Box>

            <Box display="flex" gap={3} flexWrap="wrap">
              {bundles.map((b) => (
                <ItemCard key={b.id} item={b} />
              ))}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Modal */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add New Bundle</DialogTitle>
        <DialogContent sx={{ width: 420 }}>
          <TextField
            label="Bundle Title"
            fullWidth
            required
            sx={{ mb: 2 }}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddBundle}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
