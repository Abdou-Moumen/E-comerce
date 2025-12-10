import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "../../config/axiosConfig";
import { useQueryClient } from "@tanstack/react-query";

export const useGetProducts = (query, page) => {
  const getProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("Recherche avec requête :", query); // Add this line
      const response = await axiosInstance.get(
        `api/GetProductLandingPage?query=${query}&page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  return useQuery({
    queryKey: ["productLanding", query, page],
    queryFn: getProducts,
  });
};
