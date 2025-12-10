import axiosInstance from "../../config/axiosConfig.js";
import {useQuery} from "@tanstack/react-query";

export const useGetColorsAndSizes = () => {
  const ColorsAndSizes = async () => {
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
    queryKey: ["colorsAndSizes"],
    queryFn: ColorsAndSizes,
  });
};