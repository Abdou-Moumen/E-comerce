import PropTypes from 'prop-types';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography} from "@mui/material";

const OrderDeleteDialog = ({
                               openDelete,
                               handleDeleteClose,
                               handleDeleteConfirmed,
                           }) => {
    return (<>
        <Dialog open={openDelete} onClose={handleDeleteClose}>
            <DialogTitle>Confirmation de la suppression</DialogTitle>
            <DialogContent>
                <Typography>Etes-vous sûr de vouloir supprimer cette commande ?</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleDeleteClose} color="primary">
                    Annuler
                </Button>
                <Button onClick={handleDeleteConfirmed} color="secondary">
                    Supprimer
                </Button>
            </DialogActions>
        </Dialog>
    </>);
}

OrderDeleteDialog.propTypes = {
    openDelete: PropTypes.bool.isRequired,
    handleDeleteClose: PropTypes.func.isRequired,
    handleDeleteConfirmed: PropTypes.func.isRequired,
};

export default OrderDeleteDialog;