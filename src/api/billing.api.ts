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
    }),
});

export const {
    useGetTokenBalanceQuery,
    useGetTokenPackagesQuery,
    useCreateCheckoutSessionMutation,
} = billingApi;
