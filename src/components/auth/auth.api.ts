import { API_METHODS } from "@/constants";
import { api } from "@/service/api";

export const authApi = api.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: "/auth/login",
                method: API_METHODS.POST,
                body: credentials,
            }),
        }),
        signUp: builder.mutation({
            query: (credentials) => ({
                url: "/auth/register",
                method: API_METHODS.POST,
                body: credentials,
            }),
        }),
    })
})