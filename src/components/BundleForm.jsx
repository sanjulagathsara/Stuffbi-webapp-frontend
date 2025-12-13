import { Box, TextField } from "@mui/material";

export default function BundleForm({ title, subtitle, imageUrl, onChange }) {
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
        onChange={(e) =>
          onChange({ field: "subtitle", value: e.target.value })
        }
      />

      <TextField
        fullWidth
        label="Image URL"
        value={imageUrl}
        onChange={(e) =>
          onChange({ field: "imageUrl", value: e.target.value })
        }
      />
    </Box>
  );
}
