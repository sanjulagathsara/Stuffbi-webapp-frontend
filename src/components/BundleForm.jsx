import {
  Box,
  TextField,
  Button,
  Typography,
  LinearProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  presignNewBundleImage,
  presignBundleImage,
  uploadToS3,
  getBundleImageViewUrl,
} from "../api/api";
import { getCachedSignedUrl, setCachedSignedUrl } from "../utils/signedUrlCache";

const VIEW_URL_TTL_MS = 115 * 60 * 1000; // 1h 55m

export default function BundleForm({
  title,
  subtitle,
  imageUrl,
  onChange,
  mode,     // "add" | "edit"
  bundleId, // id for edit mode (undefined/null for add)
}) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const [previewSrc, setPreviewSrc] = useState("");

  const [localObjectUrl, setLocalObjectUrl] = useState("");

  // Load preview for existing bundle image (edit mode) using signed URL
  useEffect(() => {
    let alive = true;

    async function loadPreview() {
      // If user picked a new file, keep showing local preview
      if (localObjectUrl) return;

      // Add mode: we cannot sign-view without an id
      if (mode !== "edit" || !bundleId || !imageUrl) {
        if (alive) setPreviewSrc("");
        return;
      }

      const cacheKey = `bundle:preview:${bundleId}`;
      const cached = getCachedSignedUrl(cacheKey);
      if (cached) {
        if (alive) setPreviewSrc(cached);
        return;
      }

      try {
        const { viewUrl } = await getBundleImageViewUrl(bundleId);
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
  }, [mode, bundleId, imageUrl, localObjectUrl]);

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
        mode === "edit" && bundleId
          ? await presignBundleImage(bundleId, file.type)
          : await presignNewBundleImage(file.type);

      await uploadToS3(presign.uploadUrl, file, (p) => setProgress(p));

      // Save raw URL (used for DB)
      onChange({ field: "imageUrl", value: presign.url });

      setProgress(100);
    } catch (err) {
      console.error(err);
      alert("Image upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <Box sx={{ width: 350 }}>
      <TextField
        fullWidth
        label="Title"
        sx={{ mb: 2 }}
        value={title}
        onChange={(e) => onChange({ field: "title", value: e.target.value })}
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
          Bundle Image
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
              if (mode === "edit" && bundleId && !localObjectUrl) {
                try {
                  const { viewUrl } = await getBundleImageViewUrl(bundleId);
                  setPreviewSrc(viewUrl || "");
                  if (viewUrl) setCachedSignedUrl(`bundle:preview:${bundleId}`, viewUrl, VIEW_URL_TTL_MS);
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
    </Box>
  );
}
