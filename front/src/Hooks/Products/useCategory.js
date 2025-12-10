import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "../../config/axiosConfig";
import { useNotification } from "../useNotify";
import { useQueryClient } from "@tanstack/react-query";

export const useGetCategery = () => {
  const getCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axiosInstance.get("api/Categories", {
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
    queryKey: ["categories"],
    queryFn: getCategories,
  });
};
export const useAddCategory = () => {
  const queryClient = useQueryClient();
  // const { showSuccess, showError } = useNotification();
  const addCategory = async (data) => {
    const token = localStorage.getItem("token");
    console.log("data", data);
    try {
      await axiosInstance.post(
        "api/CreateCategory",
        {
          CategoryName: data,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Category added successfully");
    } catch (error) {
      console.error("Error adding category:", error);

      throw error;
    }
  };
  return useMutation({
    mutationFn: addCategory,
    onSuccess: () => {
      queryClient.invalidateQueries("categories");

      // showSuccess("Category added successfully");
    },
    onError: (error) => {
      showError("Error adding category");
      console.error("Error adding category:", error);
    },
  });
};
