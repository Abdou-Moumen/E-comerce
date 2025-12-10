import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNotification } from "../useNotify.js";
import axiosInstance from "../../config/axiosConfig.js";

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  const { notifyUser } = useNotification();

  const createOrder = async (orderData) => {
    try {
      const response = await axiosInstance.post("api/create", orderData, {
        timeout: 30000, // 30 seconds timeout
      });

      console.log("API Response:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Error creating order:",
        error.response?.data || error.message
      );
      throw error;
    }
  };

  return useMutation({
    mutationFn: createOrder,
    onSuccess: (data) => {
      queryClient.invalidateQueries("orders");
      console.log("Order created successfully:", data);
      notifyUser("Commande créée avec succès", "success");
    },
    onError: (error) => {
      console.error("Error in mutation:", error);
      notifyUser("Erreur lors de la création de la commande", "error");
    },
  });
};