import type { Blog } from "@/api/blog.api";
import { API_METHODS } from "@/constants";
import { api, RtkQueryTags } from "@/service/api";

export interface GenerateBlogPayload {
    query: string;
}

export const aiBlogApi = api.injectEndpoints({
    endpoints: (builder) => ({
        generateAiBlog: builder.mutation<Blog, GenerateBlogPayload>({
            query: (body) => ({
                url: "/ai-blogs/generate",
                method: API_METHODS.POST,
                body,
            }),
            invalidatesTags: [RtkQueryTags.BLOG, RtkQueryTags.BILLING],
        }),
    }),
});

export const { useGenerateAiBlogMutation } = aiBlogApi;
