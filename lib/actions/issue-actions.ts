// server side processing
'use server'
import { 
    createIssue, 
    getAllIssues, 
    getIssueById, 
    updateIssue, 
    deleteIssue,
    updateIssueStatus,
    getUserIssues, 
    getMyRecentIssues,
    updateIssueStatusOnly,
    resolveIssue,
    assignIssue,
    getMyAssignedIssues,
    getUnassignedIssues
} from "../api/issue";

export const handleCreateIssue = async (formData: FormData) => {
    try {
        // how data sent from component to backend api
        const res = await createIssue(formData);
        // component return logic
        if (res.success) {
            return {
                success: true,
                data: res.data,
                message: "Issue reported successfully"
            };
        }
        return { success: false, message: res.message || "Failed to report issue" };
    } catch (err: Error | any) {
        return { success: false, message: err.message || "Failed to report issue" };
    }
}

export const handleGetAllIssues = async (params?: {
    status?: string;
    size?: string;
    category?: string;
    page?: number;
    limit?: number;
}) => {
    try {
        // how data sent from component to backend api
        const res = await getAllIssues(params);
        // component return logic
        if (res.success) {
            return {
                success: true,
                data: res.data,
                pagination: res.pagination,
                message: "Issues fetched successfully"
            };
        }
        return { success: false, message: res.message || "Failed to fetch issues" };
    } catch (err: Error | any) {
        return { success: false, message: err.message || "Failed to fetch issues" };
    }
}

export const handleGetIssueById = async (issueId: string) => {
    try {
        // how data sent from component to backend api
        const res = await getIssueById(issueId);
        // component return logic
        if (res.success) {
            return {
                success: true,
                data: res.data,
                message: "Issue fetched successfully"
            };
        }
        return { success: false, message: res.message || "Failed to fetch issue" };
    } catch (err: Error | any) {
        return { success: false, message: err.message || "Failed to fetch issue" };
    }
}

export const handleUpdateIssue = async (issueId: string, formData: FormData | any) => {
    try {
        // how data sent from component to backend api
        const res = await updateIssue(issueId, formData);
        // component return logic
        if (res.success) {
            return {
                success: true,
                data: res.data,
                message: "Issue updated successfully"
            };
        }
        return { success: false, message: res.message || "Failed to update issue" };
    } catch (err: Error | any) {
        return { success: false, message: err.message || "Failed to update issue" };
    }
}

export const handleDeleteIssue = async (issueId: string) => {
    try {
        // how data sent from component to backend api
        const res = await deleteIssue(issueId);
        // component return logic
        if (res.success) {
            return {
                success: true,
                message: "Issue deleted successfully"
            };
        }
        return { success: false, message: res.message || "Failed to delete issue" };
    } catch (err: Error | any) {
        return { success: false, message: err.message || "Failed to delete issue" };
    }
}

export const handleUpdateIssueStatus = async (issueId: string, status: string) => {
    try {
        // how data sent from component to backend api
        const res = await updateIssueStatus(issueId, status);
        // component return logic
        if (res.success) {
            return {
                success: true,
                data: res.data,
                message: "Issue status updated successfully"
            };
        }
        return { success: false, message: res.message || "Failed to update issue status" };
    } catch (err: Error | any) {
        return { success: false, message: err.message || "Failed to update issue status" };
    }
}

export const handleGetUserIssues = async (userId?: string) => {
    try {
        // how data sent from component to backend api
        const res = await getUserIssues(userId);
        // component return logic
        if (res.success) {
            return {
                success: true,
                data: res.data,
                message: "User issues fetched successfully"
            };
        }
        return { success: false, message: res.message || "Failed to fetch user issues" };
    } catch (err: Error | any) {
        return { success: false, message: err.message || "Failed to fetch user issues" };
    }
}

export const handleGetMyRecentIssues = async () => {
    try {
        const res = await getMyRecentIssues();
        if (res.success) {
            return { success: true, data: res.data, message: res.message };
        }
        return { success: false, data: null, message: res.message || "Failed to fetch recent issues" };
    } catch (err: Error | any) {
        return { success: false, data: null, message: err.message || "Failed to fetch recent issues" };
    }
}

export const handleAssignIssue = async (issueId: string, assignedTo: string) => {
    try {
        const res = await assignIssue(issueId, assignedTo);
        if (res.success) {
            return {
                success: true,
                data: res.data,
                message: "Issue assigned successfully"
            };
        }
        return { success: false, data: null, message: res.message || "Failed to assign issue" };
    } catch (err: Error | any) {
        return { success: false, data: null, message: err.message || "Failed to assign issue" };
    }
}

export const handleResolveIssue = async (issueId: string, remarks?: string) => {
    try {
        const res = await resolveIssue(issueId, remarks);
        if (res.success) {
            return {
                success: true,
                data: res.data,
                message: "Issue resolved successfully"
            };
        }
        return { success: false, data: null, message: res.message || "Failed to resolve issue" };
    } catch (err: Error | any) {
        return { success: false, data: null, message: err.message || "Failed to resolve issue" };
    }
}

export const handleUpdateIssueStatusOnly = async (issueId: string, status: string, remarks?: string) => {
    try {
        const res = await updateIssueStatusOnly(issueId, status, remarks);
        if (res.success) {
            return {
                success: true,
                data: res.data,
                message: "Issue status updated successfully"
            };
        }
        return { success: false, data: null, message: res.message || "Failed to update status" };
    } catch (err: Error | any) {
        return { success: false, data: null, message: err.message || "Failed to update status" };
    }
}

export const handleGetMyAssignedIssues = async (params?: {
    status?: string;
    category?: string;
    priority?: string;
    search?: string;
    page?: number;
    size?: string;
}) => {
    try {
        const res = await getMyAssignedIssues(params);
        if (res.success) {
            return {
                success: true,
                data: res.data,
                pagination: res.pagination,
                message: "Assigned issues fetched successfully"
            };
        }
        return { 
            success: false, 
            data: null, 
            pagination: null, 
            message: res.message || "Failed to fetch assigned issues" 
        };
    } catch (err: Error | any) {
        return { 
            success: false, 
            data: null, 
            pagination: null, 
            message: err.message || "Failed to fetch assigned issues" 
        };
    }
}

export const handleGetUnassignedIssues = async (limit = 5) => {
    try {
        const res = await getUnassignedIssues(limit);
        if (res.success) {
            return {
                success: true,
                data: res.data,
                message: res.message,
            };
        }
        return { success: false, data: null, message: res.message || "Failed to fetch unassigned issues" };
    } catch (err: Error | any) {
        return { success: false, data: null, message: err.message || "Failed to fetch unassigned issues" };
    }
}