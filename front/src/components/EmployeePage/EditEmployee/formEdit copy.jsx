import React from "react";
import {
    TextField,
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
    Skeleton
} from "@mui/material";


const DialogData = ({ open, handleClose, data }) => {
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{"Employee Data"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    <Box>
                        <TextField
                            label="First Name"
                            value={""}
                            disabled
                        />
                    </Box>
                    <Box>
                        <TextField
                            label="Last Name"
                            value={""}
                            disabled
                        />
                    </Box>
                    <Box>
                        <TextField
                            label="Email"
                            value={""}
                            disabled
                        />
                    </Box>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} autoFocus>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default DialogData;