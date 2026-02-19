// lib/actions/crew-actions.ts
'use server'
import {
    createCrew,
    getAllCrews,
    getAvailableCrews,
    getCrewById,
    updateCrew,
    deleteCrew,
    assignCrewToIssue,
    releaseCrewFromIssue
} from "../api/crew";

export const handleCreateCrew = async (crewData: any) => {
    try {
        const res = await createCrew(crewData);
        if (res.success) {
            return {
                success: true,
                data: res.data,
                message: "Crew created successfully"
            };
        }
        return { success: false, data: null, message: res.message || "Failed to create crew" };
    } catch (err: Error | any) {
        return { success: false, data: null, message: err.message || "Failed to create crew" };
    }
}

export const handleGetAllCrews = async (params?: {
    status?: string;
    department?: string;
    page?: number;
    size?: number;
}) => {
    try {
        const res = await getAllCrews(params);
        if (res.success) {
            return {
                success: true,
                data: res.data,
                pagination: res.pagination,
                message: "Crews fetched successfully"
            };
        }
        return { success: false, data: null, pagination: null, message: res.message || "Failed to fetch crews" };
    } catch (err: Error | any) {
        return { success: false, data: null, pagination: null, message: err.message || "Failed to fetch crews" };
    }
}

export const handleGetAvailableCrews = async (department?: string) => {
    try {
        const res = await getAvailableCrews(department);
        if (res.success) {
            return {
                success: true,
                data: res.data,
                message: "Available crews fetched successfully"
            };
        }
        return { success: false, data: null, message: res.message || "Failed to fetch available crews" };
    } catch (err: Error | any) {
        return { success: false, data: null, message: err.message || "Failed to fetch available crews" };
    }
}

export const handleGetCrewById = async (crewId: string) => {
    try {
        const res = await getCrewById(crewId);
        if (res.success) {
            return {
                success: true,
                data: res.data,
                message: "Crew fetched successfully"
            };
        }
        return { success: false, data: null, message: res.message || "Failed to fetch crew" };
    } catch (err: Error | any) {
        return { success: false, data: null, message: err.message || "Failed to fetch crew" };
    }
}

export const handleUpdateCrew = async (crewId: string, crewData: any) => {
    try {
        const res = await updateCrew(crewId, crewData);
        if (res.success) {
            return {
                success: true,
                data: res.data,
                message: "Crew updated successfully"
            };
        }
        return { success: false, data: null, message: res.message || "Failed to update crew" };
    } catch (err: Error | any) {
        return { success: false, data: null, message: err.message || "Failed to update crew" };
    }
}

export const handleDeleteCrew = async (crewId: string) => {
    try {
        const res = await deleteCrew(crewId);
        if (res.success) {
            return {
                success: true,
                message: "Crew deleted successfully"
            };
        }
        return { success: false, message: res.message || "Failed to delete crew" };
    } catch (err: Error | any) {
        return { success: false, message: err.message || "Failed to delete crew" };
    }
}

export const handleAssignCrewToIssue = async (crewId: string, issueId: string) => {
    try {
        const res = await assignCrewToIssue(crewId, issueId);
        if (res.success) {
            return {
                success: true,
                data: res.data,
                message: "Crew assigned successfully"
            };
        }
        return { success: false, data: null, message: res.message || "Failed to assign crew" };
    } catch (err: Error | any) {
        return { success: false, data: null, message: err.message || "Failed to assign crew" };
    }
}

export const handleReleaseCrewFromIssue = async (crewId: string) => {
    try {
        const res = await releaseCrewFromIssue(crewId);
        if (res.success) {
            return {
                success: true,
                data: res.data,
                message: "Crew released successfully"
            };
        }
        return { success: false, data: null, message: res.message || "Failed to release crew" };
    } catch (err: Error | any) {
        return { success: false, data: null, message: err.message || "Failed to release crew" };
    }
}