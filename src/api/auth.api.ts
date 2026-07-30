import { API_METHODS } from "@/constants";
import { api } from "@/service/api";


export interface User {
    email: string;
    full_name: string;
    id: number;
    role: "user" | "admin" | string;
}

interface LoginCredentials {
    email: string;
    password: string;
}
interface LoginResponse {
    access_token: string
    token_type: string
    user: User
}

export const authApi = api.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<LoginResponse, LoginCredentials>({
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


export const { useLoginMutation, useSignUpMutation } = authApi