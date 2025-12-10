import React from "react";
import { Button, Box, Typography } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";

const ProductActions = () => {
  const navigate = useNavigate();

  const handleAddEmployee = () => {
    navigate("add");
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",

      }}
    >
      <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>

      </Typography>
      <Button
        variant="contained"
        startIcon={<AddRoundedIcon />}
        onClick={handleAddEmployee}

        sx={{
          borderRadius: "8px",
          boxShadow: "none",
          backgroundColor: (theme) => theme.palette.primary.main,
          '&:hover': {
            backgroundColor: (theme) => theme.palette.primary.dark,
          },
          textTransform: 'none',
          fontWeight: 'bold',

        }}
      >
        Ajouter
      </Button>
    </Box>
  );
};

export default ProductActions;