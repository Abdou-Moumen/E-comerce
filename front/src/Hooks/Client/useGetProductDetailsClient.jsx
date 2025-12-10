import {useQuery} from "@tanstack/react-query";
import axiosInstance from "../../config/axiosConfig";

export const useGetProductDetailsClient = (productId) => {
    const fetchProductDetailsClient = async () => {
        try {
            const response = await axiosInstance.get(`api/ProductClient/${productId}`, {
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    };

    return useQuery({
        queryKey: ["order", productId],
        queryFn: fetchProductDetailsClient,
    });
};
