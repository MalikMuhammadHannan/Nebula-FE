import { VITE_API_BASE_URL } from "@/constants/env-settings";
import type { RootState } from "@/store/store";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
    baseUrl: VITE_API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.token
        if (token) {
            headers.set("authorization", `Bearer ${token}`)
        }
        return headers
    }
})

export const RtkQueryTags = {
    AUTH: "auth",
    BLOG: "blog",
    DOCUMENT: "document",
}


export const api = createApi({
    baseQuery,
    tagTypes: Object.values(RtkQueryTags),
    endpoints: () => ({}),
})