import {useQuery} from "@tanstack/react-query";
import axiosInstance from "../../config/axiosConfig";

export const useGetLogs = (query, page) => {
    const fetchLogs = async () => {
        try {
            const token = localStorage.getItem("token");
            // Fetch logs with query parameters
            const {first_name,last_name, login_action,order_action} = query;
            // Create query parameters
            const params = new URLSearchParams({page, first_name,last_name, login_action,order_action});

            const response = await axiosInstance.get(`api/Logs?first_name=${first_name}&last_name=${last_name}&login_action=${login_action}&order_action=${order_action}&page=${page}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    };

    return useQuery({
        queryKey: ["logs", query, page],
        queryFn: fetchLogs,
    });
};
