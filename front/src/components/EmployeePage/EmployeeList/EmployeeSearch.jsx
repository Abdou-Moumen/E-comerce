import React, { useState } from "react";
import {
  TextField,
  Box,
  Button,
  Typography,
  InputAdornment,
  Paper,
  useTheme,
  useMediaQuery
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import colorPalette from "../../commun/color";

const EmployeeSearch = ({ setSearchQuery }) => {
  const [searchText, setSearchText] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleSearch = () => {
    const newSearchQuery = searchText.trim() === "" ? "all" : searchText;
    setSearchQuery(newSearchQuery);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        border: "1px solid",
        borderColor: "divider"
      }}
    >
      <Box sx={{ p: 2.5 }}>
        <Typography variant="h6" fontWeight="bold" mb={2.5} color={colorPalette.mainText}>
          Rechercher un employé
        </Typography>
        <TextField
          fullWidth
          id="employee-search"
          placeholder="Nom, prénom, email..."
          variant="outlined"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyPress={handleKeyPress}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              height: '48px',
            },
          }}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          p: 2.5,
          bgcolor: "grey.100",
        }}
      >
        <Button
          variant="solid"
          color="primary"
          onClick={handleSearch}
          startIcon={<SearchIcon />}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            py: 1.25,
            height: '40px',
            backgroundColor: "primary"
          }}
        >
          Rechercher
        </Button>
      </Box>
    </Paper>
  );
};

export default EmployeeSearch;