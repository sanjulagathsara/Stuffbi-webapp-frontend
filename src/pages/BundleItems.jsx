import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  Breadcrumbs,
  Link as MLink,
  Button,
} from "@mui/material";

import api from "../api/api";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import ItemCard from "../components/ItemCard";

export default function BundleItems() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [items, setItems] = useState([]);
  const [bundleTitle, setBundleTitle] = useState(
    location.state?.bundleTitle || `Bundle #${id}`
  );

  useEffect(() => {
    // load items in this bundle
    api
      .get("/items", { params: { bundle_id: id } })
      .then((res) => setItems(res.data))
      .catch(() => alert("Failed to load bundle items"));

    // if title not passed via state, fetch bundles and resolve title
    if (!location.state?.bundleTitle) {
      api
        .get("/bundles")
        .then((res) => {
          const found = res.data.find((b) => String(b.id) === String(id));
          if (found?.title) setBundleTitle(found.title);
        })
        .catch(() => {});
    }
  }, [id]);

  return (
    <Box display="flex" minHeight="100vh" bgcolor="#F5F7FF">
      <Sidebar />

      <Box flex={1}>
        <Topbar />

        <Box p={4}>
        {/* Breadcrumbs + Back */}
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 1 }}>
                        <MLink
                          underline="hover"
                          color="inherit"
                          sx={{ cursor: "pointer" }}
                          onClick={() => navigate("/bundles")}
                        >
                          Bundles
                        </MLink>

                        <Typography color="text.primary">{bundleTitle}</Typography>
                      </Breadcrumbs>

                      <Typography variant="h5" fontWeight={600}>
                        {bundleTitle}
                      </Typography>
                    </Box>

                    <Button variant="outlined" onClick={() => navigate(-1)}>
                      ← Back
                    </Button>
                  </Box>

                  {/* Items grid */}
          <Card
            sx={{
              mt: 3,
              p: 3,
              borderRadius: 3,
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
            }}
          >
            {items.length === 0 ? (
              <Typography color="text.secondary">
                No items in this bundle.
              </Typography>
            ) : (
              <Box display="flex" gap={3} flexWrap="wrap">
                {items.map((item) => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </Box>
            )}
          </Card>
        </Box>
      </Box>
    </Box>
  );
}
