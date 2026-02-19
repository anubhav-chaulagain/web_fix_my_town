// list of backend routes

export const API = {
    AUTH: {
        REGISTER: '/api/auth/register',
        LOGIN: '/api/auth/login',
        REQUEST_PASSWORD_RESET: '/api/auth/request-password-reset',
        RESET_PASSWORD: (token: string) => `/api/auth/reset-password/${token}`,
        REPORT_STATS: '/api/auth/report-stats',
        AUTHORITY_STATS: '/api/auth/authority-stats',
    },
    ADMIN: {
        CREATE: "/api/admin/users",
        GETALL: "/api/admin/users",
        GET_ONE: (userId: string) => `/api/admin/users/${userId}`,
        UPDATE: (email: string) => `/api/admin/users/${email}`,
        DELETE: (userId: string) => `/api/admin/users/${userId}`,
    },
    ISSUES: {
        CREATE: '/api/issues',
        GETALL: '/api/issues',
        GET_ONE: (issueId: string) => `/api/issues/${issueId}`,
        UPDATE: (issueId: string) => `/api/issues/${issueId}`,
        DELETE: (issueId: string) => `/api/issues/${issueId}`,
        GET_MY_RECENT: '/api/issues/my-recent',
        // Authority routes
        UPDATE_STATUS: (issueId: string) => `/api/issues/${issueId}/status`,
        ASSIGN: (issueId: string) => `/api/issues/${issueId}/assign`,
        RESOLVE: (issueId: string) => `/api/issues/${issueId}/resolve`,
    },
     CREWS: {
        CREATE: '/api/crews',
        GETALL: '/api/crews',
        GET_AVAILABLE: '/api/crews/available',
        GET_ONE: (crewId: string) => `/api/crews/${crewId}`,
        UPDATE: (crewId: string) => `/api/crews/${crewId}`,
        DELETE: (crewId: string) => `/api/crews/${crewId}`,
        ASSIGN: (crewId: string) => `/api/crews/${crewId}/assign`,
        RELEASE: (crewId: string) => `/api/crews/${crewId}/release`,
    },
}