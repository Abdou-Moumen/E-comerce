export const getUser = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return null;
    }
    const response = await axiosInstance.get("api/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error getting user:", error);
    return null;
  }
};
