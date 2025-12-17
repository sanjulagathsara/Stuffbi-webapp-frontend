// src/pages/Bundles.jsx
// Page to display and manage bundles


import { useEffect, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

import api from "../api/api";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import BundleCard from "../components/BundleCard";
import BundleModal from "../components/BundleModal";

export default function Bundles() {
  const navigate = useNavigate();

  const [bundles, setBundles] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);

  // EDIT modal state
  const [editOpen, setEditOpen] = useState(false);
  const [editBundle, setEditBundle] = useState(null);





  useEffect(() => {
    api.get("/bundles").then((res) => setBundles(res.data));
  }, []);

  // --------------------------
  // ADD BUNDLE
  // --------------------------
  const addBundle = ({ title, subtitle, imageUrl }) => {
    api
      .post("/bundles", { title, subtitle, image_url: imageUrl })
      .then((res) => {
        setBundles((prev) => [...prev, res.data]);
        setOpenAdd(false);
      })
      .catch(() => alert("Bundle create failed"));
  };

  // --------------------------
  // DELETE BUNDLE
  // --------------------------
  const deleteBundle = (bundleId) => {
    api
      .delete(`/bundles/${bundleId}`)
      .then(() => {
        setBundles((prev) => prev.filter((b) => b.id !== bundleId));
        setOpenAdd(false);
      })
      .catch(() => alert("Failed to delete bundle"));
  };

  // --------------------------
  // OPEN EDIT MODAL
  // --------------------------
  const openEditModal = (bundle) => {
    setEditBundle(bundle);
    setEditOpen(true);
  };

  // --------------------------
  // SAVE EDIT
  // --------------------------
  const saveEdit = ({ title, subtitle, imageUrl }) => {
    api
      .put(`/bundles/${editBundle.id}`, {
        title,
        subtitle,
        image_url: imageUrl,
      })
      .then((res) => {
        setBundles((prev) =>
          prev.map((b) => (b.id === res.data.id ? res.data : b))
        );
        setEditOpen(false);
      })
      .catch(() => alert("Failed to update bundle"));
  };

  // --------------------------
  // OPEN BUNDLE ITEMS SUB SCREEN
  // --------------------------
  const openBundleItems = (bundle) => {
    navigate(`/bundles/${bundle.id}/items`, {
      state: { bundleTitle: bundle.title },
    });
  };

  return (
    <Box display="flex" minHeight="100vh" bgcolor="#F5F7FF">
      <Sidebar />

      <Box flex={1}>
        <Topbar />

        <Box p={4}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" fontWeight={600}>
              Bundles
            </Typography>

            <Button variant="contained" onClick={() => setOpenAdd(true)}>
              + Add Bundle
            </Button>
          </Box>

          <Box display="flex" gap={3} mt={3} flexWrap="wrap">
            {bundles.map((b) => (
             <BundleCard
                key={b.id}
                bundle={b}
                onOpen={() => openBundleItems(b)}
                onEdit={() => openEditModal(b)}
                onDelete={() => deleteBundle(b.id)}
              />
            ))}
          </Box>
        </Box>
      </Box>

      <BundleModal
        open={openAdd}
        mode="add"
        onClose={() => setOpenAdd(false)}
        onSubmit={addBundle}
      />

      {/* ---------------------- EDIT MODAL ---------------------- */}
      <BundleModal
        open={editOpen}
        mode="edit"
        initialBundle={editBundle}
        onClose={() => setEditOpen(false)}
        onSubmit={saveEdit}
        onDelete={deleteBundle}
      />
    </Box>
  );
}
