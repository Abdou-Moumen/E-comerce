import React from "react";
import FormAdd from "../../../components/ProductPage/AddProduct/FormAdd.jsx";
import Breadcrumb from "../../../components/commun/BreadCrumb.jsx";
import { Box } from "@mui/material";



const AddProduct = () => {
    const breadcrumb = [{ name: "Produits", path: "/admin/product" }, { name: "Ajouter", path: "/admin/product/add" }];

    return (
        <Box >
            <Breadcrumb breadcrumb={breadcrumb} PageTitle={"Ajouter Un Produit"} />
            <FormAdd />
        </Box>
    );
}

export default AddProduct;