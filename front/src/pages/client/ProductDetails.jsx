import {useState, useEffect, useRef} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {
    Typography, Button, Grid, Select, MenuItem, Snackbar, IconButton, Container, useMediaQuery,
    Box, CircularProgress, FormControl, InputLabel, Alert
} from "@mui/material";
import {styled, useTheme} from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
//import SwipeableViews from 'react-swipeable-views';

import Header from "../../components/header/Header.jsx";
import {useGetProductDetailsClient} from "../../Hooks/Client/useGetProductDetailsClient.jsx";

const MainContainer = styled('div')(({theme}) => ({
    backgroundColor: '#ffffff',
    minHeight: '100vh',
}));

const ContentContainer = styled(Container)(({theme}) => ({
    maxWidth: '1200px',
    margin: '0 auto',
}));

const SectionContainer = styled(Box)(({theme}) => ({
    backgroundColor: '#ffffff',
    borderRadius: '4px',
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
}));

const SectionContainer2 = styled(Box)(({theme}) => ({
    display: 'flex',
    backgroundColor: '#ffffff',
    borderRadius: '4px',
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
}));

const ProductImage = styled('img')({
    width: '80%',
    height: 'auto',
    objectFit: 'cover',
    borderRadius: '2px',
    '@media (max-width: 600px)': {
        width: '75%',
    },
});

const StyledButton = styled(Button)(({theme}) => ({
    borderRadius: '2px',
    padding: theme.spacing(1, 3),
    fontWeight: 600,
}));

const ThumbnailContainer = styled(Box)(({theme}) => ({
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    maxHeight: '100%', // Adjust based on your layout
    gap: theme.spacing(1),
    marginRight: theme.spacing(0.5),
}));

/*const ThumbnailImage = styled('img')(({theme, isSelected}) => ({
    width: '77px',
    height: '77px',
    objectFit: 'cover',
    borderRadius: '2px',
    cursor: 'pointer',
    border: isSelected ? `2px solid ${theme.palette.primary.main}` : 'none',
    '&:hover': {
        opacity: 0.8,
    },
    '@media (max-width: 600px)': {
        width: '66px',
        height: '66px',
    },
}));*/

const ColorSquare = ({color, selected, onClick}) => (
    <Box
        onClick={onClick}
        sx={{
            width: 28,
            height: 28,
            backgroundColor: color,
            cursor: 'pointer',
            border: selected ? '1px solid #000' : '1px solid #ccc',
            mr: 1,
            mb: 1,
            position: 'relative',
            borderRadius: '4px',
        }}
    />
);

const SwipeableGallery = styled('div')({
    width: '100%',
    overflow: 'hidden',
    position: 'relative',
});

const GalleryWrapper = styled('div')({
    display: 'flex',
    transition: 'transform 0.3s ease-out',
});

const GalleryImage = styled('img')({
    width: '100%',
    flexShrink: 0,
    objectFit: 'cover',
});

const MainImageContainer = styled(Box)(({theme}) => ({
    width: '100%',
    height: 'auto',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
}));

const MainImage = styled('img')(({theme}) => ({
    width: '100%',
    height: 'auto',
    objectFit: 'contain',
    [theme.breakpoints.down('sm')]: {
        maxHeight: '500px',
    },
}));

const ThumbnailScroll = styled(Box)(({theme}) => ({
    display: 'flex',
    overflowX: 'auto',
    width: '100%',
    margin: '0 auto',
    padding: theme.spacing(1),
    '&::-webkit-scrollbar': {
        height: '6px',
    },
    '&::-webkit-scrollbar-thumb': {
        backgroundColor: 'rgba(0,0,0,.2)',
        borderRadius: '3px',
    },
}));

const ThumbnailImage = styled('img')(({theme, isSelected}) => ({
    width: '88%', // 20% width with some margin
    height: 'auto',
    aspectRatio: '1 / 1',
    objectFit: 'cover',
    marginRight: theme.spacing(1),
    border: isSelected ? `2px solid ${theme.palette.primary.main}` : 'none',
    cursor: 'pointer',
    [theme.breakpoints.down('sm')]: {
        width: 'calc(25% - 8px)', // 25% width for mobile
    },
}));

