import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setUser } from '../state/authSlice' 
const baseQuery = fetchBaseQuery({
    baseUrl: process.env.REACT_APP_URL,
    
    
    
    
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token
        console.log("token",token)
        if (token) {
            headers.set("authorization", `Bearer ${token}`)
        }
        return headers
    },
    credentials:'include',
    mode:'cors',
})

const baseQueryWithReauth = async (args, api, extraOptions) => {
    console.log("baseQueryWithReauth")
    console.log("args",args) 
    console.log("api",api) 
    console.log(extraOptions) 

    let result = await baseQuery(args, api, extraOptions)
    console.log("args in basequery",args)
    console.log("api in basequery",api)
    console.log('sending refresh token',result)
    
    if (result?.error?.status === 403) {
       

        
        const refreshResult = await baseQuery('/auth/refresh', api, extraOptions)
        console.log("refresh result",refreshResult)
        if (refreshResult?.data) {

            
            api.dispatch(setUser({ ...refreshResult.data }))

           
            result = await baseQuery(args, api, extraOptions)
        } else {

            if (refreshResult?.error?.status === 403) {
                refreshResult.error.data.message = "Your login has expired."
            }
            return refreshResult
        }
    }

    return result
}

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    tagTypes: ['User'],
    endpoints: builder => ({})
})