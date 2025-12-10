import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "../config/axiosConfig";
import { useUser } from "../contexts/AuthContext";
import axios from "axios";

export const useLogin = () => {
  const { login } = useUser();

  const loginMutation = async ({ email, password }) => {
    try {
      const response = await axiosInstance.post("api/login", {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "An error occurred during login"
      );
    }
  };

  return useMutation({
    mutationFn: loginMutation,
    onSuccess: (data) => {
      login(data.user, data.token);
    },
    onError: (error) => {
      console.error("Login failed:", error.message);
    },
  });
};

export const testLoginedUser = () => {
  const { login, logout } = useUser();
  const token = localStorage.getItem("token");

  const fetchUser = async () => {
    if (!token) {
      throw new Error("No token found");
    }
    const response = await axiosInstance.get("/api/user", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  };

  return useQuery({
    queryKey: ["authUser"],
    queryFn: fetchUser,
    onSuccess: (data) => {
      login(data.user, token);
    },
    onError: () => {
      logout();
    },
    enabled: !!localStorage.getItem("token"), // Only run if there's a token
  });
};
