import axios from "axios";
import { API } from "../endpoints";

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