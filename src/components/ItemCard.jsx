// src/components/ItemCard.jsx
// Card component to display item information with image and edit option

import { useEffect, useState } from "react";
import { Card, CardContent, Typography, Box, Chip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { getItemImageViewUrl } from "../api/api";
import { getCachedSignedUrl, setCachedSignedUrl } from "../utils/signedUrlCache";

const VIEW_URL_TTL_MS = 60 * 60 * 1000;

export default function ItemCard({ item, onEdit }) {
  const [imgSrc, setImgSrc] = useState("");

  useEffect(() => {
    let alive = true;

    async function load(force = false) {
      if (!item?.id || !item?.image_url) {
        if (alive) setImgSrc("");
        return;
      }

      const cacheKey = `item:${item.id}`;

      if (!force) {
        const cached = getCachedSignedUrl(cacheKey);
        if (cached) {
          if (alive) setImgSrc(cached);
          return;
        }
      }

      try {
        const { viewUrl } = await getItemImageViewUrl(item.id);
        if (!alive) return;

        setImgSrc(viewUrl || "");
        if (viewUrl) setCachedSignedUrl(cacheKey, viewUrl, VIEW_URL_TTL_MS);
      } catch {
        if (alive) setImgSrc("");
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, [item?.id, item?.image_url]);

  return (
    <Card
      sx={{
        width: 200,
        borderRadius: 3,
        cursor: "pointer",
        position: "relative",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      }}
    >
      {onEdit && (
        <Box
          onClick={(e) => {
            e.stopPropagation();
            onEdit(item);
          }}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            background: "white",
            borderRadius: "50%",
            p: "4px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            zIndex: 10,
          }}
        >
          <EditIcon fontSize="small" />
        </Box>
      )}

      {imgSrc && (
        <Box
          component="img"
          src={imgSrc}
          alt={item.name}
          loading="lazy" 
          decoding="async"
          onError={() => {
            // signed url might have expired → force refresh once
            const cacheKey = `item:${item.id}`;
            setCachedSignedUrl(cacheKey, "", 1); // expire cached url
            // re-fetch
            getItemImageViewUrl(item.id)
              .then(({ viewUrl }) => {
                setImgSrc(viewUrl || "");
                if (viewUrl) setCachedSignedUrl(cacheKey, viewUrl, VIEW_URL_TTL_MS);
              })
              .catch(() => setImgSrc(""));
          }}
          sx={{
            width: "100%",
            height: 120,
            objectFit: "fill",
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            background: "#fafafa",
          }}
        />
      )}

      <CardContent>
        <Typography variant="subtitle1" fontWeight={600}>
          {item.name}
        </Typography>

        {item.subtitle && (
          <Typography variant="body2" color="text.secondary">
            {item.subtitle}
          </Typography>
        )}

        {item.bundle_title && (
          <Box mt={1}>
            <Chip
              label={item.bundle_title}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ fontSize: "0.75rem" }}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
