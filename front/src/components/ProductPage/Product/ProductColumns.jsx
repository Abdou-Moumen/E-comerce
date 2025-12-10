import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  ErrorOutlineOutlined as ErrorOutlineOutlinedIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from "@mui/icons-material";
import { getCategoryColor, isColorDark } from "../../../utils/utils";
import { useDeleteProduct } from "../../../Hooks/Products/useProductPage";

const ProductColumns = () => {

  const [selectedId, setSelectedId] = useState(null);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const { mutate: deleteProduct, isSuccess, isError, error } = useDeleteProduct();

  useEffect(() => {
    if (isSuccess) {
      // Show a success notification
      console.log("Succès");
      handleCloseDeleteConfirm();
    }
    if (isError) {
      console.log("Erreur");
      // Show an error notification
    }
  }, [isSuccess, isError]);

  const handleDeleteClick = (id) => {
    setSelectedId(id); // Set the selected ID
    setOpenDeleteConfirm(true);
  };

  const handleCloseDeleteConfirm = () => {
    setOpenDeleteConfirm(false);
  };

  const handleConfirmDelete = () => {
    console.log(selectedId); // Use the selected ID here
    // deleteEmployee(selectedId);
    deleteProduct(selectedId);
  };;

  const handleMoreDetails = (id) => {
    navigate(`/admin/product/edit/${id}`);
  };




  const handleDelete = () => {
    console.log(`Deleting product with ID ${selectedId}`);
    handleMenuClose();
  };

  const formatPriceDZD = (price) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "DZD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const columns = [
    {
      field: "product_name",
      headerName: "Nom",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Typography variant="body2" noWrap>
          {params.value}
        </Typography>
      ),
    },
    {
      field: "CategoryName",
      headerName: "Catégorie",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => {
        const backgroundColor = getCategoryColor(params.value);
        const textColor = isColorDark(backgroundColor) ? "white" : "black";
        return (
          <Chip
            label={params.value}
            size={isMobile ? "small" : "medium"}
            sx={{
              backgroundColor,
              color: textColor,
              fontWeight: "bold",
              '&:hover': {
                backgroundColor: backgroundColor,
                opacity: 0.9,
              },
            }}
          />
        );
      },
    },
    {
      field: "Totalquantity",
      headerName: "Quantité",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <Typography
          variant="body2"
          color={params.value === 0 ? "error" : "textPrimary"}
          fontWeight={params.value === 0 ? "bold" : "normal"}
        >
          {params.value === 0 ? "Rupture" : params.value}
        </Typography>
      ),
    },
    {
      field: "price",
      headerName: "Prix",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <Typography variant="body2">
          {formatPriceDZD(params.value)}
        </Typography>
      ),
    },
    {
      field: "is_discounted",
      headerName: "Remisé",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <Chip
          label={params.value ? "Oui" : "Non"}
          color={params.value ? "success" : "error"}
          size={isMobile ? "small" : "medium"}
          variant="outlined"
        />
      ),
    },
    {
      field: "amount",
      headerName: "Remise",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.value ? `${params.value}` : "-"}
        </Typography>
      ),
    },
    {
      field: "is_drafted",
      headerName: "Statut",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <Chip
          icon={params.value ? <VisibilityOffIcon /> : <VisibilityIcon />}
          label={params.value ? "Brouillon" : "Publié"}
          color={params.value ? "warning" : "success"}
          size={isMobile ? "small" : "medium"}
          variant="outlined"
        />
      ),
    },
    {
      field: "action",
      headerName: "",
      sortable: false,
      filterable: false,
      flex: 0.5,
      minWidth: 100,
      renderCell: (params) => (
        <>
          <IconButton
            color="primary"
            onClick={() => handleMoreDetails(params.row.id)}
            size={isMobile ? "small" : "medium"}
          >
            <ErrorOutlineOutlinedIcon />
          </IconButton>
          <IconButton
            color="primary"
            onClick={(e) => {
              // setAnchorEl(e.currentTarget);
              setSelectedId(params.row.id);
            }}
            onClickCapture={() => handleDeleteClick(params.row.id)}
            size={isMobile ? "small" : "medium"}
          >
            <DeleteIcon
              sx={{ color: "red" }}
            />
          </IconButton>


        </>
      ),
    },
  ];

  return {
    columns, handleCloseDeleteConfirm,
    handleConfirmDelete, openDeleteConfirm,
  };
};

export default ProductColumns;