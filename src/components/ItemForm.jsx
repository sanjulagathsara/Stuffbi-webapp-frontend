import { Box, TextField, MenuItem, FormControl, InputLabel, Select, Button, Typography } from "@mui/material";
import { useState } from "react";
import { presignNewItemImage, presignItemImage, uploadToS3 } from "../api/api";

export default function ItemForm({ name, subtitle, imageUrl, bundleId, bundles = [], onChange, mode, itemId }) {
  const [uploading, setUploading] = useState(false);

  const handlePickFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);

      // ✅ choose correct presign endpoint
      const presign =
        mode === "edit" && itemId
          ? await presignItemImage(itemId, file.type)
          : await presignNewItemImage(file.type);

      await uploadToS3(presign.uploadUrl, file);

      // save url into form state (your existing flow already sends image_url)
      onChange({ field: "imageUrl", value: presign.url });
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

      {/* ✅ Upload button */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" sx={{ mb: 1, color: "text.secondary" }}>
          Item Image
        </Typography>

        <Button
          variant="outlined"
          component="label"
          fullWidth
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Choose & Upload Image"}
          <input hidden type="file" accept="image/*" onChange={handlePickFile} />
        </Button>

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

      {/* optional: keep manual input if you want */}
      <TextField
        fullWidth
        label="Image URL (optional)"
        sx={{ mb: 2 }}
        value={imageUrl}
        onChange={(e) => onChange({ field: "imageUrl", value: e.target.value })}
      />

      <FormControl fullWidth>
        <InputLabel>Bundle</InputLabel>
        <Select
          value={bundles.length > 0 && bundleId ? bundleId : ""}
          label="Bundle"
          onChange={(e) => onChange({ field: "bundleId", value: e.target.value || null })}
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
