import { API_METHODS } from "@/constants";
import { api } from "@/service/api";

export interface LikeResponse {
    status: "liked" | "unliked";
    total_likes: number;
}

export const likeApi = api.injectEndpoints({
    endpoints: (builder) => ({
        likeBlog: builder.mutation<LikeResponse, number>({
            query: (blogId) => ({
                url: `/blogs/${blogId}/like`,
                method: API_METHODS.POST,
            }),
        }),
        unlikeBlog: builder.mutation<LikeResponse, number>({
            query: (blogId) => ({
                url: `/blogs/${blogId}/like`,
                method: API_METHODS.DELETE,
            }),
        }),
    }),
});

export const { useLikeBlogMutation, useUnlikeBlogMutation } = likeApi;
