import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "../../config/axiosConfig";
import { useNotification } from "../useNotify";
import { useQueryClient } from "@tanstack/react-query";

export const useGetEmployees = (query, page) => {

  const getEmployees = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log('Recherche avec requête :', query); // Add this line
      const response = await axiosInstance.get(`api/Employees?query=${query}&page=${page}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  return useQuery({
    queryKey: ["employees", query, page],
    queryFn: getEmployees,
  });
};

export const useGetEmployee = (id) => {
  console.log(id);

  const getEmployee = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axiosInstance.get(
        `api/Employee/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      return response.data
    }
    catch (error) {
      throw error;
    }
  }
  return useQuery({
    queryKey: ["employee"],
    queryFn: getEmployee,
  })
}

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();
  const { notifyUser } = useNotification();
  const createEmployee = async (employee) => {
    try {
      const token = localStorage.getItem("token");
      console.log(employee.firstName);
      const response = await axiosInstance.post(
        "api/createEmployee",
        {
          first_name: employee.firstName,
          last_name: employee.lastName,
          email: employee.email,
          password: employee.password,
          role: employee.role,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  return useMutation({
    mutationFn: createEmployee,
    onSuccess: (data) => {
      console.log("Employé créé avec succès :", data);
      notifyUser("Employé créé avec succès", "success");
      queryClient.invalidateQueries('employees');
    },
    onError: (error) => {
      console.error("Échec de la création de l'employé :", error);
    },
  });
};

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();
  const { notifyUser } = useNotification();
  const updateEmployee = async (employee) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axiosInstance.put(
        `api/updateEmployee/${employee.id}`,
        {
          first_name: employee.firstName,
          last_name: employee.lastName,
          email: employee.email,
          role: employee.role,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  return useMutation({

    mutationFn: updateEmployee,
    onSuccess: (data) => {
      console.log("Employé mis à jour avec succès :", data);
      notifyUser("Employé mis à jour avec succès", "success");
      // Invalidate and refetch
      queryClient.invalidateQueries('employees');
    },
    onError: (error) => {
      console.error("Échec de la mise à jour de l'employé :", error);
    },
  });
}

export const useDeleteEmployee = () => {
  const { notifyUser } = useNotification();
  const queryClient = useQueryClient();
  const deleteEmployee = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axiosInstance.delete(`api/deleteEmployee/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  return useMutation({
    mutationFn: deleteEmployee,
    onSuccess: (data) => {
      console.log("Employé supprimé avec succès :", data);
      notifyUser("Employé supprimé avec succès", "success");
      queryClient.invalidateQueries('employees');
    },
    onError: (error) => {
      console.error("Échec de la suppression de l'employé :", error);
      // Corrected to use notifyUser with appropriate message type
      notifyUser("Échec de la suppression de l'employé", "error");
    },
  });
};
