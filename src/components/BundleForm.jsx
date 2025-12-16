import {
  Box,
  TextField,
  Button,
  Typography,
  LinearProgress,
} from "@mui/material";
import { useState } from "react";
import {
  presignNewBundleImage,
  presignBundleImage,
  uploadToS3,
} from "../api/api";

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

  const handlePickFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setProgress(0);

      // ✅ choose correct presign endpoint
      const presign =
        mode === "edit" && bundleId
          ? await presignBundleImage(bundleId, file.type)
          : await presignNewBundleImage(file.type);

      // ✅ upload with progress
      await uploadToS3(presign.uploadUrl, file, (p) => setProgress(p));

      // ✅ save final URL into form state
      onChange({ field: "imageUrl", value: presign.url });

      setProgress(100);
    } catch (err) {
      console.error(err);
      alert("Image upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
      // optional: reset after success
      // setTimeout(() => setProgress(0), 800);
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

      {/* ✅ Upload button + progress */}
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

        {imageUrl && (
          <Box
            component="img"
            src={imageUrl}
            alt="preview"
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

      {/* optional: keep manual input */}
      <TextField
        fullWidth
        label="Image URL (optional)"
        value={imageUrl}
        onChange={(e) => onChange({ field: "imageUrl", value: e.target.value })}
      />
    </Box>
  );
}
