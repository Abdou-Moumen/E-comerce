import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  MenuItem,
  Box,
  Button,
  Typography,
  Grid,
  Collapse,
  InputAdornment,
  useMediaQuery,
  useTheme,
  Paper,
  Chip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";
import { useGetCategery } from "../../../Hooks/Products/useCategory";

const ProductSearch = ({ setSearchQuery }) => {
  const [isOpened, setIsOpened] = useState(false);
  const [categories, setCategories] = useState([])
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      searchQuery: "",
      selectedCategory: "all",
      selectedStock: "all",
      selectedCondition: "all",
    },
  });
  const { data, isLoading, isError } = useGetCategery();

  useEffect(() => {
    if (data) {
      setCategories(data.data || []);
    }
  }, [data]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const toggleFilter = () => setIsOpened(!isOpened);

  const onSubmit = (formData) => {
    console.log("Form Data: ", formData);
    setSearchQuery({
      search: formData.searchQuery.trim() === "" ? "all" : formData.searchQuery,
      category: formData.selectedCategory,
      isDraft: formData.selectedCondition,
      stock: formData.selectedStock,
    });
  };

  const handleReset = () => {
    reset({
      searchQuery: "",
      selectedCategory: "all",
      selectedStock: "all",
      selectedCondition: "all",
    });
    setIsOpened(false);
  };

  const state = [
    { key: "all", value: "Tous" },
    { key: "false", value: "Publiée" },
    { key: "true", value: "Brouillon" },
  ];

  const stock = [
    { key: "all", value: "Tous" },
    { key: "in", value: "En Stock" },
    { key: "out", value: "Rupture de Stock" },
  ];

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
        <Typography variant="h6" fontWeight="bold" mb={2.5}>
          Rechercher des Produits
        </Typography>
        <Box sx={{ display: "flex", gap: 2, flexDirection: isMobile ? "column" : "row" }}>
          <Controller
            name="searchQuery"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                variant="outlined"
                placeholder="Rechercher des produits"
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
            )}
          />
          <Chip
            icon={<FilterListIcon />}
            label={isOpened ? "Masquer les filtres" : "Afficher les filtres"}
            onClick={toggleFilter}
            color={isOpened ? "primary" : "default"}
            variant={isOpened ? "filled" : "outlined"}
            sx={{
              borderRadius: 2,
              height: 48,
              fontSize: '0.9rem',
              '& .MuiChip-icon': {
                fontSize: '1.4rem',
              },
            }}
          />
        </Box>

        <Collapse in={isOpened}>
          <Box sx={{ mt: 2.5 }}>
            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={4}>
                <Controller
                  name="selectedCategory"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Catégorie"
                      select
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          height: '48px',
                        }
                      }}
                    >
                      <MenuItem value="all">Toutes les catégories</MenuItem>
                      {categories.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.CategoryName}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Controller
                  name="selectedCondition"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Statut"
                      select
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          height: '48px',
                        }
                      }}
                    >
                      {state.map((option) => (
                        <MenuItem key={option.key} value={option.key}>
                          {option.value}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Controller
                  name="selectedStock"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Stock"
                      select
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          height: '48px',
                        }
                      }}
                    >
                      {stock.map((option) => (
                        <MenuItem key={option.key} value={option.key}>
                          {option.value}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>
            </Grid>
          </Box>
        </Collapse>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 2,
          p: 2.5,
          bgcolor: "grey.100",
          flexDirection: isMobile ? "column" : "row"
        }}
      >
        {isOpened && (
          <Button
            variant="soft"
            color="neutral"
            onClick={handleReset}
            startIcon={<CloseIcon />}
            fullWidth={isMobile}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              py: 1.25,
              height: '40px',
            }}
          >
            Réinitialiser
          </Button>
        )}
        <Button
          variant="solid"
          color="primary"
          onClick={handleSubmit(onSubmit)}
          startIcon={<SearchIcon />}
          fullWidth={isMobile}
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

export default ProductSearch;