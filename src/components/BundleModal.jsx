import { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import BundleForm from "./BundleForm";

export default function BundleModal({
    open,
    mode = "add", // 'add' | 'edit'
    initialBundle, // optional for edit
    onClose,
    onSubmit, // ({ title, subtitle, imageUrl }) => void
    onDelete, // optional for delete
}) {
    const [title, setTitle] = useState("");
    const [subtitle, setSubtitle] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    useEffect(() => {
        if (open) {
            setTitle(initialBundle?.title || "");
            setSubtitle(initialBundle?.subtitle || "");
            setImageUrl(initialBundle?.image_url || "");
        }
    }, [open, initialBundle]);

    const handleFormChange = ({ field, value }) => {
        switch (field) {
            case "title":
                setTitle(value);
                break;
            case "subtitle":
                setSubtitle(value);
                break;
            case "imageUrl":
                setImageUrl(value);
                break;
            default:
                break;
        }
    };

    const handleSubmit = () => {
        onSubmit?.({ title, subtitle, imageUrl });
    };

    const handleDelete = () => {
        if (onDelete && initialBundle?.id) {
            onDelete(initialBundle.id);
            onClose();
        }
    };

    const titleText = mode === "edit" ? "Edit Bundle" : "Add Bundle";
    const actionText = mode === "edit" ? "Save" : "Add";

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{titleText}</DialogTitle>
            <DialogContent>
                <BundleForm
                    title={title}
                    subtitle={subtitle}
                    imageUrl={imageUrl}
                    onChange={handleFormChange}
                />
            </DialogContent>
            <DialogActions>
                {mode === "edit" && onDelete && (
                    <IconButton onClick={handleDelete} color="error" size="small" title="Delete bundle">
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
    );
}
