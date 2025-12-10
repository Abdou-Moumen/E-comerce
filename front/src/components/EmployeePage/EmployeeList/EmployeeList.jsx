import React, { useState, useEffect, useCallback } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Paper, Box } from "@mui/material";
import EmployeeColumns from "./EmployeeColumns.jsx";
import { useGetEmployees } from "../../../Hooks/Employees/useEmployee.jsx";
import ConfirmDelete from "../../commun/ConfirmDelete.jsx"

const EmployeeList = ({ searchQuery }) => {
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [totalRows, setTotalRows] = useState(0);
  const [rows, setRows] = useState([]);

  const { data, isLoading, isError, refetch } = useGetEmployees(searchQuery, paginationModel.page + 1);

  useEffect(() => {
    if (data) {
      setRows(data.data || []);
      if (data.total_rows !== 0 || data.data.length === 0) {
        setTotalRows(data.total_rows);
      }
    }
  }, [data]);

  useEffect(() => {
    refetch();
  }, [searchQuery, paginationModel.page, refetch]);

  const handlePaginationModelChange = useCallback((newModel) => {
    setPaginationModel(newModel);
  }, []);

  const { columns, openDeleteConfirm, handleCloseDeleteConfirm, handleConfirmDelete } = EmployeeColumns();

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 4,
        overflow: "hidden",
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Box sx={{ height: 650, width: "100%", p: 2 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          paginationModel={paginationModel}
          onPaginationModelChange={handlePaginationModelChange}
          pageSizeOptions={[10]}
          paginationMode="server"
          rowCount={totalRows}
          loading={isLoading}
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

export default EmployeeList;