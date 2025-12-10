import React, { useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useNotify } from "../../contexts/NotifyContext";

const SnackAlert = () => {
  const { notify, handleClose } = useNotify();
  const { open, message, severity } = notify;
  return (
    <div>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default SnackAlert;
