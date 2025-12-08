// app/items/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import ItemCard from "@/components/ItemCard";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

interface Item {
  id: string | number;
  name: string;
  subtitle?: string;
}

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push("/login");
      return;
    }

    api
      .get("/items")
      .then((res) => setItems(res.data))
      .catch((err) => {
        console.error(err);
        // if 401 – token invalid
        router.push("/login");
      });
  }, [router]);

  return (
    <Box display="flex" bgcolor="#F5F7FF" minHeight="100vh">
      <Sidebar />

      <Box flex={1} display="flex" flexDirection="column">
        <Topbar />

        <Box
          component="main"
          sx={{
            px: 4,
            pb: 4,
          }}
        >
          <Box
            sx={{
              bgcolor: "#FFFFFF",
              borderRadius: 4,
              p: 3,
              boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
            }}
          >
            <Typography variant="h6" fontWeight={600} mb={3}>
              Items
            </Typography>

            <Box display="flex" gap={3} flexWrap="wrap">
              {items.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
