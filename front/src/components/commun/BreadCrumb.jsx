import React from "react";
import { Typography, Breadcrumbs, Box, Link } from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

const Breadcrumb = ({ breadcrumb, PageTitle, navigate }) => {
  const handleBreadcrumbClick = (index) => {
    navigate(breadcrumb[index].path);
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography
        variant="h6"
        sx={{ fontWeight: "700", color: "text.primary", mb: 1 }}
      >
        {PageTitle}
      </Typography>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
      >
        <Link
          underline="hover"
          sx={{ display: 'flex', alignItems: 'center' }}
          color="inherit"
          href="/"
        >
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Accueil
        </Link>
        {breadcrumb.map((item, index) => (
          <Link
            key={index}
            underline="hover"
            sx={{
              color: 'text.primary',
              cursor: "pointer",
              '&:hover': { color: 'primary.main' }
            }}
            onClick={() => handleBreadcrumbClick(index)}
          >
            {item.name}
          </Link>
        ))}
      </Breadcrumbs>
    </Box>
  );
};

export default Breadcrumb;