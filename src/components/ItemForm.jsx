import {
  Box,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Button,
  Typography,
  LinearProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  presignNewItemImage,
  presignItemImage,
  uploadToS3,
  getItemImageViewUrl,
} from "../api/api";
import { getCachedSignedUrl, setCachedSignedUrl } from "../utils/signedUrlCache";

// backend signed ttl = 2 hours → keep frontend cache slightly less
const VIEW_URL_TTL_MS = 115 * 60 * 1000; // 1h 55m

export default function ItemForm({
  name,
  subtitle,
  imageUrl,  // raw private S3 url stored in DB
  bundleId,
  bundles = [],
  onChange,
  mode,
  itemId,
}) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  //  what we actually show in <img>
  const [previewSrc, setPreviewSrc] = useState("");

  // local preview when user chooses a new file
  const [localObjectUrl, setLocalObjectUrl] = useState("");

  // Load preview for existing item image (edit mode) using signed URL
  useEffect(() => {
    let alive = true;

    async function loadPreview() {
      // If user picked a new file, keep showing local preview
      if (localObjectUrl) return;

      // Add mode: we cannot sign-view without an id
      if (mode !== "edit" || !itemId || !imageUrl) {
        if (alive) setPreviewSrc("");
        return;
      }

      const cacheKey = `item:preview:${itemId}`;
      const cached = getCachedSignedUrl(cacheKey);
      if (cached) {
        if (alive) setPreviewSrc(cached);
        return;
      }

      try {
        const { viewUrl } = await getItemImageViewUrl(itemId);
        if (!alive) return;

        setPreviewSrc(viewUrl || "");
        if (viewUrl) setCachedSignedUrl(cacheKey, viewUrl, VIEW_URL_TTL_MS);
      } catch {
        if (alive) setPreviewSrc("");
      }
    }

    loadPreview();
    return () => {
      alive = false;
    };
  }, [mode, itemId, imageUrl, localObjectUrl]);

  // Cleanup object URL
  useEffect(() => {
    return () => {
      if (localObjectUrl) URL.revokeObjectURL(localObjectUrl);
    };
  }, [localObjectUrl]);

  const handlePickFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // instant preview
    if (localObjectUrl) URL.revokeObjectURL(localObjectUrl);
    const objUrl = URL.createObjectURL(file);
    setLocalObjectUrl(objUrl);
    setPreviewSrc(objUrl);

    try {
      setUploading(true);
      setProgress(0);

      const presign =
        mode === "edit" && itemId
          ? await presignItemImage(itemId, file.type)
          : await presignNewItemImage(file.type);

      await uploadToS3(presign.uploadUrl, file, (p) => setProgress(p));

      // save raw URL to DB later via your create/update calls
      onChange({ field: "imageUrl", value: presign.url });

      setProgress(100);
    } catch (err) {
      console.error(err);
      alert("Image upload failed");
    } finally {
      setUploading(false);
      e.target.value = ""; // allow selecting same file again
    }
  };

  return (
    <Box sx={{ width: 350 }}>
      <TextField
        fullWidth
        label="Name"
        sx={{ mb: 2 }}
        value={name}
        onChange={(e) => onChange({ field: "name", value: e.target.value })}
      />

      <TextField
        fullWidth
        label="Subtitle"
        sx={{ mb: 2 }}
        value={subtitle}
        onChange={(e) => onChange({ field: "subtitle", value: e.target.value })}
      />

      {/* Upload button + progress */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" sx={{ mb: 1, color: "text.secondary" }}>
          Item Image
        </Typography>

        <Button variant="outlined" component="label" fullWidth disabled={uploading}>
          {uploading ? `Uploading... ${progress}%` : "Choose & Upload Image"}
          <input hidden type="file" accept="image/*" onChange={handlePickFile} />
        </Button>

        {uploading && (
          <Box sx={{ mt: 1 }}>
            <LinearProgress variant="determinate" value={progress} />
          </Box>
        )}

        {/* Preview uses previewSrc (signed url or local object url) */}
        {previewSrc && (
          <Box
            component="img"
            src={previewSrc}
            alt="preview"
            loading="lazy"
            decoding="async"
            onError={async () => {
              // Signed URL might expire: refresh in edit mode
              if (mode === "edit" && itemId && !localObjectUrl) {
                try {
                  const { viewUrl } = await getItemImageViewUrl(itemId);
                  setPreviewSrc(viewUrl || "");
                  if (viewUrl) setCachedSignedUrl(`item:preview:${itemId}`, viewUrl, VIEW_URL_TTL_MS);
                } catch {
                  setPreviewSrc("");
                }
              } else {
                setPreviewSrc("");
              }
            }}
            sx={{
              mt: 2,
              width: "100%",
              height: 160,
              objectFit: "contain",
              borderRadius: 2,
              background: "#fafafa",
              p: 1,
            }}
          />
        )}
      </Box>

      <FormControl fullWidth>
        <InputLabel>Bundle</InputLabel>
        <Select
          value={bundles.length > 0 && bundleId ? bundleId : ""}
          label="Bundle"
          onChange={(e) =>
            onChange({ field: "bundleId", value: e.target.value || null })
          }
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {bundles.map((bundle) => (
            <MenuItem key={bundle.id} value={bundle.id}>
              {bundle.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
