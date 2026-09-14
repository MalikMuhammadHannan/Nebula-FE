import { API_METHODS } from "@/constants";
import { api, RtkQueryTags } from "@/service/api";

export interface Comment {
    id: number;
    content: string;
    blog_id: number;
    user_id: number;
    created_at: string;
}

export interface CreateCommentPayload {
    blogId: number;
    content: string;
}

export interface DeleteCommentPayload {
    commentId: number;
    blogId: number;
}

export const commentApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getComments: builder.query<Comment[], number>({
            query: (blogId) => ({
                url: `/blogs/${blogId}/comments`,
                method: API_METHODS.GET,
            }),
            providesTags: (_result, _error, blogId) => [{ type: RtkQueryTags.COMMENT, id: blogId }],
        }),
        createComment: builder.mutation<Comment, CreateCommentPayload>({
            query: ({ blogId, content }) => ({
                url: `/blogs/${blogId}/comments`,
                method: API_METHODS.POST,
                body: { content },
            }),
            invalidatesTags: (_result, _error, { blogId }) => [{ type: RtkQueryTags.COMMENT, id: blogId }],
        }),
        deleteComment: builder.mutation<{ status: string }, DeleteCommentPayload>({
            query: ({ commentId }) => ({
                url: `/comments/${commentId}`,
                method: API_METHODS.DELETE,
            }),
            invalidatesTags: (_result, _error, { blogId }) => [{ type: RtkQueryTags.COMMENT, id: blogId }],
        }),
    }),
});

export const {
    useGetCommentsQuery,
    useCreateCommentMutation,
    useDeleteCommentMutation,
} = commentApi;