const ProductDetails = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const {id} = useParams();

    const {data: productData, isLoading, error} = useGetProductDetailsClient(id);

    const [selectedColor, setSelectedColor] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [quantity, setQuantity] = useState(0);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [unavailableReason, setUnavailableReason] = useState('');
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    useEffect(() => {
        if (productData && productData.data) {
            setSelectedColor('');
            setSelectedSize('');
            setQuantity(0);
            setUnavailableReason('');
            setSelectedImageIndex(0);
        }
    }, [productData]);

    const handleGoBack = () => navigate(-1);

    const handleColorChange = (id) => {
        setSelectedColor(id);
        updateAvailability(id, selectedSize);
    };

    const handleSizeChange = (e) => {
        setSelectedSize(e.target.value);
        updateAvailability(selectedColor, e.target.value);
    };

    const updateAvailability = (color, size) => {
        if (color && size) {
            const selectedVariant = productData.data.quantities.find(
                q => q.color.id === parseInt(color) && q.size.id === parseInt(size)
            );
            if (selectedVariant) {
                if (selectedVariant.quantity > 0) {
                    setQuantity(1);
                    setUnavailableReason('');
                } else {
                    setQuantity(0);
                    setUnavailableReason('Ce produit est en rupture de stock.');
                }
            } else {
                setQuantity(0);
                setUnavailableReason('Cette combinaison de couleur et de taille n\'est pas disponible.');
            }
        } else {
            setQuantity(0);
            setUnavailableReason('');
        }
    };

    const handleAddToCart = () => {
        if (!selectedColor || !selectedSize || quantity === 0) return;

        const selectedVariant = productData.data.quantities.find(
            q => q.color.id === parseInt(selectedColor) && q.size.id === parseInt(selectedSize)
        );

        if (!selectedVariant) return;

        const cartItem = {
            id: productData.data.id,
            mainImage: productData.data.image_urls[0] || '',
            name: productData.data.product_name,
            colorId: selectedColor,
            colorName: selectedVariant.color.label,
            sizeId: selectedSize,
            sizeName: selectedVariant.size.label,
            quantity,
            price: productData.data.price,
        };

        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

        const existingItemIndex = cartItems.findIndex(item =>
            item.id === cartItem.id &&
            item.colorId === cartItem.colorId &&
            item.sizeId === cartItem.sizeId
        );

        if (existingItemIndex !== -1) {
            const existingItem = cartItems[existingItemIndex];
            const newQuantity = Math.min(existingItem.quantity + quantity, selectedVariant.quantity);

            if (newQuantity === existingItem.quantity) {
                setSnackbarOpen(true);
                return;
            }

            cartItems[existingItemIndex] = {...existingItem, quantity: newQuantity};
        } else {
            cartItems.push(cartItem);
        }

        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        setSnackbarOpen(true);
    };

    // New state for touch handling
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);

    const galleryRef = useRef(null);

    // ... (keep all your existing functions)

    const handleTouchStart = (e) => {
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (touchStart === touchEnd) return;
        const distance = touchStart - touchEnd;
        const minSwipeDistance = 50;

        if (distance > minSwipeDistance && selectedImageIndex < product.image_urls.length - 1) {
            setSelectedImageIndex(prev => prev + 1);
        } else if (distance < -minSwipeDistance && selectedImageIndex > 0) {
            setSelectedImageIndex(prev => prev - 1);
        }

        // Reset touch positions
        setTouchStart(0);
        setTouchEnd(0);
    };

    useEffect(() => {
        if (galleryRef.current) {
            galleryRef.current.style.transform = `translateX(-${selectedImageIndex * 100}%)`;
        }
    }, [selectedImageIndex]);

    if (isLoading) {
        return (
            <MainContainer>
                <Header role={"client"}/>
                <ContentContainer>
                    <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
                        <CircularProgress/>
                    </Box>
                </ContentContainer>
            </MainContainer>
        );
    }

    if (error || !productData || !productData.data) {
        return (
            <MainContainer>
                <Header role={"client"}/>
                <ContentContainer>
                    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center"
                         height="50vh">
                        <Typography variant="h4" gutterBottom>Product Not Found</Typography>
                        <Button variant="contained" onClick={handleGoBack}>Go Back</Button>
                    </Box>
                </ContentContainer>
            </MainContainer>
        );
    }

    const product = productData.data;

    const availableColors = Array.from(new Set(product.quantities.map(q => JSON.stringify(q.color))))
        .map(str => JSON.parse(str));
    const availableSizes = Array.from(new Set(product.quantities.map(q => JSON.stringify(q.size))))
        .map(str => JSON.parse(str));

    const ImageGallery = () => {
        if (isMobile) {
            return (
                <>
                    <MainImageContainer>
                        <MainImage
                            src={product.image_urls[selectedImageIndex]}
                            alt={`${product.product_name} main`}
                        />
                    </MainImageContainer>
                    <ThumbnailScroll>
                        {product.image_urls.map((image, index) => (
                            <ThumbnailImage
                                key={index}
                                src={image}
                                alt={`${product.product_name} thumbnail ${index + 1}`}
                                onClick={() => setSelectedImageIndex(index)}
                                isSelected={index === selectedImageIndex}
                            />
                        ))}
                    </ThumbnailScroll>
                </>
            );
        } else {
            return (
                <SectionContainer2>
                    <ThumbnailContainer>
                        {product.image_urls.map((image, index) => (
                            <ThumbnailImage
                                key={index}
                                src={image}
                                alt={`${product.product_name} thumbnail ${index + 1}`}
                                onClick={() => setSelectedImageIndex(index)}
                                isSelected={index === selectedImageIndex}
                            />
                        ))}
                    </ThumbnailContainer>
                    <ProductImage src={product.image_urls[selectedImageIndex] || ''} alt={product.product_name}/>
                </SectionContainer2>
            );
        }
    };

    return (
        <MainContainer>
            <Header role={"client"}/>
            <ContentContainer>
                <Grid container spacing={1}>
                    <Grid container item xs={12} md={6}>
                        <Grid item xs={12} md={1}>
                            <Box display="flex" alignItems="center">
                                <IconButton
                                    onClick={handleGoBack}
                                    sx={{
                                        mr: 2,
                                        padding: '12px', // Increase padding to make the clickable area larger
                                    }}
                                    aria-label="Go back"
                                >
                                    <ArrowBackIcon
                                        sx={{
                                            fontSize: '32px', // Increase icon size (adjust as needed)
                                            border: '0.5px solid rgba(60,60,67,0.5)', // Add border with specified color
                                            borderRadius: '50%',
                                            padding: '4px', // Add some padding inside the border
                                        }}
                                    />
                                </IconButton>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={11}>
                            {/*<SectionContainer2>
                                <ThumbnailContainer>
                                    {product.image_urls.map((image, index) => (
                                        <ThumbnailImage
                                            key={index}
                                            src={image}
                                            alt={`${product.product_name} thumbnail ${index + 1}`}
                                            onClick={() => setSelectedImageIndex(index)}
                                            isSelected={index === selectedImageIndex}
                                        />
                                    ))}
                                </ThumbnailContainer>
                                <ProductImage src={product.image_urls[selectedImageIndex] || ''}
                                              alt={product.product_name}/>
                            </SectionContainer2>*/}
                            <ImageGallery/>
                        </Grid>
                    </Grid>


                    <Grid item xs={12} md={6}>
                        <SectionContainer>
                            <Typography variant="h5" fontWeight="normal" gutterBottom
                                        sx={{mb: 0}}>{product.product_name}</Typography>
                            <Typography variant="subtitle1" color="text.secondary"
                                        gutterBottom>{product.CategoryName}</Typography>

                            <Box display="flex" alignItems="center" mb={2}>
                                {product.is_discounted ? (
                                    <>
                                        <Typography variant="subtitle1" fontWeight="normal" color="#e53935"
                                                    sx={{textDecoration: 'line-through', mr: 2}}>
                                            {product.is_discounted} DZD
                                        </Typography>
                                        <Typography variant="subtitle1" fontWeight="normal" color="#3C3C43">
                                            {product.price} DZD
                                        </Typography>
                                    </>
                                ) : (
                                    <Typography variant="subtitle1" fontWeight="normal">
                                        {product.price} DZD
                                    </Typography>
                                )}
                            </Box>

                            <Typography variant="body1" paragraph>
                                {product.description}
                            </Typography>

                            <Box sx={{mb: 2}}>
                                <Typography variant="subtitle1" sx={{mb: 1}}>Couleur</Typography>
                                <Box sx={{display: 'flex', flexWrap: 'wrap', alignItems: 'center'}}>
                                    {availableColors.map((c) => (
                                        <ColorSquare
                                            key={c.id}
                                            color={c.hex}
                                            selected={selectedColor === c.id}
                                            onClick={() => handleColorChange(c.id)}
                                        />
                                    ))}
                                </Box>
                            </Box>

                            <Typography variant="subtitle1" sx={{mb: 1}}>Taille</Typography>
                            <FormControl fullWidth sx={{mb: 2}}>
                                <InputLabel id="size-select-label" sx={{
                                    top: '-3px',  // Adjust this value as needed
                                    '&.Mui-focused': {
                                        top: '3px'  // Adjust this value for when the label is focused/shrunk
                                    }
                                }}>Veulllez choisir</InputLabel>
                                <Select
                                    sx={{
                                        height: "48px",
                                        borderRadius: "2px",
                                        display: "flex",
                                        alignItems: "center"
                                    }}
                                    MenuProps={{
                                        PaperProps: {
                                            sx: {
                                                "& .MuiMenuItem-root": {
                                                    height: "48px",
                                                    display: "flex",
                                                    alignItems: "center"
                                                }
                                            }
                                        }
                                    }}
                                    labelId="size-select-label"
                                    value={selectedSize}
                                    onChange={handleSizeChange}
                                    fullWidth
                                    label="Size"
                                >
                                    {availableSizes.map(s => (
                                        <MenuItem key={s.id} value={s.id}>
                                            {s.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <Grid container alignItems="center" justifyContent="space-between">
                                <Grid item></Grid>
                                <Grid item>
                                    <Typography variant={"body2"} sx={{
                                        textDecoration: 'underline',
                                        cursor: "pointer",
                                        color: 'rgba(60,60,67,0.8)'
                                    }}>see
                                        measurements</Typography>
                                </Grid>
                            </Grid>

                            {unavailableReason && (
                                <Alert severity="warning" sx={{mb: 2}}>
                                    {unavailableReason}
                                </Alert>
                            )}

                            <StyledButton
                                variant="contained"
                                onClick={handleAddToCart}
                                disabled={!selectedColor || !selectedSize || quantity === 0}
                                fullWidth
                                sx={{
                                    mt: 5,
                                    bgcolor: '#3C3C43',
                                    '&:hover': {bgcolor: '#3C3C43'},
                                    '&:disabled': {bgcolor: 'rgba(60,60,67,0.5)', color: 'white'}
                                }}
                            >
                                Ajouter au panier
                            </StyledButton>

                            <Typography variant={"body2"} sx={{mt: 1.5, color: 'rgba(60,60,67,0.8)'}}>*Veuillez choisir
                                la taille et la couleur, puis ajoutez le
                                produit à votre panier.</Typography>

                        </SectionContainer>
                    </Grid>
                </Grid>
            </ContentContainer>

            <Snackbar
                anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                message="Product added to cart"
                action={
                    <IconButton size="small" color="inherit" onClick={() => setSnackbarOpen(false)}>
                        <CloseIcon fontSize="small"/>
                    </IconButton>
                }
            />
        </MainContainer>
    );
}

export default ProductDetails;
