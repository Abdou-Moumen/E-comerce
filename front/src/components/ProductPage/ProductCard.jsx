import React, { useState, useEffect } from 'react';
import {
    ImageList,
    ImageListItem,
    Card,
    CardMedia,
} from '@mui/material';
import axiosInstance from '../../config/axiosConfig';

const ImageGrid = () => {
    const [images, setImages] = useState([]);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await axiosInstance.get('api/GetProductImages/95', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                console.log(response.data);
                setImages(response.data.image_urls);
            } catch (error) {
                console.error('Error fetching images:', error);
            }
        };

        fetchImages();
    }, []);

    return (
        <ImageList sx={{ width: '100%', height: '100%' }} cols={3} rowHeight="auto" gap={16}>
            {images.map((imageUrl, index) => (
                <ImageListItem key={index}>
                    <Card>
                        <CardMedia
                            component="img"
                            height="200"
                            image={imageUrl}
                            alt={`Product image ${index + 1}`}
                        />
                    </Card>
                </ImageListItem>
            ))}
        </ImageList>
    );
};

export default ImageGrid;