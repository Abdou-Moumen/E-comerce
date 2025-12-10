import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardActionArea, CardContent, CardMedia, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
    maxWidth: 345,
    width: '100%',
    borderRadius: "2px",
    boxShadow: 'none',
    transition: 'box-shadow 0.3s ease-in-out',
    position: 'relative', // Add this line
    '&:hover': {
        boxShadow: 'none',
    },
}));

const StyledCardMedia = styled(CardMedia)({
    height: 200,
    transition: 'transform 0.3s ease-in-out',
    '&:hover': {
        transform: 'scale(1.05)',
    },
});

const EllipsisTypography = styled(Typography)({
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 1,
    WebkitBoxOrient: 'vertical',
});

const DiscountBox = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: theme.spacing(1),
    right: theme.spacing(1),
    backgroundColor: '#e53935',
    color: '#fff',
    padding: theme.spacing(0.5, 1),
    borderRadius: theme.shape.borderRadius,
    fontSize: '0.75rem',
    fontWeight: 'bold',
}));

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    if (!product) return null;

    const { product_name: productName, price, discount_amount: oldPrice, image_url: imageUrl, discount_percentage: discountPercentage } = product;

    const handleProductClick = () => {
        navigate(`/product/${product.id}`);
    };

    const truncatedName = productName.length > 15 ? `${productName.slice(0, 15)}...` : productName;

    return (
        <StyledCard onClick={handleProductClick}>
            <CardActionArea>
                {discountPercentage && (
                    <DiscountBox>
                        {discountPercentage}%
                    </DiscountBox>
                )}
                <StyledCardMedia
                    component="img"
                    image={imageUrl}
                    alt={truncatedName}
                    sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ p: { xs: 1, sm: 2 }, textAlign: 'center' }}>
                    <EllipsisTypography
                        variant="subtitle1"
                        component="div"
                        sx={{ fontWeight: 500, color: 'text.primary', fontSize: { xs: '0.875rem', sm: '1rem' }, mb: 0.5 }}
                    >
                        {truncatedName}
                    </EllipsisTypography>
                    <Box display="flex" justifyContent="center" alignItems="center">
                        <Typography
                            variant="body2"
                            sx={{ mr: 1, fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                        >
                            {price}.00 DZD
                        </Typography>
                        {oldPrice && (
                            <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{
                                    textDecoration: 'line-through',
                                    fontSize: { xs: '0.7rem', sm: '0.75rem' },
                                    color: '#e53935',
                                }}
                            >
                                {oldPrice} DZD
                            </Typography>
                        )}
                    </Box>
                </CardContent>
            </CardActionArea>
        </StyledCard>
    );
};

export default ProductCard;