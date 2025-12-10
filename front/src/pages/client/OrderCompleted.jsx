import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, Container, Paper, Fade } from "@mui/material";
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Confetti from 'react-confetti';

const OrderCompleted = () => {
    const navigate = useNavigate();
    const [showConfetti, setShowConfetti] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setShowConfetti(false), 5000);
        return () => clearTimeout(timer);
    }, []);

    const handleGoToHomePage = () => {
        navigate("/");
    };

    return (
        <Container maxWidth="sm">
            {showConfetti && <Confetti />}
            <Fade in={true} timeout={1000}>
                <Paper elevation={3} sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "80vh",
                    textAlign: "center",
                    padding: "40px",
                    borderRadius: "16px",
                    backgroundColor: "#ffffff",
                    mt: 4,
                }}>
                    <CheckCircleOutlineIcon sx={{ fontSize: 100, color: "#4CAF50", mb: 3 }} />
                    <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
                        Commande Confirmée !
                    </Typography>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Votre commande a été envoyée avec succès !
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 4, color: "#666" }}>
                        Merci pour votre confiance. Nous préparons votre commande avec soin.
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<HomeRoundedIcon />}
                        onClick={handleGoToHomePage}
                        sx={{
                            backgroundColor: "#FC6C8D",
                            color: "white",
                            fontWeight: "600",
                            padding: "12px 24px",
                            fontSize: "1rem",
                            borderRadius: "30px",
                            boxShadow: '0 4px 6px rgba(252, 108, 141, 0.2)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                backgroundColor: "#FF5277",
                                transform: 'translateY(-2px)',
                                boxShadow: '0 6px 8px rgba(252, 108, 141, 0.3)',
                            },
                        }}
                    >
                        Retour à l'accueil
                    </Button>
                </Paper>
            </Fade>
        </Container>
    );
};

export default OrderCompleted;