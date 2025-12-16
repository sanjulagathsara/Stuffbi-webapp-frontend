import { useEffect, useState } from "react";
import { Card, CardContent, Typography, Box, Chip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { getItemImageViewUrl } from "../api/api";

export default function ItemCard({ item, onEdit }) {
  const [imgSrc, setImgSrc] = useState("");

  useEffect(() => {
    let alive = true;

    async function load() {
      if (!item.image_url) return;
      try {
        const { viewUrl } = await getItemImageViewUrl(item.id);
        if (alive) setImgSrc(viewUrl);
      } catch {
        if (alive) setImgSrc(""); // keep empty if fails
      }
    }

    load();
    return () => { alive = false; };
  }, [item.id, item.image_url]);

  return (
    <Card sx={{ width: 200, borderRadius: 3, cursor: "pointer", position: "relative", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
      {onEdit && (
        <Box
          onClick={(e) => { e.stopPropagation(); onEdit(item); }}
          sx={{ position: "absolute", top: 8, right: 8, background: "white", borderRadius: "50%", p: "4px", boxShadow: "0 2px 6px rgba(0,0,0,0.15)", zIndex: 10 }}
        >
          <EditIcon fontSize="small" />
        </Box>
      )}

      {imgSrc && (
        <Box
          component="img"
          src={imgSrc}
          alt={item.name}
          sx={{ width: "100%", height: 120, objectFit: "fill", borderTopLeftRadius: 12, borderTopRightRadius: 12, background: "#fafafa"}}
        />
      )}

      <CardContent>
        <Typography variant="subtitle1" fontWeight={600}>{item.name}</Typography>
        {item.subtitle && <Typography variant="body2" color="text.secondary">{item.subtitle}</Typography>}
        {item.bundle_title && (
          <Box mt={1}>
            <Chip label={item.bundle_title} size="small" color="primary" variant="outlined" sx={{ fontSize: "0.75rem" }} />
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
