import { ROUTES } from "@/constants/routes";
import {
    ChartNoAxesColumn,
    FileText,
    LayoutDashboard,
    Sparkles,
    Users,
    UserRound,
} from "lucide-react";
import React from "react";


export type Role = "ADMIN" | "EDITOR" | "USER";

export interface AppRoute {
    path: string;
    element: React.LazyExoticComponent<React.ComponentType>;

    sidebar?: {
        icon?: React.ReactNode;
        group?: "blogs" | "ai" | "account" | "admin";
        label: string;
    };

    roles?: Role[];
}


const Dashboard = React.lazy(
    () => import("@/pages/dashboard")
);

const DocumentBlogs = React.lazy(
    () => import("@/pages/document-blogs")
);

const AiBlogs = React.lazy(
    () => import("@/pages/ai-blogs")
);
const Blogs = React.lazy(
    () => import("@/pages/blogs")
);
const Profile = React.lazy(
    () => import("@/pages/profile")
);
const AdminUsers = React.lazy(
    () => import("@/pages/admin-users")
);


export const appRoutes: AppRoute[] = [
    {
        path: ROUTES.DASHBOARD,
        element: Dashboard,

        sidebar: {
            icon: <LayoutDashboard size={20} />,
            label: "Dashboard",
        },
    },
    {
        path: ROUTES.DOCUMENTS_GENERATOR,
        element: DocumentBlogs,
        sidebar: {
            icon: <FileText size={20} />,
            label: "Document Blogs",
            group: "ai",
        },
        // roles: ["EDITOR", "ADMIN"],
        roles: ["USER", "EDITOR", "ADMIN"],

    },
    {
        path: ROUTES.AI_GENERATOR,
        element: AiBlogs,
        sidebar: {
            icon: <Sparkles size={20} />,
            label: "AI Blogs",
            group: "ai",
        },
        // roles: ["EDITOR", "ADMIN"],
        roles: ["USER", "EDITOR", "ADMIN"],

    },
    {
        path: ROUTES.BLOGS,
        element: Blogs,
        sidebar: {
            icon: <ChartNoAxesColumn size={20} />,
            label: "Blogs",
            group: "blogs",
        },
        roles: ["USER", "EDITOR", "ADMIN"],
    },
    {
        path: ROUTES.PROFILE,
        element: Profile,
        sidebar: {
            icon: <UserRound size={20} />,
            label: "Profile",
            group: "account",
        },
        roles: ["EDITOR", "ADMIN", "USER"],
    },
    {
        path: ROUTES.ADMIN_USERS,
        element: AdminUsers,
        sidebar: {
            icon: <Users size={20} />,
            label: "Admin Users",
            group: "admin",
        },
        roles: ["ADMIN"],
    },

];

export function getAccessibleRoutes(role?: string | null): AppRoute[] {
    if (!role) return appRoutes.filter((route) => !route.roles);

    const normalizedRole = role.toUpperCase() as Role;
    return appRoutes.filter(
        (route) => !route.roles || route.roles.includes(normalizedRole)
    );
}