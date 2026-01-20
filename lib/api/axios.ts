import axios from "axios";

// const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

const axiosInstance = axios.create(
    {
        baseURL: "http://localhost:5050",
        headers: {
            "Content-Type": "application/json",
        }
    }
);

export default axiosInstance;