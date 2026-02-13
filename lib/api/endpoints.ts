// list of backend routes

export const API = {
    AUTH: {
        REGISTER: '/api/auth/register',
        LOGIN: '/api/auth/login',
        REQUEST_PASSWORD_RESET: '/api/auth/request-password-reset',
        RESET_PASSWORD: (token: string) => `/api/auth/reset-password/${token}`,
    },
    ADMIN: {
        CREATE: "/api/admin/users",
        GETALL: "/api/admin/users",
        UPDATE: (email: string) => `/api/admin/users/${email}`
    }
}