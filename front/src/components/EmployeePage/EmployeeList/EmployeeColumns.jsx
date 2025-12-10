import React, { useEffect, useState } from "react";
import {
  IconButton,
  Typography,
  Box,
  Tooltip,
  Avatar
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useNavigate, useParams } from "react-router-dom";
import { useDeleteEmployee } from '../../../Hooks/Employees/useEmployee.jsx';

const ProductColumns = () => {
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [showPassword, setShowPassword] = useState({});
  const { mutate: deleteEmployee, isSuccess, isError, error } = useDeleteEmployee();

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setOpenDeleteConfirm(true);
  };

  const handleCloseDeleteConfirm = () => {
    setOpenDeleteConfirm(false);
  };

  const handleConfirmDelete = () => {
    console.log(selectedId);
    deleteEmployee(selectedId);
  };

  const togglePasswordVisibility = (id) => {
    setShowPassword(prev => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    if (isSuccess) {
      console.log("Succès");
      handleCloseDeleteConfirm();
    }
    if (isError) {
      console.log("Erreur");
    }
  }, [isSuccess, isError]);

  const columns = [
    {
      field: "avatar",
      headerName: "",
      width: 80,
      renderCell: (params) => (
        <Avatar
          src={params.value}
          alt={`${params.row.first_name} ${params.row.last_name}`}
        />
      ),
    },
    {
      field: "first_name",
      headerName: "Nom",
      width: 150,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight="medium">
          {params.value}
        </Typography>
      ),
    },
    {
      field: "last_name",
      headerName: "Prénom",
      width: 150,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight="medium">
          {params.value}
        </Typography>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      width: 220,
      renderCell: (params) => (
        <Typography variant="body2" color="text.secondary">
          {params.value}
        </Typography>
      ),
    },
    {
      field: "password",
      headerName: "Mot de passe",
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2">
            {showPassword[params.id] ? params.value : '••••••••'}
          </Typography>
          <IconButton
            size="small"
            onClick={() => togglePasswordVisibility(params.id)}
            sx={{ ml: 1 }}
          >
            {showPassword[params.id] ? <VisibilityOffIcon /> : <VisibilityIcon />}
          </IconButton>
        </Box>
      ),
    },
    {
      field: "action",
      headerName: "Actions",
      sortable: false,
      filterable: false,
      width: 120,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>

          <Tooltip title="Supprimer">
            <IconButton
              size="small"
              color="error"
              onClick={() => handleDeleteClick(params.id)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return { columns, openDeleteConfirm, handleCloseDeleteConfirm, handleConfirmDelete };
};

export default ProductColumns;