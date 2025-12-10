import React, { useState } from "react";
import {
    Button, IconButton, Typography, Box, Paper, Snackbar, Alert,
    LinearProgress, CircularProgress, Chip
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ClearIcon from "@mui/icons-material/Clear";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import StarIcon from "@mui/icons-material/Star";

const MAX_IMAGES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const ImageContainer = styled(Paper)(({ theme }) => ({
    position: "relative",
    width: 120,
    height: 120,
    borderRadius: theme.shape.borderRadius,
    overflow: "hidden",
    boxShadow: theme.shadows[3],
    transition: "transform 0.3s ease-in-out",
    "&:hover": {
        transform: "scale(1.05)",
    },
}));

const ImagePreview = styled("img")({
    width: "100%",
    height: "100%",
    objectFit: "cover",
});

const RemoveButton = styled(IconButton)(({ theme }) => ({
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: theme.palette.background.paper,
    "&:hover": {
        backgroundColor: theme.palette.error.light,
    },
}));

const MainImageChip = styled(Chip)(({ theme }) => ({
    position: "absolute",
    top: 4,
    left: 4,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
}));

const UploadButton = styled(Button)(({ theme }) => ({
    width: 120,
    height: 120,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    border: `2px dashed ${theme.palette.primary.main}`,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.default,
    "&:hover": {
        backgroundColor: theme.palette.action.hover,
    },
}));

const ImageUpload = ({ selectedImages, setSelectedImages, isReadOnly }) => {
    const [error, setError] = useState("");
    const [isUploading, setIsUploading] = useState(false);

    const handleImageUpload = (event) => {
        const files = Array.from(event.target.files);

        if (files.length + selectedImages.length > MAX_IMAGES) {
            setError(`Vous pouvez télécharger un maximum de ${MAX_IMAGES} images.`);
            return;
        }

        setIsUploading(true);
        const validFiles = [];

        files.forEach((file) => {
            if (file.size > MAX_FILE_SIZE) {
                setError(`Le fichier "${file.name}" dépasse la taille maximale de 5MB.`);
                return;
            }

            if (!file.type.startsWith("image/")) {
                setError(`Le fichier "${file.name}" n'est pas une image valide.`);
                return;
            }

            if (!selectedImages.some(img => img.name === file.name)) {
                validFiles.push(file);
            } else {
                setError(`L'image "${file.name}" est déjà téléchargée.`);
            }
        });

        setSelectedImages((prevImages) => [...prevImages, ...validFiles]);
        setIsUploading(false);
    };

    const removeImage = (index) => {
        setSelectedImages((prevImages) =>
            prevImages.filter((_, i) => i !== index)
        );
    };

    const handleCloseError = () => {
        setError("");
    };

    return (
        <Box sx={{ width: "100%" }}>
            <Paper
                elevation={3}
                sx={{
                    p: 2,
                    mb: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center"
                }}
            >
                <Typography variant="h6" gutterBottom>
                    Télécharger des images
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                    La première image sera affichée comme image principale. Les autres seront affichées comme images supplémentaires.
                </Typography>
                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 2,
                        justifyContent: "center",
                        mb: 2
                    }}
                >
                    {selectedImages.map((image, index) => (
                        <ImageContainer key={index}>
                            <ImagePreview src={URL.createObjectURL(image)} alt={`Selected ${index}`} />
                            {index === 0 && (
                                <MainImageChip
                                    size="small"
                                    icon={<StarIcon />}
                                    label="Principale"
                                />
                            )}
                            {!isReadOnly && <RemoveButton
                                size="small"
                                onClick={() => removeImage(index)}
                                aria-label="remove image"
                            >
                                <ClearIcon fontSize="small" />
                            </RemoveButton>}
                        </ImageContainer>
                    ))}
                    {selectedImages.length < MAX_IMAGES && !isReadOnly && (
                        <UploadButton
                            component="label"
                            disabled={isUploading}
                        >
                            {isUploading ? (
                                <CircularProgress size={24} />
                            ) : (
                                <>
                                    <AddPhotoAlternateIcon sx={{ mb: 1 }} />
                                    <Typography variant="caption">
                                        Ajouter image
                                    </Typography>
                                </>
                            )}
                            <input
                                type="file"
                                hidden
                                onChange={handleImageUpload}
                                accept="image/*"
                                multiple
                            />
                        </UploadButton>
                    )}
                </Box>
                <LinearProgress
                    variant="determinate"
                    value={(selectedImages.length / MAX_IMAGES) * 100}
                    sx={{ width: "100%", mb: 1 }}
                />
                <Typography variant="caption" color="textSecondary">
                    {selectedImages.length} / {MAX_IMAGES} images téléchargées
                </Typography>
            </Paper>
            <Snackbar
                open={!!error}
                autoHideDuration={6000}
                onClose={handleCloseError}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert onClose={handleCloseError} severity="error" sx={{ width: "100%" }}>
                    {error}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ImageUpload;
