import { VITE_API_BASE_URL } from "@/constants/env-settings";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
    baseUrl: VITE_API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
        const state = getState()
        // const token = state.authReducer.token
        const token = ""
        if (token) {
            headers.set("authorization", `Bearer ${token}`)
        }
        return headers
    }
})

export const RtkQueryTags = {
    AUTH: "auth",
}


export const api = createApi({
    baseQuery,
    tagTypes: Object.values(RtkQueryTags),
    endpoints: () => ({}),
})