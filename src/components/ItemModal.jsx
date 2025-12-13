import { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ItemForm from "./ItemForm";
import api from "../api/api";

export default function ItemModal({
    open,
    mode = "add", // 'add' | 'edit'
    initialItem, // optional for edit
    onClose,
    onSubmit, // ({ name, subtitle, imageUrl, bundleId }) => void
    onDelete, // optional for delete
}) {
    const [name, setName] = useState("");
    const [subtitle, setSubtitle] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [bundleId, setBundleId] = useState(null);
    const [bundles, setBundles] = useState([]);
    const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);

    useEffect(() => {
        // Load bundles when modal opens
        if (open) {
            setName(initialItem?.name || "");
            setSubtitle(initialItem?.subtitle || "");
            setImageUrl(initialItem?.image_url || "");
            setBundleId(initialItem?.bundle_id || null);
            
            api.get("/bundles").then((res) => setBundles(res.data)).catch(() => {});
        }
    }, [open, initialItem]);

    const handleFormChange = ({ field, value }) => {
        switch (field) {
            case "name":
                setName(value);
                break;
            case "subtitle":
                setSubtitle(value);
                break;
            case "imageUrl":
                setImageUrl(value);
                break;
            case "bundleId":
                setBundleId(value);
                break;
            default:
                break;
        }
    };

    const handleSubmit = () => {
        onSubmit?.({ name, subtitle, imageUrl, bundleId });
    };

    const handleDelete = () => {
        setOpenDeleteConfirm(true);
    };

    const confirmDelete = () => {
        if (onDelete && initialItem?.id) {
            onDelete(initialItem.id);
            setOpenDeleteConfirm(false);
            onClose();
        }
    };

    const titleText = mode === "edit" ? "Edit Item" : "Add New Item";
    const actionText = mode === "edit" ? "Save" : "Add";

    return (
        <>
            <Dialog open={open} onClose={onClose}>
                <DialogTitle>{titleText}</DialogTitle>
                <DialogContent>
                    <ItemForm
                        name={name}
                        subtitle={subtitle}
                        imageUrl={imageUrl}
                        bundleId={bundleId}
                        bundles={bundles}
                        onChange={handleFormChange}
                    />
                </DialogContent>
                <DialogActions>
                    {mode === "edit" && onDelete && (
                        <IconButton onClick={handleDelete} color="error" size="small" title="Delete item">
                            <DeleteIcon />
                        </IconButton>
                    )}
                    <div style={{ flex: 1 }} />
                    <Button onClick={onClose}>Cancel</Button>
                    <Button variant="contained" onClick={handleSubmit}>
                        {actionText}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openDeleteConfirm} onClose={() => setOpenDeleteConfirm(false)}>
                <DialogTitle>Delete Item</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete this item? This action cannot be undone.
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteConfirm(false)}>Cancel</Button>
                    <Button variant="contained" color="error" onClick={confirmDelete}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
