import React from "react";
import { Button } from "@mui/material";
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import { styled } from '@mui/material/styles';

const StyledBackButton = styled(Button)(({ theme }) => ({
    backgroundColor: "transparent",
    color: theme.palette.text.primary,
    borderRadius: "8px",
    boxShadow: "none",
    width: "100px",
    textTransform: "none",
    margin: "10px 0",
    fontWeight: 500,
    "&:hover": {
        backgroundColor: "rgba(0, 0, 0, 0.04)",
        boxShadow: "none"
    },
}));

const BackButton = ({ navigate }) => {
    return (
        <StyledBackButton
            onClick={() => navigate(-1)}
            startIcon={<ArrowBackIosRoundedIcon />}
        >
            Retour
        </StyledBackButton>
    );
};

export default BackButton;