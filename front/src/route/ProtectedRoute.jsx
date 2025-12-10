import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import LoadingScreen from "../components/commun/LoadingScreen";
import axiosInstance from "../config/axiosConfig.js";
import { useUser } from "../contexts/AuthContext";

const fetchUser = (token) => {
  return axiosInstance.get("/api/user", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const ProtectedRoute = ({ roles = [] }) => {
  const { login, logout } = useUser();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const token = localStorage.getItem("token");

  useEffect(() => {
    let isMounted = true;
    console.log("executing");
    if (token && !user) {
      fetchUser(token)
        .then((response) => {
          if (isMounted) {
            setUser(response.data);
            setIsLoading(false);
            login(response.data, token);
          }
        })
        .catch(() => {
          if (isMounted) {
            setIsLoading(false);
            logout();
          }
        });
    } else {
      setIsLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [token]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!token || !user) {
    return <Navigate to="/login" />;
  }

  if (roles.length && !roles.includes(user.role)) {
    return <div>Unhautrized</div>;
  }

  return <Outlet />;
};

export default ProtectedRoute;
