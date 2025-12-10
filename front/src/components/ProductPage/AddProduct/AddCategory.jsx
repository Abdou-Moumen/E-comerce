import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Alert
} from '@mui/material';
import { styled } from '@mui/system';
import { useAddCategory } from '../../../Hooks/Products/useCategory';

const StyledDialog = styled(Dialog)({
    '& .MuiDialog-paper': {
        borderRadius: '12px',
    },
});

const StyledButton = styled(Button)({
    borderRadius: '8px',
    textTransform: 'none',
});

const AddCategory = ({ open, handleClose }) => {
    const [category, setCategory] = useState('');
    const [error, setError] = useState('');
    const { mutate, isPending, isSuccess, isError, error: mutationError } = useAddCategory();

    const handleCategoryChange = (event) => {
        setCategory(event.target.value);
        setError('');
    };

    const handleAddCategory = () => {
        if (!category.trim()) {
            setError('Le nom de la catégorie ne peut pas être vide');
            return;
        }
        mutate(category);
    };

    useEffect(() => {
        if (isSuccess) {
            handleClose();
            setCategory('');
            setError('');
        }
        if (isError) {
            if (mutationError?.response?.status === 422) {
                setError('Cette catégorie existe déjà');
            } else {
                setError(mutationError?.message || 'Une erreur est survenue lors de l\'ajout de la catégorie');
            }
        }
    }, [isSuccess, isError, mutationError, handleClose]);

    return (
        <StyledDialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>Ajouter une catégorie</DialogTitle>
            <DialogContent>
                <Box my={2}>
                    <TextField
                        autoFocus
                        fullWidth
                        label="Catégorie"
                        value={category}
                        onChange={handleCategoryChange}
                        error={!!error}
                        helperText={error}
                    />
                </Box>
                {isError && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {error}
                    </Alert>
                )}
            </DialogContent>
            <DialogActions>
                <StyledButton onClick={handleClose} color="inherit">
                    Annuler
                </StyledButton>
                <StyledButton
                    onClick={handleAddCategory}
                    color="primary"
                    variant="contained"
                    disabled={isPending}
                >
                    {isPending ? 'Ajout en cours...' : 'Ajouter'}
                </StyledButton>
            </DialogActions>
        </StyledDialog>
    );
};

export default AddCategory;