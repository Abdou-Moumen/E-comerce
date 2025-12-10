import React from 'react';
import { Typography, Box, Paper, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';
import StarIcon from '@mui/icons-material/Star';

const ConteneurImage = styled(Paper)(({ theme }) => ({
    position: 'relative',
    width: 120,
    height: 120,
    borderRadius: theme.shape.borderRadius,
    overflow: 'hidden',
    boxShadow: theme.shadows[3],
    transition: 'transform 0.3s ease-in-out',
    '&:hover': {
        transform: 'scale(1.05)',
    },
}));

const ApercuImage = styled('img')({
    width: '100%',
    height: '100%',
    objectFit: 'cover',
});

const EtiquetteImagePrincipale = styled(Chip)(({ theme }) => ({
    position: 'absolute',
    top: 4,
    left: 4,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
}));

const GalerieImages = ({ images }) => {
    return (
        <Box sx={{ width: '100%' }}>
            <Paper
                elevation={3}
                sx={{
                    p: 2,
                    mb: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}
            >
                <Typography variant="h6" gutterBottom>
                    Galerie d'Images
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                    La première image est affichée comme image principale. Les autres sont montrées comme images supplémentaires.
                </Typography>
                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 2,
                        justifyContent: 'center',
                        mb: 2
                    }}
                >
                    {images.map((urlImage, index) => (
                        <ConteneurImage key={index}>
                            <ApercuImage src={urlImage} alt={`Image ${index + 1}`} />
                            {index === 0 && (
                                <EtiquetteImagePrincipale
                                    size="small"
                                    icon={<StarIcon />}
                                    label="Principale"
                                />
                            )}
                        </ConteneurImage>
                    ))}
                </Box>
                <Typography variant="caption" color="textSecondary">
                    {images.length} image{images.length > 1 ? 's' : ''} affichée{images.length > 1 ? 's' : ''}
                </Typography>
            </Paper>
        </Box>
    );
};

export default GalerieImages;