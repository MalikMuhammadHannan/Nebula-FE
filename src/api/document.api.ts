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

export interface ChatTurn {
    id: number;
    query: string;
    blogs: Blog[];
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
            invalidatesTags: (_result, _error, { session_id }) => [
                { type: RtkQueryTags.DOCUMENT, id: session_id },
            ],
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
        getChatHistory: builder.query<ChatTurn[], string>({
            query: (sessionId) => ({
                url: `/document/${sessionId}/history`,
                method: API_METHODS.GET,
            }),
            providesTags: (_result, _error, sessionId) => [
                { type: RtkQueryTags.DOCUMENT, id: sessionId },
            ],
        }),
    }),
});

export const {
    useUploadDocumentMutation,
    useQueryDocumentMutation,
    useGetAllSessionsQuery,
    useDeleteSessionMutation,
    useGetChatHistoryQuery,
} = documentApi;
