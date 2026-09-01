import { API_METHODS } from "@/constants";
import type { Blog } from "@/api/blog.api";
import { api, RtkQueryTags } from "@/service/api";

export interface UploadDocumentResponse {
    session_id: string;
}

export interface QueryDocumentPayload {
    session_id: string;
    query: string;
}

export interface DocumentSession {
    session_id: string;
    filename: string;
    created_at: string;
}

export const documentApi = api.injectEndpoints({
    endpoints: (builder) => ({
        uploadDocument: builder.mutation<UploadDocumentResponse, FormData>({
            query: (body) => ({
                url: "/document/upload",
                method: API_METHODS.POST,
                body,
            }),
            invalidatesTags: [RtkQueryTags.DOCUMENT],
        }),
        queryDocument: builder.mutation<Blog[], QueryDocumentPayload>({
            query: (body) => ({
                url: "/document/query",
                method: API_METHODS.POST,
                body,
            }),
        }),
        getAllSessions: builder.query<DocumentSession[], void>({
            query: () => ({
                url: "/document/all",
                method: API_METHODS.GET,
            }),
            providesTags: [RtkQueryTags.DOCUMENT],
        }),
        deleteSession: builder.mutation<{ message: string }, string>({
            query: (session_id) => ({
                url: `/document/${session_id}`,
                method: API_METHODS.DELETE,
            }),
            invalidatesTags: [RtkQueryTags.DOCUMENT],
        }),
    }),
});

export const {
    useUploadDocumentMutation,
    useQueryDocumentMutation,
    useGetAllSessionsQuery,
    useDeleteSessionMutation,
} = documentApi;
