import { Card, CardMedia, CardContent, Typography } from "@mui/material";

export default function ItemCard({ item }) {
  return (
    <Card
      sx={{
        width: 180,
        borderRadius: 4,
        boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
        overflow: "hidden",
      }}
    >
      <CardMedia
        component="div"
        sx={{
          height: 90,
          bgcolor: "#EFF6FF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img src="/placeholder-image.png" width={36} alt="" />
      </CardMedia>

      <CardContent>
        <Typography fontWeight={600} fontSize={14}>
          {item.name}
        </Typography>
        <Typography color="gray" fontSize={12}>
          {item.subtitle}
        </Typography>
      </CardContent>
    </Card>
  );
}
