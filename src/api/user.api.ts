import { API_METHODS } from "@/constants";
import { api, RtkQueryTags } from "@/service/api";

export interface AdminUser {
    id: number;
    full_name: string;
    email: string;
    role: string;
    is_active: boolean;
}

export interface AssistantQueryPayload {
    query: string;
}

export type UserAction = "activate" | "deactivate";

export interface AssistantResult {
    action: UserAction | null;
    matches: AdminUser[];
    message: string;
}

export const userApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getAllUsers: builder.query<AdminUser[], void>({
            query: () => ({
                url: "/users/",
                method: API_METHODS.GET,
            }),
            providesTags: [RtkQueryTags.USER],
        }),
        findUsersByQuery: builder.mutation<AssistantResult, AssistantQueryPayload>({
            query: (body) => ({
                url: "/users/assistant",
                method: API_METHODS.POST,
                body,
            }),
        }),
        deactivateUser: builder.mutation<AdminUser, number>({
            query: (userId) => ({
                url: `/users/${userId}/deactivate`,
                method: API_METHODS.POST,
                body: { confirm: true },
            }),
            invalidatesTags: [RtkQueryTags.USER],
        }),
        activateUser: builder.mutation<AdminUser, number>({
            query: (userId) => ({
                url: `/users/${userId}/activate`,
                method: API_METHODS.POST,
                body: { confirm: true },
            }),
            invalidatesTags: [RtkQueryTags.USER],
        }),
    }),
});

export const {
    useGetAllUsersQuery,
    useFindUsersByQueryMutation,
    useDeactivateUserMutation,
    useActivateUserMutation,
} = userApi;
