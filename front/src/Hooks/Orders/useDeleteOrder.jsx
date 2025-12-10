import { useState } from 'react';
import axiosInstance from "../../config/axiosConfig";

const useDeleteOrder = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleConfirmDelete = (id) => {
    const token = localStorage.getItem("token");

    if (!id) {
      console.error("Order ID is missing");
      setError("Order ID is missing");
      return;
    }

    setIsLoading(true);

    axiosInstance.delete(`api/DeleteClientOrder/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        console.log("Order deleted successfully", response);
        setIsLoading(false);
        // Optionally, refresh the list of orders or navigate the user away
      })
      .catch(error => {
        console.error("Failed to delete order", error);
        setError(error);
        setIsLoading(false);
        // Optionally, inform the user of the failure
      });
  };

  return { handleConfirmDelete, isLoading, error };
};

export default useDeleteOrder;
