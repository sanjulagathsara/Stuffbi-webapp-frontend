import { useEffect, useState } from "react";
import { Box, Typography, Card, Avatar, Divider } from "@mui/material";
import { useParams } from "react-router-dom";
import api from "../api/api";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function Profile() {
  const params = useParams();
  const userId = params.id;

  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const endpoint = userId ? `/profile/${userId}` : "/profile/me";

    api.get(endpoint).then((res) => {
      setProfile(res.data);
    });
  }, [userId]);

  if (!profile) return <div>Loading...</div>;

  return (
    <Box display="flex" minHeight="100vh" bgcolor="#F5F7FF">
      <Sidebar />

      <Box flex={1}>
        <Topbar />

        <Box p={4}>
          <Card sx={{ p: 4, maxWidth: 400 }}>
            <Box display="flex" flexDirection="column" alignItems="center">
              <Avatar
                src={profile.avatar_url}
                sx={{ width: 100, height: 100, mb: 2 }}
              />

              <Typography variant="h5">{profile.display_name}</Typography>
              <Typography color="text.secondary">{profile.email}</Typography>

              <Divider sx={{ width: "100%", my: 2 }} />

              <Typography>
                <strong>Phone:</strong> {profile.phone || "N/A"}
              </Typography>

              <Typography>
                <strong>User ID:</strong> {profile.user_id}
              </Typography>
            </Box>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}
