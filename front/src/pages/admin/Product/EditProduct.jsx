import React from "react";
import FormEdit from "../../../components/ProductPage/EditProduct/FormEdit.jsx";
import Breadcrumb from "../../../components/commun/BreadCrumb.jsx";
import { Box } from "@mui/material";



const AddProduct = () => {
    const breadcrumb = [{ name: "Produits", path: "/admin/product" }, { name: "Edit" }];

    return (
        <Box >
            <Breadcrumb breadcrumb={breadcrumb} PageTitle={"Ajouter Un Produit"} />
            <FormEdit />
        </Box>
    );
}

export default AddProduct;