import { useEffect, useState } from "react";
import { Box, Typography, Card, Avatar, Divider, Button, CircularProgress, Alert, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
import { useParams } from "react-router-dom";
import api from "../api/api";
import PageWrapper from "../components/PageWrapper";

export default function Profile() {
    const params = useParams();
    const userId = params.id;

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Edit Modal
    const [openEdit, setOpenEdit] = useState(false);
    const [editName, setEditName] = useState("");
    const [editPhone, setEditPhone] = useState("");
    const [editAvatarUrl, setEditAvatarUrl] = useState("");

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

    const openEditModal = () => {
        setEditName(profile.display_name);
        setEditPhone(profile.phone || "");
        setEditAvatarUrl(profile.avatar_url || "");
        setOpenEdit(true);
    };

    const updateProfile = () => {
        api
            .put("/profile/me", {
                display_name: editName,
                phone: editPhone,
                avatar_url: editAvatarUrl,
            })
            .then((res) => {
                setProfile(res.data);
                setOpenEdit(false);
            })
            .catch(() => alert("Update failed"));
    };

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;
    if (!profile) return <Alert severity="warning">Profile not found</Alert>;

    return (
        <PageWrapper>
            <Box display="flex" minHeight="100vh" bgcolor="#F5F7FF">

                <Box flex={1}>
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

                                <Divider sx={{ width: "100%", my: 2 }} />

                                <Box width="100%" textAlign="left">
                                    <Typography variant="body2" sx={{ mb: 1.5 }}>
                                        <strong>Phone:</strong> {profile.phone || "Not provided"}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 1.5 }}>
                                        <strong>User ID:</strong> {profile.user_id}
                                    </Typography>
                                </Box>

                                <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={openEditModal}>
                                    Edit Profile
                                </Button>
                            </Box>
                        </Card>
                    </Box>
                </Box>
            </Box>

            {/* EDIT PROFILE MODAL */}
            <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogContent sx={{ width: 350 }}>
                    <TextField
                        fullWidth
                        label="Display Name"
                        sx={{ mb: 2, mt: 1 }}
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                    />


                    <TextField
                        fullWidth
                        label="Phone"
                        sx={{ mb: 2 }}
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                    />

                    <TextField
                        fullWidth
                        label="Avatar URL"
                        value={editAvatarUrl}
                        onChange={(e) => setEditAvatarUrl(e.target.value)}
                    />
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
                    <Button variant="contained" onClick={updateProfile}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </PageWrapper>
    );
}
