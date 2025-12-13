import { Box, TextField } from "@mui/material";

export default function ItemForm({ name, subtitle, imageUrl, onChange }) {
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
