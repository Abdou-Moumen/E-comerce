import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Container, Paper, Stack } from "@mui/material";
import Breadcrumb from "../../../components/commun/BreadCrumb.jsx";
import ProductList from "../../../components/ProductPage/Product/ProductList.jsx";
import ProductSearch from "../../../components/ProductPage/Product/ProductSearch.jsx";
import ProductAction from "../../../components/ProductPage/Product/ProductActions.jsx";
import { useNotification } from "../../../Hooks/useNotify.js";

const ProductPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState({
    search: "all",
    category: "all",
    isDraft: "all",
    stock: "all",
  });


  const breadcrumb = [{ name: "Produits", path: "/admin/product" }];

  return (
    <Container maxWidth="xl">
      <Stack spacing={4}>
        <Breadcrumb
          breadcrumb={breadcrumb}
          navigate={navigate}
          PageTitle="Produits"
        />

        <Paper
          elevation={0}
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            border: "1px solid",
            borderColor: "divider"
          }}
        >
          <ProductSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </Paper>

        <Paper
          elevation={0}
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            border: "1px solid",
            borderColor: "divider"
          }}
        >
          <Box sx={{ p: 3 }}>
            <ProductAction />
          </Box>
          <Box sx={{ px: 3, pb: 3 }}>
            <ProductList searchQuery={{ searchQuery }} />
          </Box>
        </Paper>
      </Stack>
    </Container>
  );
};

export default ProductPage;