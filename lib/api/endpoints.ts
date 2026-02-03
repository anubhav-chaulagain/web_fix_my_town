// list of backend routes

export const API = {
    AUTH: {
        REGISTER: '/api/auth/register',
        LOGIN: '/api/auth/login',
    },
    ADMIN: {
        CREATE: "api/admin/users",
        GETALL: "api/admin/users",
        UPDATE: (email: string) => `api/admin/users/${email}`
    }
}