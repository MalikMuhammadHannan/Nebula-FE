export const ROUTES = {
    // Public
    LANDING: "/",
    SIGN_IN: "/sign-in",
    SIGN_UP: "/sign-up",
    FORGOT_PASSWORD: "/forgot-password",
    RESET_PASSWORD: "/reset-password",

    // Dashboard
    DASHBOARD: "/dashboard",

    BLOGS: "/dashboard/blogs",

    AI_GENERATOR: "/dashboard/ai-blogs",
    DOCUMENTS_GENERATOR: "/dashboard/document-blogs",


    PROFILE: "/dashboard/profile",

    SUBSCRIPTION: "/dashboard/subscription",
    BILLING: "/dashboard/billing",

    HISTORY: "/dashboard/history",

    // Admin
    ADMIN: "/dashboard/admin",
    ADMIN_USERS: "/dashboard/admin/users",
    ADMIN_BLOGS: "/dashboard/admin/blogs",
    ADMIN_PLANS: "/dashboard/admin/plans",
    ADMIN_PAYMENTS: "/dashboard/admin/payments",
    ADMIN_LOGS: "/dashboard/admin/logs",
    ADMIN_SETTINGS: "/dashboard/admin/settings",
} as const;

export const PROTECTED_ROUTES = {
    DASHBOARD: ROUTES.DASHBOARD,
    BLOGS: ROUTES.BLOGS,
    AI_GENERATOR: ROUTES.AI_GENERATOR,
    DOCUMENTS_GENERATOR: ROUTES.DOCUMENTS_GENERATOR,
    PROFILE: ROUTES.PROFILE,
    SUBSCRIPTION: ROUTES.SUBSCRIPTION,
    BILLING: ROUTES.BILLING,
    HISTORY: ROUTES.HISTORY,
    ADMIN: ROUTES.ADMIN,
    ADMIN_USERS: ROUTES.ADMIN_USERS,
    ADMIN_BLOGS: ROUTES.ADMIN_BLOGS,
    ADMIN_PLANS: ROUTES.ADMIN_PLANS,
    ADMIN_PAYMENTS: ROUTES.ADMIN_PAYMENTS,
    ADMIN_LOGS: ROUTES.ADMIN_LOGS,
    ADMIN_SETTINGS: ROUTES.ADMIN_SETTINGS
}


export const ADMIN_ROUTES = [
    PROTECTED_ROUTES.ADMIN,
    PROTECTED_ROUTES.ADMIN_USERS,
    PROTECTED_ROUTES.ADMIN_BLOGS,
    PROTECTED_ROUTES.ADMIN_PLANS,
    PROTECTED_ROUTES.ADMIN_PAYMENTS,
    PROTECTED_ROUTES.ADMIN_LOGS,
    PROTECTED_ROUTES.ADMIN_SETTINGS
]