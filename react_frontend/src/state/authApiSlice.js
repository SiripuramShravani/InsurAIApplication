import { apiSlice } from "../app/apiSlice";
import { setUser } from "./authSlice";

export const authApiSlice = apiSlice.injectEndpoints({

    endpoints: (build) => ({
        login: build.mutation({
            query: (loginFormValue) => {

                return {
                    url: '/v1/api/claim/verify-policy-number',
                    method: 'post',
                    body: { ...loginFormValue }
                }
            },
            providesTags: ["USER"]
        }),
        sendLogout: build.mutation({
            query: () => ({
                url: '/v1/api/claim/logout',
                method: 'POST',
            })
        }),
        claimDetails: build.mutation({
            query: (claimFormValue) => {
                return {
                    url: '/v1/api/claim/claim-capture',
                    method: 'post',
                    body: { ...claimFormValue }
                }
            },
            providesTags: ["CLAIM DETAILS"]
        }),
        companyDetails: build.mutation({
            query: (companyFormValues) => {
                console.log(companyFormValues);
                return {
                    url: '/v1/api/claim/company-capture',
                    method: 'post',
                    body: { ...companyFormValues }
                }
            },
            providesTags: ["COMPANY DETAILS"]
        }),
        userByPolicyNumber: build.mutation({
            query: (policy_number) => {
                return {
                    url: '/v1/api/claim/check-policy-number-get-user',
                    method: 'post',
                    body: { policy_number }
                }
            },
            providesTags: ["USERBY POLICYNUMBER"]
        }),
        updatecompanyDetails: build.mutation({
            query: ({ companyFormValues, selectedCompanyId }) => {
                console.log(companyFormValues, selectedCompanyId);
                return {
                    url: `/v1/api/claim/updatecompanybyid/${selectedCompanyId}`,
                    method: 'put',
                    body: { ...companyFormValues }
                };
            },
            providesTags: ["UPDATE COMPANY DETAILS"]
        }),

        getcompanyDetails: build.query({
            query: () => {
                return {
                    url: '/v1/api/claim/getallcompany',
                    method: 'get',

                }
            },
            providesTags: ["GET COMPANY DETAILS"]
        }),
        refresh: build.mutation({
            query: () => ({
                url: '/v1/api/claim/refresh',
                method: 'get'
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled
                    console.log("refresh mutation", data)
                    const { accessToken } = data
                    dispatch(setUser({ accessToken }))
                } catch (err) {
                    console.log(err)
                }
            }
        }),
        getFileNameUrl: build.mutation({
            query: (formData) => {
                console.log("formData", formData);
                return {
                    url: '/v1/api/claim/store-getfiles-url',
                    method: 'post',
                    body: formData
                }
            },
            providesTags: ["GETFILE NAMEURL"]
        }),
        getSupportingFileNameUrl: build.mutation({
            query: (formData) => {
                console.log("formData", formData);
                return {
                    url: '/v1/api/claim/store-getfiles-url',
                    method: 'post',
                    body: formData
                }
            },
            providesTags: ["GETFILE NAMEURL"]
        }),
        getLocation: build.mutation({
            query: (locationCoordinates) => {
                console.log("Coordinates available:", locationCoordinates);
                return {
                    url: '/v1/api/claim/location',
                    method: 'post',
                    body: { ...locationCoordinates }
                };
            },
            providesTags: ["LOCATION DETAILS"]
        }),

    })
})

export const {
    useLoginMutation,
    useClaimDetailsMutation,
    useRefreshMutation,
    useSendLogoutMutation,
    useCompanyDetailsMutation,
    useGetcompanyDetailsQuery,
    useUpdatecompanyDetailsMutation,
    useUserByPolicyNumberMutation,
    useGetFileNameUrlMutation,
    useGetLocationMutation,
    useGetSupportingFileNameUrlMutation
} = authApiSlice;
