import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import {
    TextField, Switch, FormControlLabel, Box, Button,
    MenuItem, Alert, Grid, CircularProgress, Checkbox,
    Typography, Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import BackButton from "../../commun/BackButton";
import { useGetCategery } from "../../../Hooks/Products/useCategory";
import { useGetProduct, useUpdateProduct } from "../../../Hooks/Products/useProductPage";
import TableProductQuantity from "./TableProductQuantity";
import ImageUpload from "./ImageUpload";
import AddCategory from "../Commun/AddCategory";
import { base64ToFile } from "../../../utils/utils";
//invalidates the query cache for the given query key
import { useQueryClient } from "@tanstack/react-query";

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

const FormEdit = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { id } = useParams();
    const { control, handleSubmit, formState: { errors }, watch, setValue, reset } = useForm();
    const [error, setError] = useState("");
    const [selectedImages, setSelectedImages] = useState([]);
    const [variation, setVariation] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isReadOnly, setIsReadOnly] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const { data: categoryData, isLoading: isLoadingCategories, isError: isCategoryError } = useGetCategery();
    const { data: productData, isLoading: isLoadingProduct, isError: isErrorProduct } = useGetProduct(id);
    const { mutate, isSuccess, isError: isErrorUpdate } = useUpdateProduct();

    const isDiscounted = watch('isDiscounted', false);
    const isDrafted = watch('isDrafted', false);
    const price = watch('price', 0);
    const discountPercentage = watch('discountPercentage', 0);
    const discountPrice = watch('discountPrice', 0);

    const resetForm = () => {
        reset({
            name: "",
            category: "",
            price: "",
            description: "",
            isDiscounted: false,
            discountPercentage: "",
            discountPrice: "",
            isDrafted: false
        });
        setSelectedImages([]);
        setVariation([]);
        setError("");
        setErrorMessage(null);
    };

    useEffect(() => {
        setIsLoading(true);
        resetForm();
        return () => {
            resetForm();
            queryClient.removeQueries(['product', id]);
        };
    }, [id]);

    useEffect(() => {
        if (isCategoryError) {
            setError("Une erreur s'est produite lors de la récupération des catégories");
        } else if (categoryData && !isLoadingCategories) {
            setCategories(categoryData.data || []);
        }
    }, [isCategoryError, categoryData, isLoadingCategories]);

    useEffect(() => {
        if (productData && !isLoadingProduct) {
            setVariation(productData.data.quantities);
            setSelectedImages(productData.data.images.map((url) => base64ToFile(url.base64, url.filename, url.filetype)));

            reset({
                name: productData.data.product_name,
                category: productData.data.category_id,
                price: productData.data.price,
                description: productData.data.description,
                isDiscounted: productData.data.is_discounted,
                discountPercentage: productData.data.discount_percentage,
                discountPrice: productData.data.discount_amount,
                isDrafted: productData.data.is_drafted
            });
            setIsLoading(false);
        }
    }, [productData, isLoadingProduct, reset]);

    useEffect(() => {
        if (isSuccess) {
            navigate(-1);
        } else if (isErrorUpdate) {
            setError("Une erreur s'est produite lors de la mise à jour du produit");
        }
    }, [isSuccess, isErrorUpdate, navigate]);

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

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const onSubmit = async (formData) => {
        const productData = {
            ...formData,
            id: id,
            images: selectedImages,
            category_Id: formData.category,
            quantities: variation.map((item) => ({
                product_color_id: item.color?.id || null,
                size_id: item.size?.id || null,
                quantity: item.quantity,
                flag: item.flag
            }))
        };
        mutate(productData);
    };

    if (isLoading || isLoadingProduct || isLoadingCategories) {
        return (
            <Box sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                maxWidth: 800,
                margin: '0 auto',
                padding: 4,
                backgroundColor: '#ffffff',
                borderRadius: 3,
                height: "90vh",
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}>
                <CircularProgress />
            </Box>
        );
    }

    if (isErrorProduct) {
        return (
            <Box sx={{
                maxWidth: 800,
                margin: '0 auto',
                padding: 4,
                backgroundColor: '#ffffff',
                borderRadius: 3,
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}>
                <Typography variant="h6" color="error">Error loading product data</Typography>
                <Button variant="contained" onClick={() => navigate(-1)}>Go Back</Button>
            </Box>
        );
    }

    return (
        <FormContainer component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Box sx={{
                display: 'flex', justifyContent: 'space-between'
                , alignItems: 'center', justifyItems: 'center'


            }}>
                <BackButton navigate={navigate} />
                <FormControlLabel
                    control={<Switch checked={!isReadOnly}
                        size="small"
                        onChange={() => {
                            setIsReadOnly(!isReadOnly);

                        }} />}
                    label="Activer l'édition"

                />
            </Box>
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
                                disabled={isReadOnly}
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
                                disabled={isReadOnly}
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
                                disabled={isReadOnly}
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
                                disabled={isReadOnly}
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
                        checked={isDiscounted}
                        defaultValue={false}
                        render={({ field }) => (
                            <FormControlLabel
                                control={<Switch {...field} disabled={isReadOnly} />}
                                label="Remisé"
                                checked={field.value}
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
                                        disabled={isReadOnly}
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
                                        disabled={isReadOnly}
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
            <TableProductQuantity rows={variation} setRows={setVariation} isReadOnly={isReadOnly}
                errorMessage={errorMessage} setErrorMessage={setErrorMessage}
            />

            <StyledDivider />

            <SectionTitle>Images du produit</SectionTitle>
            <ImageUpload selectedImages={selectedImages}
                setSelectedImages={setSelectedImages}
                isReadOnly={isReadOnly}
            />

            <StyledDivider />

            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Controller
                        name="isDrafted"
                        control={control}
                        defaultValue={isDrafted}
                        render={({ field }) => (
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        {...field}
                                        checked={field.value}
                                        onChange={(e) => field.onChange(e.target.checked)}
                                    />
                                }
                                label="Brouillon"
                                disabled={isReadOnly}
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: "10px" }}>
                        {!isReadOnly && (
                            <>
                                <StyledButton
                                    variant="outlined"

                                    onClick={() => reset()}
                                >
                                    Réinitialiser
                                </StyledButton>
                                <StyledButton
                                    type="submit"
                                    variant="contained"
                                    color="primary"

                                >

                                    Enregistrer
                                </StyledButton>
                            </>
                        )}
                        {isReadOnly && <StyledButton variant="outlined"
                            color="error" onClick={() => navigate(-1)}>
                            Annuler
                        </StyledButton>}
                    </Box>
                </Grid>
            </Grid>

            <AddCategory open={open} handleClose={handleClose} />



        </FormContainer>
    );
};

export default FormEdit;
