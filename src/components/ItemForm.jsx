import { Box, TextField, MenuItem, FormControl, InputLabel, Select } from "@mui/material";

export default function ItemForm({ name, subtitle, imageUrl, bundleId, bundles = [], onChange }) {
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
        sx={{ mb: 2 }}
        value={imageUrl}
        onChange={(e) =>
          onChange({ field: "imageUrl", value: e.target.value })
        }
      />

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
