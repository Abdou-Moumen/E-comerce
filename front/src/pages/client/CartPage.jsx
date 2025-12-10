import {useState, useMemo, useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import {
    Typography, Button, Grid, IconButton, Container, Snackbar,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Box,
    Select, MenuItem, FormControl, InputLabel
} from "@mui/material";
import {styled} from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';

import Header from "../../components/header/Header.jsx";
import {useForm} from '../../Hooks/useForm';
import {useCart} from '../../Hooks/useCart';
import {useCreateOrder} from '../../Hooks/Client/useCreateOrder.jsx';
import data from "../../assets/algeria_cities.json";

const MainContainer = styled('div')(({theme}) => ({
    backgroundColor: '#ffffff',
    minHeight: '100vh',
}));

const ContentContainer = styled(Container)(({theme}) => ({
    maxWidth: '1200px',
    margin: '0 auto',
    padding: theme.spacing(4),
}));

const SectionContainer = styled(Box)(({theme}) => ({
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
    boxShadow: '0 1px 6px rgba(0, 0, 0, 0.1)',
}));

const ProductImage = styled('img')({
    width: 80,
    height: 80,
    objectFit: 'cover',
    borderRadius: '8px',
});

const StyledTableCell = styled(TableCell)(({theme}) => ({
    borderBottom: 'none',
    padding: theme.spacing(2, 1),
}));

const StyledButton = styled(Button)(({theme}) => ({
    borderRadius: '32px',
    padding: theme.spacing(1, 3),
    fontWeight: 600,
    backgroundColor: '#FC6C8D',
    color: '#ffffff',
    '&:hover': {
        backgroundColor: '#e55c7b',
    },
}));

const Cart = () => {
    const navigate = useNavigate();
    const {cartItems, removeFromCart, updateQuantity, clearCart} = useCart();
    const {form, setForm, handleInputChange, validateForm, resetForm, setFormValues} = useForm({
        firstName: '',
        lastName: '',
        phone1: '',
        phone2: '',
        wilaya: '',
        common: '',
        adress: ''
    });

    const [citiesData, setCitiesData] = useState([]);
    const [wilayas, setWilayas] = useState([]);
    const [communes, setCommunes] = useState([]);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [itemToRemove, setItemToRemove] = useState(null);

    const {mutate: createOrder, isLoading} = useCreateOrder();

    useEffect(() => {
        setCitiesData(data);
        const uniqueWilayas = [...new Set(data.map(item => item.wilaya_name_ascii))];
        setWilayas(uniqueWilayas);
    }, []);

    /*useEffect(() => {
        if (form.wilaya) {
            const filteredCommunes = citiesData
                .filter(item => item.wilaya_name_ascii === form.wilaya)
                .map(item => item.commune_name_ascii);
            setCommunes(filteredCommunes);
            setFormValues({common: ''});
        }
    }, [form.wilaya, citiesData, setFormValues]);*/

    const handleWilayaChange = (e) => {
        setForm({
            ...form,
            wilaya: e.target.value,
            common: ''
        });
        const filteredCommunes = citiesData
            .filter(item => item.wilaya_name_ascii === e.target.value)
            .map(item => item.commune_name_ascii);
        setCommunes(filteredCommunes);
        setFormValues({common: ''});
    }

    const handleGoBack = () => navigate(-1);

    const handleRemoveFromCart = (index) => {
        setItemToRemove(index);
        setDialogOpen(true);
    };

    const confirmRemoveFromCart = () => {
        removeFromCart(itemToRemove);
        setSnackbarMessage('Product removed from cart');
        setSnackbarOpen(true);
        setDialogOpen(false);
    };

    const handleQuantityChange = (index, delta) => {
        updateQuantity(index, delta);
    };

    const calculateTotalPrice = useMemo(() => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    }, [cartItems]);

    const livrantPrice = 500;
    const totalPrice = calculateTotalPrice + livrantPrice;

    const handleFormSubmit = (e) => {
        e.preventDefault();
        console.log(form.wilaya)
        console.log(form.common)
        if (validateForm()) {
            const orderData = {
                wilaya: form.wilaya,
                common: form.common,
                adress: form.adress,
                first_name: form.firstName,
                last_name: form.lastName,
                phone_1: form.phone1,
                phone_2: form.phone2 || null,
                product_orders: cartItems.map(item => ({
                    product_id: item.id,
                    size_id: item.sizeId,
                    product_color_id: item.colorId,
                    quantity: item.quantity
                }))
            };

            createOrder(orderData, {
                onSuccess: () => {
                    clearCart();
                    resetForm();
                    navigate('/orderCompleted');
                },
                onError: (error) => {
                    setSnackbarMessage(error.message || 'An error occurred while placing the order');
                    setSnackbarOpen(true);
                }
            });
        } else {
            setSnackbarMessage('Please fill all required fields');
            setSnackbarOpen(true);
        }
    };

    return (
        <MainContainer>
            <Header role={"client"}/>
            <ContentContainer>
                <Box display="flex" alignItems="center" mb={4}>
                    <IconButton onClick={handleGoBack} sx={{mr: 2}} aria-label="Go back">
                        <ArrowBackIcon/>
                    </IconButton>
                    <Typography variant="h4" component="h1" fontWeight="bold">Votre panier</Typography>
                </Box>

                {cartItems.length === 0 ? (
                    <Typography variant="h5" align="center">
                        Votre panier est vide
                    </Typography>
                ) : (
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={8}>
                            <SectionContainer>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <StyledTableCell>Product</StyledTableCell>
                                                <StyledTableCell align="right">Prix</StyledTableCell>
                                                <StyledTableCell align="right">Quantité</StyledTableCell>
                                                <StyledTableCell align="right">sous-total</StyledTableCell>
                                                <StyledTableCell></StyledTableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {cartItems.map((item, index) => (
                                                <TableRow key={index}>
                                                    <StyledTableCell>
                                                        <Box display="flex" alignItems="center">
                                                            <ProductImage src={item.mainImage} alt={item.name}/>
                                                            <Typography
                                                                sx={{ml: 2, fontWeight: 500}}>{item.name}</Typography>
                                                        </Box>
                                                    </StyledTableCell>
                                                    <StyledTableCell align="right">{item.price} DZD</StyledTableCell>
                                                    <StyledTableCell align="right">
                                                        <Box display="flex" alignItems="center"
                                                             justifyContent="flex-end">
                                                            <IconButton onClick={() => handleQuantityChange(index, -1)}
                                                                        sx={{'&:hover': {backgroundColor: 'transparent'}}}
                                                                        size="small">
                                                                <RemoveIcon/>
                                                            </IconButton>
                                                            <Typography sx={{
                                                                mx: 1,
                                                                fontWeight: 500
                                                            }}>{item.quantity}</Typography>
                                                            <IconButton onClick={() => handleQuantityChange(index, 1)}
                                                                        sx={{'&:hover': {backgroundColor: 'transparent'}}}
                                                                        size="small">
                                                                <AddIcon/>
                                                            </IconButton>
                                                        </Box>
                                                    </StyledTableCell>
                                                    <StyledTableCell align="right"
                                                                     sx={{fontWeight: 500}}>{item.price * item.quantity} DZD</StyledTableCell>
                                                    <StyledTableCell>
                                                        <IconButton onClick={() => handleRemoveFromCart(index)}
                                                                    sx={{
                                                                        color: '#3C3C43',
                                                                        '&:hover': {backgroundColor: 'transparent'}
                                                                    }}>
                                                            <DeleteIcon/>
                                                        </IconButton>
                                                    </StyledTableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </SectionContainer>

                            <SectionContainer>
                                <Typography variant="h6" gutterBottom fontWeight="bold">Informations sur la livraison</Typography>
                                <form onSubmit={handleFormSubmit}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <TextField label="Prénom" name="firstName" value={form.firstName}
                                                       onChange={handleInputChange} fullWidth required
                                                       InputProps={{
                                                           sx: {
                                                               borderRadius: 2,
                                                           },
                                                       }}/>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField label="Nom" name="lastName" value={form.lastName}
                                                       onChange={handleInputChange} fullWidth required
                                                       InputProps={{
                                                           sx: {
                                                               borderRadius: 2,
                                                           },
                                                       }}/>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField label="Téléphone 1" name="phone1" value={form.phone1}
                                                       onChange={handleInputChange} fullWidth required
                                                       InputProps={{
                                                           sx: {
                                                               borderRadius: 2,
                                                           },
                                                       }}/>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField label="Téléphone 2" name="phone2" value={form.phone2}
                                                       onChange={handleInputChange} fullWidth
                                                       InputProps={{
                                                           sx: {
                                                               borderRadius: 2,
                                                           },
                                                       }}/>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <FormControl fullWidth>
                                                <InputLabel>Wilaya</InputLabel>
                                                <Select
                                                    sx={{borderRadius: "8px"}}
                                                    name="wilaya"
                                                    value={form.wilaya}
                                                    onChange={handleWilayaChange}
                                                    required
                                                >
                                                    {wilayas.map((wilaya, index) => (
                                                        <MenuItem key={index} value={wilaya}>
                                                            {wilaya}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <FormControl fullWidth>
                                                <InputLabel>Commune</InputLabel>
                                                <Select
                                                    sx={{borderRadius: "8px"}}
                                                    name="common"
                                                    value={form.common}
                                                    onChange={handleInputChange}
                                                    required
                                                >
                                                    {communes.map((common, index) => (
                                                        <MenuItem key={index} value={common}>
                                                            {common}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField label="Adresse" name="adress" value={form.adress}
                                                       onChange={handleInputChange} fullWidth required
                                                       InputProps={{
                                                           sx: {
                                                               borderRadius: 2,
                                                           },
                                                       }}/>
                                        </Grid>
                                    </Grid>
                                    <Box mt={3} textAlign="right">
                                        <StyledButton type="submit" disabled={isLoading}>
                                            {isLoading ? 'Passer une commande...' : 'Passer la commande'}
                                        </StyledButton>
                                    </Box>
                                </form>
                            </SectionContainer>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <SectionContainer>
                                <Typography variant="h6" gutterBottom fontWeight="bold">Résumé de la commande</Typography>
                                <Typography variant="body1">sous-total: {calculateTotalPrice} DZD</Typography>
                                <Typography variant="body1">livraison: {livrantPrice} DZD</Typography>
                                <Typography variant="h6" gutterBottom fontWeight="bold" mt={2}>
                                    Total: {totalPrice} DZD
                                </Typography>
                            </SectionContainer>
                        </Grid>
                    </Grid>
                )}

                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={6000}
                    onClose={() => setSnackbarOpen(false)}
                    message={snackbarMessage}
                    action={
                        <IconButton size="small" aria-label="close" color="inherit"
                                    onClick={() => setSnackbarOpen(false)}>
                            <CloseIcon fontSize="small"/>
                        </IconButton>
                    }
                />

                <Dialog
                    open={dialogOpen}
                    onClose={() => setDialogOpen(false)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Remove Product"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Are you sure you want to remove this product from your cart?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDialogOpen(false)} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={confirmRemoveFromCart} color="primary" autoFocus>
                            Remove
                        </Button>
                    </DialogActions>
                </Dialog>
            </ContentContainer>
        </MainContainer>
    );
};

export default Cart;
