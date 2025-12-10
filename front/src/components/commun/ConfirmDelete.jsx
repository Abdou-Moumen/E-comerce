import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button, Box } from '@mui/material';
import { styled } from '@mui/system';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: '12px',
    padding: theme.spacing(2),
    maxWidth: '300px',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  borderRadius: '8px',
  padding: '6px 12px',
  fontSize: '0.875rem',
}));

const ConfirmationDialog = ({ open, handleClose, handleConfirm }) => {
  return (
    <StyledDialog open={open} onClose={handleClose}>
      <DialogTitle>
        <Typography variant="h6" component="div" sx={{ fontSize: '1.125rem', fontWeight: 600 }}>
          Confirmer la suppression
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
          Êtes-vous sûr de vouloir supprimer cet élément ?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
          <StyledButton variant="outlined" color="inherit" onClick={handleClose}>
            Annuler
          </StyledButton>
          <StyledButton variant="contained" color="error" onClick={handleConfirm}>
            Confirmer
          </StyledButton>
        </Box>
      </DialogActions>
    </StyledDialog>
  );
};

export default ConfirmationDialog;