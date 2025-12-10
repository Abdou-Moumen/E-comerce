import PropTypes from 'prop-types';
import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle,
    FormControl, Grid, InputLabel, MenuItem, Select, TextField,
    Typography, Box, Chip, IconButton, useTheme, useMediaQuery
} from "@mui/material";
import {styled} from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import OrderDataGrid from "./OrderDataGrid.jsx";

const StyledDialog = styled(Dialog)(({theme}) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(3),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(2),
    },
}));

const StyledDialogTitle = styled(DialogTitle)(({theme}) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    padding: theme.spacing(1, 2),
}));

const StyledTextField = styled(TextField)(({theme}) => ({
    marginBottom: theme.spacing(2),
}));

const StyledFormControl = styled(FormControl)(({theme}) => ({
    marginBottom: theme.spacing(2),
}));

const StyledChip = styled(Chip)(({theme}) => ({
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1),
}));

const StyledButton = styled(Button)(({theme}) => ({
    padding: `${theme.spacing(1)} ${theme.spacing(3)}`,
}));

const OrderEditDialog = ({
                             openEdit,
                             handleEditClose,
                             orderData,
                             setOrderData,
                             handleOrderDataChange,
                             handleIntegerChange,
                             handleNumericChange,
                             handleSaveEdit,
                             wilayas,
                             selectedWilaya,
                             handleWilayaChange,
                             communes,
                             selectedCommune,
                             handleCommuneChange,
                             categories,
                             selectedCategory,
                             handleCategoryChange,
                             colorsAndSizes,
                             setColorsAndSizes,
                             colorsAndSizesData,
                             selectedColor,
                             handleColorChange,
                             selectedSize,
                             handleSizeSize,
                             products,
                         }) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const onAddClick = () => {
        const id = orderData.length + 1;
        setOrderData((oldRows) => [...oldRows, {
            id,
            product_name: '',
            CategoryName: '',
            color_name: '',
            size: '',
            quantity: 0,
            product_price: 0,
            totalPriceOrderProduct: 0,
        }]);
    }

    return (
        <StyledDialog
            open={openEdit}
            onClose={handleEditClose}
            maxWidth="md"
            fullWidth
            fullScreen={fullScreen}
        >
            <StyledDialogTitle>
                Modifier la commande
                <IconButton edge="end" color="inherit" onClick={handleEditClose} aria-label="close">
                    <CloseIcon/>
                </IconButton>
            </StyledDialogTitle>
            <DialogContent>
                <Box mb={3}>
                    <Typography variant="h6" gutterBottom>Détails de la commande</Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <StyledTextField
                                label="Commande ID"
                                variant="outlined"
                                fullWidth
                                disabled
                                value={orderData?.id}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <StyledTextField
                                label="État"
                                select
                                fullWidth
                                value={orderData?.status}
                                onChange={(e) => handleOrderDataChange(0, 'status', e.target.value)}
                            >
                                <MenuItem value="pending">En attente</MenuItem>
                                <MenuItem value="confirmed">Confirmé</MenuItem>
                                <MenuItem value="cancelled">Annulé</MenuItem>
                            </StyledTextField>
                        </Grid>
                    </Grid>
                </Box>

                <Box mb={3}>
                    <Typography variant="h6" gutterBottom>Customer Information</Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <StyledTextField
                                label="Prénom"
                                fullWidth
                                value={orderData?.first_name}
                                onChange={(e) => handleOrderDataChange(0, 'first_name', e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <StyledTextField
                                label="Nom"
                                fullWidth
                                value={orderData?.last_name}
                                onChange={(e) => handleOrderDataChange(0, 'last_name', e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <StyledTextField
                                label="Téléphone 1"
                                fullWidth
                                value={orderData?.phone_1}
                                onChange={(e) => handleIntegerChange(0, 'phone_1', e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <StyledTextField
                                label="Téléphone 2"
                                fullWidth
                                value={orderData?.phone_2}
                                onChange={(e) => handleIntegerChange(0, 'phone_2', e.target.value)}
                            />
                        </Grid>
                    </Grid>
                </Box>

                <Box mb={3}>
                    <Typography variant="h6" gutterBottom>Address</Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <StyledFormControl fullWidth>
                                <InputLabel>Wilaya</InputLabel>
                                <Select
                                    value={selectedWilaya}
                                    onChange={handleWilayaChange}
                                    label="Wilaya"
                                >
                                    {wilayas.map((wilaya) => (
                                        <MenuItem key={wilaya} value={wilaya}>
                                            {wilaya}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </StyledFormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <StyledFormControl fullWidth>
                                <InputLabel>Commune</InputLabel>
                                <Select
                                    value={selectedCommune}
                                    onChange={handleCommuneChange}
                                    label="Commune"
                                >
                                    {communes.map((commune) => (
                                        <MenuItem key={commune} value={commune}>
                                            {commune}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </StyledFormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <StyledTextField
                                label="Adresse"
                                fullWidth
                                multiline
                                rows={2}
                                value={orderData?.adress}
                                onChange={(e) => handleOrderDataChange(0, 'adress', e.target.value)}
                            />
                        </Grid>
                    </Grid>
                </Box>

                <Box mb={3}>
                    <Typography variant="h6" gutterBottom>Items commandés</Typography>
                    <OrderDataGrid
                        orderData={orderData}
                        setOrderData={setOrderData}
                        colorsAndSizes={colorsAndSizes}
                        setColorsAndSizes={setColorsAndSizes}
                        colorsAndSizesData={colorsAndSizesData}
                        handleOrderDataChange={handleOrderDataChange}
                        products={products}
                    />
                </Box>

                <Box>
                    <Typography variant="h6" gutterBottom>Résumé de la commande</Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body1">Prix Total</Typography>
                            <Typography variant="h5" color="primary">
                                {orderData?.total_price?.toFixed(2)} DZD
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body1">Crée à</Typography>
                            <Typography variant="body2" color="textSecondary">
                                {new Date(orderData?.created_at).toLocaleString()}
                            </Typography>
                            <Typography variant="body1" mt={1}>Mis à jour à</Typography>
                            <Typography variant="body2" color="textSecondary">
                                {new Date(orderData?.updated_at).toLocaleString()}
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
            </DialogContent>
            <DialogActions>
                <StyledButton onClick={handleEditClose} variant="outlined" color="primary" size="large">
                    Annuler
                </StyledButton>
                <StyledButton onClick={handleSaveEdit} variant="contained" color="primary" size="large">
                    Enregistrer
                </StyledButton>
            </DialogActions>
        </StyledDialog>
    );
}

OrderEditDialog.propTypes = {
    openEdit: PropTypes.bool.isRequired,
    handleEditClose: PropTypes.func.isRequired,
    orderData: PropTypes.object.isRequired,
    setOrderData: PropTypes.func.isRequired,
    handleOrderDataChange: PropTypes.func.isRequired,
    handleIntegerChange: PropTypes.func.isRequired,
    handleNumericChange: PropTypes.func.isRequired,
    handleSaveEdit: PropTypes.func.isRequired,
    wilayas: PropTypes.array.isRequired,
    selectedWilaya: PropTypes.string.isRequired,
    handleWilayaChange: PropTypes.func.isRequired,
    communes: PropTypes.array.isRequired,
    selectedCommune: PropTypes.string.isRequired,
    handleCommuneChange: PropTypes.func.isRequired,
    categories: PropTypes.array.isRequired,
    selectedCategory: PropTypes.string.isRequired,
    handleCategoryChange: PropTypes.func.isRequired,
    // colorsAndSizesData: PropTypes.object.isRequired,
    selectedColor: PropTypes.string.isRequired,
    handleColorChange: PropTypes.func.isRequired,
    selectedSize: PropTypes.string.isRequired,
    handleSizeChange: PropTypes.func.isRequired,
};

export default OrderEditDialog;