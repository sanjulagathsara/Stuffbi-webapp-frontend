"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import {
  Box,
  Typography,
  Card,
  Avatar,
  Divider,
  CircularProgress,
} from "@mui/material";

import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

interface Profile {
  user_id: number;
  display_name?: string | null;
  email: string;
  avatar_url?: string | null;
  phone?: string | null;
  created_at: string;
  updated_at: string;
}

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();

  // FIX: If route is /profile → no param exists
  const userId: string | null =
    params?.userId && typeof params.userId === "string" ? params.userId : null;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const endpoint = userId ? `/profile/${userId}` : "/profile/me";

        const res = await api.get(endpoint);
        setProfile(res.data);
      } catch (err: any) {
        console.error("PROFILE ERROR:", err);
        if (err?.response?.status === 401) {
          router.push("/login");
          return;
        }
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router, userId]);

  if (loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        bgcolor="#F5F7FF"
      >
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Box display="flex" bgcolor="#F5F7FF" minHeight="100vh">
        <Sidebar />
        <Box flex={1}>
          <Topbar />
          <Box p={4}>
            <Typography color="error">{error}</Typography>
          </Box>
        </Box>
      </Box>
    );

  if (!profile) return <div>Profile not found</div>;

  const displayName = profile.display_name || profile.email;
  const created = new Date(profile.created_at).toLocaleDateString();
  const avatar = profile.avatar_url || "/default-avatar.png";

  return (
    <Box display="flex" bgcolor="#F5F7FF" minHeight="100vh">
      <Sidebar />

      <Box flex={1} display="flex" flexDirection="column">
        <Topbar />

        <Box component="main" sx={{ px: 4, pb: 4 }}>
          <Card
            sx={{
              maxWidth: 500,
              mx: "auto",
              mt: 4,
              p: 4,
              borderRadius: 4,
              boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
            }}
          >
            <Box display="flex" flexDirection="column" alignItems="center">
              <Avatar src={avatar} sx={{ width: 100, height: 100, mb: 2 }} />

              <Typography variant="h5" fontWeight={600}>
                {displayName}
              </Typography>

              <Typography variant="body2" color="text.secondary" mb={2}>
                {profile.email}
              </Typography>

              <Divider sx={{ width: "100%", my: 2 }} />

              <Box width="100%">
                <Typography sx={{ mb: 1 }}>
                  <strong>Phone:</strong> {profile.phone || "Not provided"}
                </Typography>

                <Typography sx={{ mb: 1 }}>
                  <strong>Member since:</strong> {created}
                </Typography>

                <Typography sx={{ mb: 1 }}>
                  <strong>User ID:</strong> {profile.user_id}
                </Typography>
              </Box>
            </Box>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}
