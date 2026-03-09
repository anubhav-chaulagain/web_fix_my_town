'use server'
import { register, login, requestPasswordReset, resetPassword, fetchReportStats, fetchAuthorityStats, updateProfile } from "../api/auth";
import { setAuthToken, setUserData } from "../cookie";

export const handleRegister = async ( formData: any ) => {
    try {
        const res = await register(formData);
        if (res.success){
            return {
                success:true,
                data: res.data,
                message: "Registration successful"
            };
        }
        return { success: false, message: res.message || "Registration failed"};
    } catch (err: Error | any) {
        return { success: false, message: err.message || "Registration failed"};
    }
}

export const handleLogin = async ( formData: any ) => {
    try {
        const res = await login(formData);
        if (res.success){
            const token = res.token;
            console.log("Received token", token);
            await setAuthToken(token);
            await setUserData(res.data);

            return {
                success:true,
                data: res.data,
                message: "Login successful"
            };
        }
        return { success: false, message: res.message || "Login failed"};
    } catch (err: Error | any) {
        return { success: false, message: err.message || "Login failed"};
    }
}

export const handleRequestPasswordReset = async (email: string) => {
    try {
        const response = await requestPasswordReset(email);
        if (response.success) {
            return {
                success: true,
                message: "Password reset email sent successfully"
            }
        }
        return { success: false, message: response.message || 'Request password reset failed' }
    } catch (error: Error | any) {
        return { success: false, message: error.message || 'Request password reset action failed' };
    }
}

export const handleResetPassword = async (token: string, newPassword: string) => {
    try {
        const response = await resetPassword(token, newPassword);
        if (response.success) {
            return {
                success: true,
                message: 'Password has been reset successfully'
            }
        }
        return { success: false, message: response.message || 'Reset password failed' }
    } catch (error: Error | any) {
        return { success: false, message: error.message || 'Reset password action failed' }
    }
};

export const handleFetchReportStats = async () => {
    try {
        const response = await fetchReportStats();
        if (response.success) {
            return {
                success: true,
                data: response.data,
                message: 'Report stats fetched successfully'
            }
        }
        return { success: false, message: response.message || 'Failed to fetch report stats' }
    } catch (error: Error | any) {
        return { success: false, message: error.message || 'Failed to fetch report stats' }
    }
}

export const handleFetchAuthorityStats = async () => {
    try {
        const response = await fetchAuthorityStats();
        if (response.success) {
            return {
                success: true,
                data: response.data,
                message: 'Authority stats fetched successfully'
            }
        }
        return { success: false, data: null, message: response.message || 'Failed to fetch authority stats' }
    } catch (error: Error | any) {
        return { success: false, data: null, message: error.message || 'Failed to fetch authority stats' }
    }
}

export const handleUpdateProfile = async (formData: FormData) => {
    try {
        const res = await updateProfile(formData);
        if (res.success) {
            await setUserData(res.data);
            return { success: true, data: res.data, message: "Profile updated successfully" };
        }
        return { success: false, message: res.message || "Profile update failed" };
    } catch (err: Error | any) {
        return { success: false, message: err.message || "Profile update failed" };
    }
}