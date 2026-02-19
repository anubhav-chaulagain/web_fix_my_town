// lib/api/crew.ts
import axios from "./axios";
import { API } from './endpoints';

export const createCrew = async(crewData: any) => {
    try {
        const response = await axios.post(API.CREWS.CREATE, crewData);
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message
            || err.message
            || "Failed to create crew"
        )
    }
}

export const getAllCrews = async(params?: {
    status?: string;
    department?: string;
    page?: number;
    size?: number;
}) => {
    try {
        const response = await axios.get(API.CREWS.GETALL, { params });
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message
            || err.message
            || "Failed to fetch crews"
        )
    }
}

export const getAvailableCrews = async(department?: string) => {
    try {
        const params = department ? { department } : {};
        const response = await axios.get(API.CREWS.GET_AVAILABLE, { params });
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message
            || err.message
            || "Failed to fetch available crews"
        )
    }
}

export const getCrewById = async(crewId: string) => {
    try {
        const response = await axios.get(API.CREWS.GET_ONE(crewId));
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message
            || err.message
            || "Failed to fetch crew"
        )
    }
}

export const updateCrew = async(crewId: string, crewData: any) => {
    try {
        const response = await axios.put(API.CREWS.UPDATE(crewId), crewData);
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message
            || err.message
            || "Failed to update crew"
        )
    }
}

export const deleteCrew = async(crewId: string) => {
    try {
        const response = await axios.delete(API.CREWS.DELETE(crewId));
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message
            || err.message
            || "Failed to delete crew"
        )
    }
}

export const assignCrewToIssue = async(crewId: string, issueId: string) => {
    try {
        const response = await axios.patch(API.CREWS.ASSIGN(crewId), { issueId });
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message
            || err.message
            || "Failed to assign crew"
        )
    }
}

export const releaseCrewFromIssue = async(crewId: string) => {
    try {
        const response = await axios.patch(API.CREWS.RELEASE(crewId));
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message
            || err.message
            || "Failed to release crew"
        )
    }
}