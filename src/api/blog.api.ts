import { API_METHODS } from "@/constants";
import { api, RtkQueryTags } from "@/service/api";

export interface Blog {
    id: number;
    title: string;
    description: string;
    image_url: string | null;
    author_id: number;
    created_at: string;
    content: string;
}

export interface BlogPayload {
    title: string;
    description: string;
    image_url?: string | null;
}

export type BlogUpdatePayload = Partial<BlogPayload>;

export const blogApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getBlogs: builder.query<Blog[], void>({
            query: () => ({
                url: "/blogs/",
                method: API_METHODS.GET,
            }),
            providesTags: [RtkQueryTags.BLOG],
        }),
        getBlog: builder.query<Blog, number>({
            query: (id) => ({
                url: `/blogs/${id}`,
                method: API_METHODS.GET,
            }),
            providesTags: (_result, _error, id) => [{ type: RtkQueryTags.BLOG, id }],
        }),
        createBlog: builder.mutation<Blog, BlogPayload>({
            query: (body) => ({
                url: "/blogs/",
                method: API_METHODS.POST,
                body,
            }),
            invalidatesTags: [RtkQueryTags.BLOG],
        }),
        updateBlog: builder.mutation<Blog, { id: number; data: BlogUpdatePayload }>({
            query: ({ id, data }) => ({
                url: `/blogs/${id}`,
                method: API_METHODS.PATCH,
                body: data,
            }),
            invalidatesTags: [RtkQueryTags.BLOG],
        }),
        deleteBlog: builder.mutation<{ message: string }, number>({
            query: (id) => ({
                url: `/blogs/${id}`,
                method: API_METHODS.DELETE,
            }),
            invalidatesTags: [RtkQueryTags.BLOG],
        }),
    }),
});

export const {
    useGetBlogsQuery,
    useGetBlogQuery,
    useCreateBlogMutation,
    useUpdateBlogMutation,
    useDeleteBlogMutation,
} = blogApi;
