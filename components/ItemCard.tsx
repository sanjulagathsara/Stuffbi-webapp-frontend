// components/ItemCard.tsx
"use client";

import { Card, CardContent, Typography, Box } from "@mui/material";

interface ItemCardProps {
  item: {
    id: string | number;
    name: string;
    subtitle?: string;
  };
}

export default function ItemCard({ item }: ItemCardProps) {
  return (
    <Card
      sx={{
        width: 180,
        borderRadius: 3,
        p: 1.5,
        boxShadow: "0 4px 10px rgba(15, 23, 42, 0.06)",
      }}
    >
      <Box
        sx={{
          height: 100,
          borderRadius: 2,
          bgcolor: "#EEF2FF",
          mb: 1.5,
        }}
      />
      <CardContent sx={{ p: 0 }}>
        <Typography fontWeight={600}>{item.name}</Typography>
        <Typography variant="body2" color="text.secondary">
          {item.subtitle || "Subtitle"}
        </Typography>
      </CardContent>
    </Card>
  );
}
