import "./App.css";
import { RouterProvider } from "react-router-dom";
import router from "../src/route/Routes";
import { createTheme, ThemeProvider } from "@mui/material";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import React from "react";
import { NotifyProvider } from "./contexts/NotifyContext.jsx";

const theme = createTheme({
  typography: {
    fontFamily: ["Public Sans", "sans-serif"].join(","),
  },
});

function App() {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <ReactQueryDevtools initialIsOpen={false} />
      <AuthProvider>
        <NotifyProvider>
          <ThemeProvider theme={theme}>
            <RouterProvider router={router} />
          </ThemeProvider>
        </NotifyProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
