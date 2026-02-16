// server side processing
'use server'
import { register, login, requestPasswordReset, resetPassword } from "../api/auth";
import { setAuthToken, setUserData } from "../cookie";

export const handleRegister = async ( formData: any ) => {
    try {
        // how data sent from component to backend api
        const res = await register(formData);
        // component return logic
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
        // how data sent from component to backend api
        const res = await login(formData);
        // component return logic
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