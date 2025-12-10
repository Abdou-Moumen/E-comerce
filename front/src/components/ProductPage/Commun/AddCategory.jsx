import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { useAddCategory } from '../../../Hooks/Products/useCategory';

const AddCategory = ({ open, handleClose }) => {
    const [category, setCategory] = useState('');
    const { mutate, isPending, isSuccess } = useAddCategory();




    const handleCategoryChange = (event) => {
        setCategory(event.target.value);
    };

    const handleAddCategory = () => {
        mutate(category);


    };
    useEffect(() => {
        if (isSuccess) {
            handleClose();
        }
    }
        , [isSuccess, handleClose]);



    return (
        <>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add Category</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Category"
                        type="text"
                        fullWidth
                        value={category}
                        onChange={handleCategoryChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleAddCategory} color="primary">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default AddCategory;