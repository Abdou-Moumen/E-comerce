import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import {
    TextField, Switch, FormControlLabel, Box, Button,
    MenuItem, Alert, Grid, CircularProgress, Checkbox,
    Typography, Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';

import TableProductQuantity from "./TableProductQuantity";
import ImageUpload from "./ImageUpload";
import BackButton from "../../commun/BackButton";
import AddCategory from "./AddCategory";
import { useGetCategery } from "../../../Hooks/Products/useCategory";
import { useAddProduct } from "../../../Hooks/Products/useProductPage";

const FormContainer = styled(Box)(({ theme }) => ({
    maxWidth: 800,
    margin: '0 auto',
    padding: theme.spacing(4),
    backgroundColor: '#ffffff',
    borderRadius: theme.shape.borderRadius,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
    fontSize: '1.2rem',
    fontWeight: 600,
    marginBottom: theme.spacing(2),
    color: theme.palette.primary.main,
}));

const StyledDivider = styled(Divider)(({ theme }) => ({
    margin: `${theme.spacing(3)} 0`,
}));

const StyledButton = styled(Button)(({ theme }) => ({
    padding: `${theme.spacing(1)} ${theme.spacing(3)}`,
}));

const FormAdd = () => {
    const navigate = useNavigate();
    const { control, handleSubmit, formState: { errors }, watch, setValue, reset } = useForm();
    const [error, setError] = useState("");
    const [selectedImages, setSelectedImages] = useState([]);
    const isDiscounted = watch('isDiscounted', false);
    const isDrafted = watch('isDrafted', false);
    const [open, setOpen] = useState(false);
    const [variation, setVariation] = useState([]);
    const [categories, setCategories] = useState([]);
    const [imageError, setImageError] = useState(false);
    const [variationError, setVariationError] = useState(false);




    const { data, isLoading, isError } = useGetCategery();
    const { mutate, isSuccess, isError: isErroAdd } = useAddProduct();

    const price = watch('price', 0);
    const discountPercentage = watch('discountPercentage', 0);
    const discountPrice = watch('discountPrice', 0);

    useEffect(() => {
        console.log("Variation:", variation);
    }, [variation]);

    useEffect(() => {
        if (isError) {
            setError("Une erreur s'est produite lors de la récupération des catégories");
        } else if (data) {
            setCategories(data.data || []);
        } else {
            setCategories([]);
        }
    }, [isError, data]);
    useEffect(() => {
        if (isSuccess) {
            navigate('/admin/product');
        }
        else if (isErroAdd) {
            setError("Une erreur s'est produite lors de l'ajout du produit");
        }
    }, [isSuccess, isErroAdd, navigate]);
    useEffect(() => {
        if (isDiscounted && price) {
            if (discountPercentage && !discountPrice) {
                const calculatedDiscountPrice = price * (1 - discountPercentage / 100);
                setValue('discountPrice', calculatedDiscountPrice.toFixed(2));
            } else if (discountPrice && !discountPercentage) {
                const calculatedDiscountPercentage = ((price - discountPrice) / price) * 100;
                setValue('discountPercentage', calculatedDiscountPercentage.toFixed(2));
            }
        }
    }, [isDiscounted, price, discountPercentage, discountPrice, setValue]);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const onSubmit = async (formData) => {
        if (variation.length === 0) {
            setVariationError(true);
            return;
        }
        if (selectedImages.length === 0) {
            setImageError(true);
            return;
        }

        if (!imageError || !variationError) {
            const productData = {
                ...formData,
                images: selectedImages,
                category_Id: formData.category,
                quantities: variation.map((item) => ({
                    product_color_id: item.color?.id || null,
                    size_id: item.size?.id || null,
                    quantity: item.quantity
                }))
            };
            console.log("Données du produit :", productData);
            mutate(productData);
        }
    };

    if (isLoading) {
        return (
            <Box sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "90vh"
            }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <FormContainer component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <BackButton navigate={navigate} />
            {error && <Alert severity="error" sx={{ marginBottom: 2 }}>{error}</Alert>}

            <SectionTitle>Informations de base</SectionTitle>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <Controller
                        name="name"
                        control={control}
                        defaultValue=""
                        rules={{
                            required: 'Le nom est requis',
                            minLength: { value: 3, message: 'Le nom doit contenir au moins 3 caractères' },
                            maxLength: { value: 50, message: 'Le nom ne doit pas dépasser 50 caractères' }
                        }}
                        render={({ field }) => (
                            <TextField
                                label="Nom"
                                fullWidth
                                error={Boolean(errors.name)}
                                helperText={errors.name?.message}
                                {...field}
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Controller
                        name="category"
                        control={control}
                        defaultValue=""
                        rules={{ required: 'La catégorie est requise' }}
                        render={({ field }) => (
                            <TextField
                                label="Catégorie"
                                select
                                fullWidth
                                error={Boolean(errors.category)}
                                helperText={errors.category?.message}
                                {...field}
                            >
                                {categories.length > 0 ? (
                                    categories.map((category) => (
                                        <MenuItem key={category.id} value={category.id}>
                                            {category.CategoryName}
                                        </MenuItem>
                                    ))
                                ) : (
                                    <MenuItem disabled>Aucune catégorie disponible</MenuItem>
                                )}
                            </TextField>
                        )}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Controller
                        name="price"
                        control={control}
                        defaultValue=""
                        rules={{
                            required: 'Le prix est requis',
                            pattern: {
                                value: /^\d+(\.\d{1,2})?$/,
                                message: 'Format de prix invalide'
                            },
                            min: { value: 0.01, message: 'Le prix doit être supérieur à 0' },
                            max: { value: 9999999.99, message: 'Le prix ne doit pas dépasser 9 999 999,99' }
                        }}
                        render={({ field }) => (
                            <TextField
                                label="Prix"
                                fullWidth
                                error={Boolean(errors.price)}
                                helperText={errors.price?.message}
                                {...field}
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <StyledButton onClick={handleOpen} variant="outlined" fullWidth>
                        Ajouter une catégorie
                    </StyledButton>
                </Grid>
                <Grid item xs={12}>
                    <Controller
                        name="description"
                        control={control}
                        defaultValue=""
                        rules={{
                            required: 'La description est requise',
                            minLength: { value: 10, message: 'La description doit contenir au moins 10 caractères' },
                            maxLength: { value: 1000, message: 'La description ne doit pas dépasser 1000 caractères' }
                        }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Description"
                                placeholder="Entrer la description"
                                multiline
                                rows={4}
                                fullWidth
                                error={!!errors.description}
                                helperText={errors.description?.message}
                            />
                        )}
                    />
                </Grid>
            </Grid>

            <StyledDivider />

            <SectionTitle>Remise</SectionTitle>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Controller
                        name="isDiscounted"
                        control={control}
                        defaultValue={false}
                        render={({ field }) => (
                            <FormControlLabel
                                control={<Switch {...field} />}
                                label="Remisé"
                            />
                        )}
                    />
                </Grid>
                {isDiscounted && (
                    <>
                        <Grid item xs={12} sm={4}>
                            <Controller
                                name="discountPercentage"
                                control={control}
                                defaultValue=""
                                rules={{
                                    min: { value: 0, message: 'La remise doit être positive' },
                                    max: { value: 100, message: 'La remise ne doit pas dépasser 100%' }
                                }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Pourcentage de remise (%)"
                                        type="number"
                                        fullWidth
                                        error={!!errors.discountPercentage}
                                        helperText={errors.discountPercentage?.message}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            setValue('discountPrice', '');
                                        }}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Controller
                                name="discountPrice"
                                control={control}
                                defaultValue=""
                                rules={{
                                    min: { value: 0, message: 'Le prix remisé doit être positif' },
                                    max: { value: parseFloat(price) - 0.01, message: 'Le prix remisé doit être inférieur au prix original' }
                                }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Prix remisé"
                                        type="number"
                                        fullWidth
                                        error={!!errors.discountPrice}
                                        helperText={errors.discountPrice?.message}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            setValue('discountPercentage', '');
                                        }}
                                    />
                                )}
                            />
                        </Grid>

                    </>
                )}
            </Grid>

            <StyledDivider />

            <SectionTitle>Quantités et variations</SectionTitle>
            {variationError && <Alert severity="error" sx={{ marginBottom: 2 }}>Veuillez ajouter au moins une variation</Alert>}
            <TableProductQuantity rows={variation} setRows={setVariation} setVariationError={setVariationError} />

            <StyledDivider />

            <SectionTitle>Images du produit</SectionTitle>
            {imageError && <Alert severity="error" sx={{ marginBottom: 2 }}>Veuillez télécharger au moins une image</Alert>}
            <ImageUpload
                selectedImages={selectedImages}
                setSelectedImages={setSelectedImages}

            />


            <StyledDivider />

            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Controller
                        name="isDrafted"
                        control={control}
                        defaultValue={false}
                        render={({ field }) => (
                            <FormControlLabel
                                control={<Checkbox {...field} />}
                                label="Brouillon"
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: "10px" }}>

                        <StyledButton
                            variant="outlined"
                            size="large"
                            onClick={() => reset()}
                        >
                            Réinitialiser
                        </StyledButton>
                        <StyledButton
                            type="submit"
                            variant="contained"
                            color="primary"
                            size="large"
                        >
                            Ajouter le produit
                        </StyledButton>
                    </Box>
                </Grid>
            </Grid>

            <AddCategory open={open} handleClose={handleClose} />

        </FormContainer>
    );
};

export default FormAdd;