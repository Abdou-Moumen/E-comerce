import {useQuery} from "@tanstack/react-query";
import axiosInstance from "../../config/axiosConfig";

export const useGetOrderDetails = (orderId) => {
    const fetchOrderDetails = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axiosInstance.get(`api/order/${orderId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data.data; // Assuming the response has a data field that contains the order
        } catch (error) {
            throw error;
        }
    };

    return useQuery({
        queryKey: ["order", orderId],
        queryFn: fetchOrderDetails,
    });
};
