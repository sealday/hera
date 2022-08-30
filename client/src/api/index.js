import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const heraApi = createApi({
    reducerPath: 'heraApi',
    baseQuery: fetchBaseQuery({
        baseUrl: '/api/',
        prepareHeaders: (headers, api) => {
            // FIXME 每一次都从 localStorage 中取是否不太合适
            const token = localStorage.getItem('X-Hera-Token')
            headers.set('Authorization', `Bearer ${token}`)
            return headers
        },
    }),
    endpoints: (builder) => ({
        getProduct: builder.query({
            query: () => 'product',
            transformResponse(baseQueryReturnValue) {
                return baseQueryReturnValue.data.products
            }
        })
    })
})

export const { useGetProductQuery } = heraApi