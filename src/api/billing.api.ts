import { API_METHODS } from "@/constants";
import { api, RtkQueryTags } from "@/service/api";

export interface TokenBalance {
    token_balance: number;
}

export interface TokenPackage {
    key: string;
    tokens: number;
    amount: number;
}

export interface CheckoutSessionPayload {
    package: string;
}

export interface CheckoutSessionResult {
    checkout_url: string;
    session_id: string;
}

export interface VerifySessionResult {
    status: string;
    token_balance: number;
}

export const billingApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getTokenBalance: builder.query<TokenBalance, void>({
            query: () => ({
                url: "/billing/tokens",
                method: API_METHODS.GET,
            }),
            providesTags: [RtkQueryTags.BILLING],
        }),
        getTokenPackages: builder.query<TokenPackage[], void>({
            query: () => ({
                url: "/billing/packages",
                method: API_METHODS.GET,
            }),
        }),
        createCheckoutSession: builder.mutation<CheckoutSessionResult, CheckoutSessionPayload>({
            query: (body) => ({
                url: "/billing/checkout-session",
                method: API_METHODS.POST,
                body,
            }),
        }),
        verifyCheckoutSession: builder.mutation<VerifySessionResult, string>({
            query: (session_id) => ({
                url: "/billing/verify-session",
                method: API_METHODS.POST,
                body: { session_id },
            }),
            invalidatesTags: [RtkQueryTags.BILLING],
        }),
    }),
});

export const {
    useGetTokenBalanceQuery,
    useGetTokenPackagesQuery,
    useCreateCheckoutSessionMutation,
    useVerifyCheckoutSessionMutation,
} = billingApi;
