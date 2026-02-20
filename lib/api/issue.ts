// Actual backend API calls for issues
import axios from "./axios"; // IMPORTANT: axios instance with base URL
import { API } from './endpoints';

export const createIssue = async(issueData: FormData) => {
    try {
        const response = await axios.post(API.ISSUES.CREATE, issueData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data; // response ko body (what backend returns)
    } catch (err: Error | any) {
        // if 4xx/5xx error, axios throws error
        throw new Error(
            err.response?.data?.message // backend error message
            || err.message // general axios error message
            || "Failed to create issue" // fallback message
        )
    }
}

export const getAllIssues = async(params?: {
    status?: string;
    size?: string;
    category?: string;
    page?: number;
    limit?: number;
}) => {
    try {
        const response = await axios.get(API.ISSUES.GETALL, { params });
        return response.data; // response ko body (what backend returns)
    } catch (err: Error | any) {
        // if 4xx/5xx error, axios throws error
        throw new Error(
            err.response?.data?.message // backend error message
            || err.message // general axios error message
            || "Failed to fetch issues" // fallback message
        )
    }
}

export const getIssueById = async(issueId: string) => {
    try {
        const response = await axios.get(API.ISSUES.GET_ONE(issueId));
        return response.data; // response ko body (what backend returns)
    } catch (err: Error | any) {
        // if 4xx/5xx error, axios throws error
        throw new Error(
            err.response?.data?.message // backend error message
            || err.message // general axios error message
            || "Failed to fetch issue" // fallback message
        )
    }
}

export const updateIssue = async(issueId: string, issueData: FormData | any) => {
    try {
        const config = issueData instanceof FormData 
            ? { headers: { 'Content-Type': 'multipart/form-data' } }
            : {};
            
        const response = await axios.put(API.ISSUES.UPDATE(issueId), issueData, config);
        return response.data; // response ko body (what backend returns)
    } catch (err: Error | any) {
        // if 4xx/5xx error, axios throws error
        throw new Error(
            err.response?.data?.message // backend error message
            || err.message // general axios error message
            || "Failed to update issue" // fallback message
        )
    }
}

export const deleteIssue = async(issueId: string) => {
    try {
        const response = await axios.delete(API.ISSUES.DELETE(issueId));
        return response.data; // response ko body (what backend returns)
    } catch (err: Error | any) {
        // if 4xx/5xx error, axios throws error
        throw new Error(
            err.response?.data?.message // backend error message
            || err.message // general axios error message
            || "Failed to delete issue" // fallback message
        )
    }
}

// Optional: Additional helper functions based on your backend capabilities

export const updateIssueStatus = async(issueId: string, status: string) => {
    try {
        const response = await axios.patch(API.ISSUES.UPDATE(issueId), { status });
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message
            || err.message
            || "Failed to update issue status"
        )
    }
}

export const getUserIssues = async(userId?: string) => {
    try {
        const params = userId ? { userId } : {};
        const response = await axios.get(API.ISSUES.GETALL, { params });
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message
            || err.message
            || "Failed to fetch user issues"
        )
    }
}

export const getMyRecentIssues = async () => {
    try {
        const response = await axios.get(API.ISSUES.GET_MY_RECENT);
        return response.data;
    } catch (err: Error | any) {
        throw new Error(err.response?.data?.message || err.message || "Failed to fetch recent issues");
    }
}

// Add these to the existing file

export const assignIssue = async(issueId: string, assignedTo: string, priority?: string) => {
    try {
        const response = await axios.patch(API.ISSUES.ASSIGN(issueId), { 
            assignedTo, 
            priority 
        });
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message
            || err.message
            || "Failed to assign issue"
        )
    }
}

export const resolveIssue = async(issueId: string, remarks?: string) => {
    try {
        const response = await axios.patch(API.ISSUES.RESOLVE(issueId), { 
            remarks 
        });
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message
            || err.message
            || "Failed to resolve issue"
        )
    }
}

export const updateIssueStatusOnly = async(issueId: string, status: string, remarks?: string) => {
    try {
        const response = await axios.patch(API.ISSUES.UPDATE_STATUS(issueId), { 
            status,
            remarks 
        });
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message
            || err.message
            || "Failed to update issue status"
        )
    }
}

export const getMyAssignedIssues = async(params?: {
    status?: string;
    category?: string;
    priority?: string;
    search?: string;
    page?: number;
    size?: string;
}) => {
    try {
        const response = await axios.get(API.ISSUES.GET_MY_ASSIGNED, { params });
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message
            || err.message
            || "Failed to fetch assigned issues"
        )
    }
}