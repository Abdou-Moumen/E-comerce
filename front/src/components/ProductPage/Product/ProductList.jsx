import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Paper } from "@mui/material";
import ProductColumns from "./ProductColumns.jsx";
import ConfirmDelete from "../../commun/ConfirmDelete.jsx"
import { useGetProducts } from "../../../Hooks/Products/useProductPage.js";

const ProductList = ({ searchQuery }) => {
  const [rows, setRows] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const { data, isLoading, isError, refetch } = useGetProducts(searchQuery, paginationModel.page + 1);
  console.log("Searched Data", searchQuery)
  useEffect(() => {
    if (data) {
      setRows(data.data || []);
      console.log("Data  dfd:", rows)
      if (data.total_rows !== 0 || data.data.length === 0) {
        setTotalRows(data.total_rows);
      }
    }
  }, [data]);
  useEffect(() => {
    refetch();
  }, [searchQuery, paginationModel.page, refetch]);
  const handlePaginationModelChange = (newModel) => {
    setPaginationModel(newModel);
  }
  const { columns,
    handleCloseDeleteConfirm,
    handleConfirmDelete, openDeleteConfirm, } =
    ProductColumns();

  return (
    <Paper elevation={0} sx={{
      borderRadius: 4,
      overflow: "hidden",
      border: "1px solid",
      borderColor: "divider",
    }}>
      <Box sx={{ height: 650, width: "100%", p: 2 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          paginationModel={paginationModel}
          onPaginationModelChange={handlePaginationModelChange}
          loading={isLoading}
          rowCount={totalRows}
          paginationMode="server"
          pageSizeOptions={[10]}
          disableRowSelectionOnClick
          sx={{
            border: 'none',
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: (theme) => theme.palette.background.default,
              color: (theme) => theme.palette.text.secondary,
              fontSize: '0.875rem',
              fontWeight: 'bold',
            },
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid',
              borderColor: 'divider',
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: (theme) => theme.palette.action.hover,
            },
          }}
        />
      </Box>
      <ConfirmDelete
        open={openDeleteConfirm}
        handleClose={handleCloseDeleteConfirm}
        handleConfirm={handleConfirmDelete}
      />
    </Paper>
  );
};

export default ProductList;