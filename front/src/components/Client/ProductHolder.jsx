import React, { useState, useEffect } from 'react';
import {
    Grid,
    Skeleton,
    Typography,
} from '@mui/material';
import ProductCard from './ProductCard';
import { useGetProducts } from '../../Hooks/Client/useProduct';

const ProductHolder = ({ setCount, page }) => {
    const [products, setProducts] = useState([]);
    const { data, isLoading, isError, refetch } = useGetProducts('all', page);
    //

    useEffect(() => {
        if (data) {
            setProducts(data.data || []);
            let numPages = Math.ceil(data.total_rows / 10);
            setCount(numPages);
            console.log(products);
        } else if (isError) {
            console.log('Error fetching products');
        }
    }, [data, isError]);

    useEffect(() => {
        refetch();
    }, [page]);

    if (isLoading) {
        return (
            <Grid container spacing={2}

                justifyContent="left">
                <Grid item xs={12}>
                    <Typography variant="h4" gutterBottom>
                        Nos produits
                    </Typography>
                </Grid>



                {[...Array(10).keys()].map((index) => (
                    <Grid item key={index} xs={6} sm={2} sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',

                    }} >
                        <Skeleton variant="rectangular" width={180} height={180} />
                        <Typography variant="body2" gutterBottom>
                            <Skeleton width={100} />
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            <Skeleton width={60} />
                        </Typography>
                    </Grid>
                ))}
            </Grid>
        );
    }

    return (
        <Grid container spacing={2}
            sx={{
                minHeight: "80vh",

            }} justifyContent="left">
            <Grid item xs={12}>
                <Typography variant="body"
                    color={"#333"}
                    gutterBottom>
                    Nos produits
                </Typography>
            </Grid>
            {[...Array(10).keys()].map((index) => (
                <Grid item key={index} xs={6} sm={2} >
                    <ProductCard
                        product={products[index]}
                    />
                </Grid>
            ))}
        </Grid>
    );
};

export default ProductHolder;