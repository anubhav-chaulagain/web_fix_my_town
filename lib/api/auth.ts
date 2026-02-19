// Actual backend API calls
import axios from "./axios"; // IMPORTANT: axios instance with base URL
import { API } from './endpoints';

export const register = async(registerData: any) => {
    try {
        const response = await axios.post(API.AUTH.REGISTER, registerData);
        return response.data; // response ko body (what backend returns)
    } catch (err: Error | any) {
        // if 4xx/5xx error, axios throws error
        throw new Error(
            err.response?.data?.message //backend error message
            || err.message // generatl axios error message
            || "Registration failed" // fallback message
        )
    }
}

export const login = async(loginData: any) => {
    try {
        const response = await axios.post(API.AUTH.LOGIN, loginData);
        return response.data; // response ko body (what backend returns)
    } catch (err: Error | any) {
        // if 4xx/5xx error, axios throws error
        throw new Error(
            err.response?.data?.message //backend error message
            || err.message // generatl axios error message
            || "Login failed" // fallback message
        )
    }
}

export const requestPasswordReset = async (email: string) => {
    try {
        const response = await axios.post(API.AUTH.REQUEST_PASSWORD_RESET, { email });
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'Request password reset failed');
    }
}

export const resetPassword = async (token: string, newPassword: string) => {
    try {
        const response = await axios.post(API.AUTH.RESET_PASSWORD(token), { newPassword: newPassword });
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'Reset password failed');
    }
}

export const fetchReportStats = async () => {
    try {
        const response = await axios.get(API.AUTH.REPORT_STATS);
        return response.data; // Assuming backend returns stats in response body
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'Failed to fetch report stats');
    }  
};

export const fetchAuthorityStats = async () => {
    try {
        const response = await axios.get(API.AUTH.AUTHORITY_STATS);
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'Failed to fetch authority stats');
    }
}

