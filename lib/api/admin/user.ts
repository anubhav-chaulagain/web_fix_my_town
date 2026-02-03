import axios from "../axios";
import { API } from "../endpoints";

export const createUser = async (userData: any) => {
    try {
        const response = await axios.post(
            API.ADMIN.CREATE,
            userData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data', // for file upload/multer
                }
            }
        );
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message
            || error.message || 'Create user failed');
    }
}

export const updateProfile = async(profileData: any) => {
    try{
        const response = await axios.put(
            API.ADMIN.UPDATE(profileData.email), 
            profileData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data' // for file upload/multer
                }
            }
        );
        return response.data;
    }catch(err: Error | any){
        throw new Error(
            err.response?.data?.message  // backend error message
            || err.message // general axios error message
            || "Update profile failed" // fallback message
        )
    }
}