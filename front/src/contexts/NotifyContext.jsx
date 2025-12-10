import React, { createContext, useContext, useState } from "react";

const NotifyContext = createContext();

export const NotifyProvider = ({ children }) => {
  const [notify, setNotify] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const handleClose = () => {
    setNotify({ ...notify, open: false });
  };

  return (
    <NotifyContext.Provider value={{ notify, setNotify, handleClose }}>
      {children}
    </NotifyContext.Provider>
  );
};

export const useNotify = () => {
  const context = useContext(NotifyContext);
  if (context === undefined) {
    throw new Error("useNotify must be used within a NotifyProvider");
  }
  return context;
};

export default NotifyContext;
