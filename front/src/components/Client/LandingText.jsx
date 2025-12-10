import React, { useState, useEffect } from 'react';
import { Typography, Button, Box } from '@mui/material';
import Header from "../../components/header/Header.jsx";

const LuceLanding = () => {




    return (


        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                // minHeight: '100vh',
                // background: gradientBackground,
                color: '#333',
                borderRadius: "0px 0px 15px 15px",
                p: 4,
            }}
        >
            <Typography
                variant="h5"
                component="h2"
                sx={{ textAlign: 'center', mb: 2, mt: 8 }}
                gutterBottom
            >
                Bienvenue Sur Notre Boutique
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
                Livraison Disponible
            </Typography>
            <Button
                variant="outlined"
                sx={{
                    mt: 2,
                    borderRadius: "2px"
                    ,
                    borderColor: '#333',
                    color: '#333',
                    '&:hover': {
                        borderColor: '#333',
                    },
                }}
            >
                Découvrir
            </Button>
        </Box>

    );
};

export default LuceLanding;