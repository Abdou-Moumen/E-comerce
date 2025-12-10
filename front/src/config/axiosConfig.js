import axios from "axios";

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000", // Replace with your server URL
  timeout: 3000, // Optional timeout
});

export default axiosInstance;
