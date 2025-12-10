import {useQuery} from "@tanstack/react-query";
import axiosInstance from "../../config/axiosConfig";

export const useGetOrders = (query, page) => {
    const fetchOrders = async () => {
            try {
                const token = localStorage.getItem("token");
                //const {search, status, wilaya, isDeleted} = query;
                //const response = await axiosInstance.get(`api/orderList?page=${page}&query=${search}&status=${status}&wilaya=${wilaya}&isDeleted=${isDeleted}`
                //const response = await axiosInstance.get(`api/orderList`
                const {search, status, wilaya, isDeleted} = query;

                // Create query parameters
                const params = new URLSearchParams({page, query: search, status, wilaya, isDeleted});

                // Fetch orders with query parameters
                const response = await axiosInstance.get(`api/orderList?${params.toString()}`
                    , {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                return response.data;
            } catch
                (error) {
                throw error;
            }
        }
    ;

    return useQuery({
        queryKey: ["orders", query, page],
        queryFn: fetchOrders,
    });
};
