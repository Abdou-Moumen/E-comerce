import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "../../config/axiosConfig";
import { useNotification } from "../useNotify";
import { useQueryClient } from "@tanstack/react-query";

export const useGetProducts = (query, page) => {
  const getProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const { search, stock, isDraft, category } = query.searchQuery;
      console.log("Fetching with query:", query); // Add this line
      const response = await axiosInstance.get(
        `api/Products?page=${page}&query=${search}&stock=${stock}&isDrafted=${isDraft}&category=${category}`,
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
    queryKey: ["products", query, page],
    queryFn: getProducts,
  });
};

export const useGetProduct = (id) => {
  const getProduct = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axiosInstance.get(`api/Product/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Product fetched:", response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  return useQuery({
    queryKey: ["product"],
    queryFn: getProduct,
  });
};

export const useAddProduct = () => {
  const queryClient = useQueryClient();
  const { notifyUser } = useNotification();

  const addProduct = async (data) => {
    const token = localStorage.getItem("token");
    const formData = new FormData();

    // Append text fields to formData
    formData.append("category_id", data.category);
    formData.append("product_name", data.name);
    formData.append("description", data.description);
    formData.append("price", data.price);
    formData.append("is_discounted", data.isDiscounted);
    formData.append("duration", data.discountDuration);
    formData.append("new_price", data.discountPrice);
    formData.append("is_drafted", data.isDrafted);

    // Handle quantities array
    formData.append("quantities", JSON.stringify(data.quantities || []));
    console.log("Form data before images:", Object.fromEntries(formData));

    // Handle multiple images
    if (Array.isArray(data.images)) {
      data.images.forEach((image, index) => {
        formData.append(`images[${index}]`, image);
      });
    } else if (data.images) {
      formData.append("images", data.images);
    } else {
      console.log("No images provided");
    }

    console.log("Final form data:", Object.fromEntries(formData));

    try {
      const response = await axiosInstance.post("api/CreateProduct", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        timeout: 30000, // Increased timeout to 30 seconds
      });

      console.log("API Response:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Error adding product:",
        error.response?.data || error.message
      );
      throw error;
    }
  };

  return useMutation({
    mutationFn: addProduct,
    onSuccess: (data) => {
      queryClient.invalidateQueries("products");
      queryClient.invalidateQueries("product");
      console.log("Product added successfully:", data);
      notifyUser("Produit ajouté avec succès", "success");
    },
    onError: (error) => {
      console.error("Error in mutation:", error);
      // showError("Error adding product");
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  const { notifyUser } = useNotification();

  const deleteProduct = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axiosInstance.delete(`api/deleteProduct/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: (data) => {
      queryClient.invalidateQueries("products");
      console.log("Product deleted successfully:", data);
      notifyUser("Produit supprimé avec succès", "success");
    },
    onError: (error) => {
      console.error("Error in mutation:", error);
      // showError("Error deleting product");
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  const { notifyUser } = useNotification();

  const updateProduct = async (data) => {
    const token = localStorage.getItem("token");
    const formData = new FormData();

    // Append text fields to formData
    formData.append("id", data.id);
    formData.append("category_id", data.category);
    formData.append("product_name", data.name);
    formData.append("description", data.description);
    formData.append("price", data.price);
    formData.append("is_discounted", data.isDiscounted);
    formData.append("duration", data.discountDuration);
    formData.append("new_price", data.discountPrice);
    formData.append("is_drafted", data.isDrafted);

    // Handle quantities array
    formData.append("quantities", JSON.stringify(data.quantities || []));
    console.log("Form data before images:", Object.fromEntries(formData));

    // Handle multiple images
    if (Array.isArray(data.images)) {
      data.images.forEach((image, index) => {
        formData.append(`images[${index}]`, image);
      });
    } else if (data.images) {
      formData.append("images", data.images);
    } else {
      console.log("No images provided");
    }

    console.log("Final form data:", Object.fromEntries(formData));

    try {
      const response = await axiosInstance.post("api/updateProduct", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        timeout: 30000, // Increased timeout to 30 seconds
      });

      console.log("API Response:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Error updating product:",
        error.response?.data || error.message
      );
      throw error;
    }
  };

  return useMutation({
    mutationFn: updateProduct,
    onSuccess: (data) => {
      queryClient.invalidateQueries("products");
      console.log("Product updated successfully:", data);
      notifyUser("Produit mis à jour avec succès", "success");
    },
    onError: (error) => {
      console.error("Error in mutation:", error);
      // showError("Error updating product");
    },
  });
};
