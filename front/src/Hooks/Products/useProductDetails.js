import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "../../config/axiosConfig";
import { useNotification } from "../useNotify";

export const useGetDetails = () => {
  const getColors = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axiosInstance.get("api/ColorsAndSizes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  return useQuery({
    queryKey: ["details"],
    queryFn: getColors,
  });
};
