import { VITE_API_BASE_URL } from "@/constants/env-settings";
import type { RootState } from "@/store/store";
import { logout } from "@/store/reducers/authReducer.slice"
import {
    createApi,
    fetchBaseQuery,
    type BaseQueryFn,
    type FetchArgs,
    type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { ROUTES } from "@/constants/routes";

const rawBaseQuery = fetchBaseQuery({
    baseUrl: VITE_API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.token;

        if (token) {
            headers.set("authorization", `Bearer ${token}`);
        }

        return headers;
    },
});

const baseQuery: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    const result = await rawBaseQuery(args, api, extraOptions);

    if (result.error?.status === 401) {
        // Clear auth state
        api.dispatch(logout());
        // Redirect to login
        window.location.href = ROUTES.SIGN_IN;
    }

    return result;
};

export const RtkQueryTags = {
    AUTH: "auth",
    BLOG: "blog",
    DOCUMENT: "document",
    COMMENT: "comment",
    USER: "user",
    BILLING: "billing",
} as const;

export const api = createApi({
    baseQuery,
    tagTypes: Object.values(RtkQueryTags),
    endpoints: () => ({}),
});
