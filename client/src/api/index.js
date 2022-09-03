import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { history, BASENAME } from '../globals'

const baseQuery = fetchBaseQuery({
    baseUrl: '/api/',
    prepareHeaders: (headers, api) => {
        // FIXME 每一次都从 localStorage 中取是否不太合适
        const token = localStorage.getItem('X-Hera-Token')
        headers.set('Authorization', `Bearer ${token}`)
        return headers
    },
})
const baseQueryAuth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions)
    if (result.error && result.error.status === 401) {
        // 跳转到登录页面
        // 目前有应用预加载的拦截下，不会走到这里
        history.push(BASENAME + '/login')
    }
    return result
}

export const heraApi = createApi({
    reducerPath: 'heraApi',
    baseQuery: baseQueryAuth,
    tagTypes: ['Company', 'Record'],
    endpoints: (builder) => ({
        // 获取产品表数据
        getProduct: builder.query({
            query: () => 'product',
            transformResponse: res => res.data.products,
        }),
        // 获取公司信息
        getCompanyList: builder.query({
            query: () => 'company',
            transformResponse: res => res.data.company,
            providesTags: result => result
                ? [...result.map(({ _id: id }) => ({ type: 'Company', id }) ), { type: 'Company', id: 'LIST'}]
                : [{ type: 'Company', id: 'LIST'}]
        }),
        getCompany: builder.query({
            query: (id) => `company/${id}`,
            transformResponse: res => res.data.company,
            providesTags: (result, error, id) => [{ type: 'Company', id }],
        }),
        createCompany: builder.mutation({
            query: (company) => ({
                url: 'company',
                method: 'POST',
                body: company,
            }),
            transformResponse: res => res.data.company,
            invalidatesTags: [{ type: 'Company', id: 'LIST' }],
        }),
        updateCompany: builder.mutation({
            query: (id, company) => ({
                url: `company/${id}`,
                method: 'POST',
                body: company,
            }),
            transformResponse: res => res.data.company,
            invalidatesTags: (result, error, id) => [{ type: 'Company', id }],
        }),
        deleteCompany: builder.mutation({
            query: (id) => ({
                url: `company/${id}/delete`,
                method: 'POST',
            }),
            transformResponse: res => res.data.company,
            invalidatesTags: (result, error, id) => [{ type: 'Company', id }],
        }),
        // 获取订单信息
        getRecord: builder.query({
            query: (id) => `record/${id}`,
            transformResponse: res => res.data.record,
            providesTags: (result, error, id) => [{ type: 'Record', id }],
        }),
    })
})

export const {
    useGetProductQuery,
    useGetCompanyListQuery,
    useGetCompanyQuery,
    useCreateCompanyMutation,
    useUpdateCompanyMutation,
    useDeleteCompanyMutation,
    useGetRecordQuery,
} = heraApi