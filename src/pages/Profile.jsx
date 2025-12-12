import { useEffect, useState } from "react";
import { Box, Typography, Card, Avatar, Divider, Button, CircularProgress, Alert } from "@mui/material";
import { useParams } from "react-router-dom";
import api from "../api/api";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function Profile() {
    const params = useParams();
    const userId = params.id;

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const endpoint = userId ? `/profile/${userId}` : "/profile/me";

        api
            .get(endpoint)
            .then((res) => {
                setProfile(res.data);
                setError(null);
            })
            .catch((err) => {
                setError("Failed to load profile");
                console.error(err);
            })
            .finally(() => setLoading(false));
    }, [userId]);

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;
    if (!profile) return <Alert severity="warning">Profile not found</Alert>;

    return (
        <Box display="flex" minHeight="100vh" bgcolor="#F5F7FF">
            <Sidebar />

            <Box flex={1}>
                <Topbar />

                <Box p={4}>
                    <Card sx={{ p: 4, maxWidth: 500, mx: "auto", boxShadow: 3 }}>
                        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                            <Avatar
                                src={profile.avatar_url}
                                alt={profile.display_name}
                                sx={{ width: 120, height: 120 }}
                            />

                            <Typography variant="h4" fontWeight="bold">
                                {profile.display_name}
                            </Typography>
                            <Typography color="text.secondary">{profile.email}</Typography>

                            <Divider sx={{ width: "100%", my: 2 }} />

                            <Box width="100%" textAlign="left">
                                <Typography variant="body2" sx={{ mb: 1.5 }}>
                                    <strong>Phone:</strong> {profile.phone || "Not provided"}
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 1.5 }}>
                                    <strong>User ID:</strong> {profile.user_id}
                                </Typography>
                            </Box>

                            <Button variant="contained" fullWidth sx={{ mt: 2 }}>
                                Edit Profile
                            </Button>
                        </Box>
                    </Card>
                </Box>
            </Box>
        </Box>
    );
}
