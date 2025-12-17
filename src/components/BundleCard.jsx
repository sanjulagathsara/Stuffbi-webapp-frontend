// src/components/BundleCard.jsx
// Card component to display bundle information

import { useEffect, useState } from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { getBundleImageViewUrl } from "../api/api";
import { getCachedSignedUrl, setCachedSignedUrl } from "../utils/signedUrlCache";

// backend signed ttl = 2 hours → keep frontend cache slightly less
const VIEW_URL_TTL_MS = 115 * 60 * 1000; // 1h 55m

export default function BundleCard({ bundle, onOpen, onEdit, onDelete }) {
  const [imgSrc, setImgSrc] = useState("");

  useEffect(() => {
    let alive = true;

    async function load(force = false) {
      if (!bundle?.id || !bundle?.image_url) {
        if (alive) setImgSrc("");
        return;
      }

      const cacheKey = `bundle:${bundle.id}`;

      if (!force) {
        const cached = getCachedSignedUrl(cacheKey);
        if (cached) {
          if (alive) setImgSrc(cached);
          return;
        }
      }

      try {
        const { viewUrl } = await getBundleImageViewUrl(bundle.id);
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
  }, [bundle?.id, bundle?.image_url]);

  return (
    <Card
      onClick={() => onOpen?.(bundle)}
      sx={{
        width: 200,
        borderRadius: 3,
        cursor: "pointer",
        position: "relative",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        transition: "0.2s",
        "&:hover": { transform: "scale(1.03)" },
      }}
    >
      {/* EDIT ICON */}
      {onEdit && (
        <Box
          onClick={(e) => {
            e.stopPropagation();
            onEdit(bundle);
          }}
          sx={{
            position: "absolute",
            top: 8,
            right: onDelete ? 40 : 8,
            background: "white",
            borderRadius: "50%",
            padding: "4px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            cursor: "pointer",
            zIndex: 10,
          }}
        >
          <EditIcon fontSize="small" />
        </Box>
      )}

      {/* DELETE ICON */}
      {onDelete && (
        <Box
          onClick={(e) => {
            e.stopPropagation();
            onDelete(bundle.id);
          }}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            background: "white",
            borderRadius: "50%",
            padding: "4px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            cursor: "pointer",
            zIndex: 10,
          }}
        >
          <DeleteIcon fontSize="small" />
        </Box>
      )}

      {/* IMAGE */}
      {imgSrc && (
        <Box
          component="img"
          src={imgSrc}
          alt={bundle.title}
          loading="lazy"
          decoding="async"
          onError={() => {
            const cacheKey = `bundle:${bundle.id}`;
            setCachedSignedUrl(cacheKey, "", 1);

            getBundleImageViewUrl(bundle.id)
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
          {bundle.title}
        </Typography>

        {bundle.subtitle && (
          <Typography variant="body2" color="text.secondary">
            {bundle.subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
