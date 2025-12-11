import { Card, CardContent, Typography, Box } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

export default function ItemCard({ item, onEdit }) {
  return (
    <Card
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
            e.stopPropagation(); // Prevent card click
            onEdit(item);
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
          <EditIcon fontSize="small" />
        </Box>
      )}

      {/* IMAGE */}
      {item.image_url && (
        <Box
          component="img"
          src={item.image_url}
          alt={item.name}
          sx={{
            width: "100%",
            height: 120,
            objectFit: "contain",
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            background: "#fafafa",
            p: 1,
          }}
        />
      )}

      {/* CONTENT */}
      <CardContent>
        <Typography variant="subtitle1" fontWeight={600}>
          {item.name}
        </Typography>

        {item.subtitle && (
          <Typography variant="body2" color="text.secondary">
            {item.subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
