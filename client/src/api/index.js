import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { history, BASENAME } from '../globals'

const baseQuery = fetchBaseQuery({
    baseUrl: '/api/',
    prepareHeaders: (headers, _api) => {
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
    tagTypes: ['Company', 'Record', 'Plan', 'Employee', 'Subject'],
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
            providesTags: (_result, _error, id) => [{ type: 'Company', id }],
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
            invalidatesTags: (_result, _error, id) => [{ type: 'Company', id }],
        }),
        deleteCompany: builder.mutation({
            query: (id) => ({
                url: `company/${id}/delete`,
                method: 'POST',
            }),
            transformResponse: res => res.data.company,
            invalidatesTags: (_result, _error, id) => [{ type: 'Company', id }],
        }),
        // 创建订单
        createRecord: builder.mutation({
            query: ( record ) => ({
                url: `record`,
                method: 'POST',
                body: record,
            }),
            transformResponse: res => res.data.record,
            invalidatesTags: () => [{ type: 'Record', id: 'LIST' }],
        }),
        // 获取订单信息
        getRecord: builder.query({
            query: (id) => `record/${id}`,
            transformResponse: res => res.data.record,
            providesTags: (_result, _error, id) => [{ type: 'Record', id }],
        }),
        // 更新订单信息
        updateRecord: builder.mutation({
            query: ({ id, record }) => ({
                url: `record/${id}`,
                method: 'POST',
                body: record,
            }),
            transformResponse: res => res.data.record,
            invalidatesTags: (_result, _error, { id }) => [{ type: 'Record', id }],
        }),
        // 更新运输单
        updateTransport: builder.mutation({
            query: ({ id, transport }) => ({
                url: `record/${id}/transport`,
                method: 'POST',
                body: transport,
            }),
            transformResponse: res => res.data.record,
            invalidatesTags: (_result, _error, { id }) => [{ type: 'Record', id }],
        }),
        // 创建计算方案
        createPlan: builder.mutation({
            query: ( plan ) => ({
                url: `plan/${plan.type}`,
                method: 'POST',
                body: plan,
            }),
            transformResponse: res => res.data.plan,
            invalidatesTags: () => [{ type: 'Plan', id: 'LIST' }],
        }),
        // 获取计算方案
        getPlan: builder.query({
            query: (id) => `plan/${id}`,
            transformResponse: res => res.data.plan,
            providesTags: (_result, _error, id) => [{ type: 'Plan', id }],
        }),
        // 获取员工列表
        getEmployeeList: builder.query({
            query: () => 'employees',
            transformResponse: res => res.data.employee,
            providesTags: result => result
                ? [...result.map(({ _id: id }) => ({ type: 'Employee', id }) ), { type: 'Employee', id: 'LIST'}]
                : [{ type: 'Employee', id: 'LIST'}]
        }),
        // 创建员工
        createEmployee: builder.mutation({
            query: (employee) => ({
                url: 'employees',
                method: 'POST',
                body: employee,
            }),
            transformResponse: res => res.data.employee,
            invalidatesTags: [{ type: 'Employee', id: 'LIST' }],
        }),
        // 获取员工信息
        getEmployee: builder.query({
            query: (id) => `employees/${id}`,
            transformResponse: res => res.data.employee,
            providesTags: (_result, _error, id) => [{ type: 'Employee', id }],
        }),
        // 更新员工
        updateEmployee: builder.mutation({
            query: ({ id, employee }) => ({
                url: `employees/${id}`,
                method: 'PUT',
                body: employee,
            }),
            transformResponse: res => res.data.employee,
            invalidatesTags: (_result, _error, { id }) => [{ type: 'Employee', id }],
        }),
        // 删除员工
        deleteEmployee: builder.mutation({
            query: (id) => ({
                url: `employees/${id}`,
                method: 'DELETE',
            }),
            transformResponse: res => res.data.employee,
            invalidatesTags: (_result, _error, id) => [{ type: 'Employee', id }],
        }),
        // 科目设定相关 API
        getSubjectList: builder.query({
            query: () => 'subject',
            transformResponse: res => res.data,
            providesTags: result => result
                ? [...result.map(({ _id: id }) => ({ type: 'Subject', id }) ), { type: 'Subject', id: 'LIST'}]
                : [{ type: 'Subject', id: 'LIST'}]
        }),
        createSubject: builder.mutation({
            query: (subject) => ({
                url: 'subject',
                method: 'POST',
                body: subject,
            }),
            transformResponse: res => res.data,
            invalidatesTags: [{ type: 'Subject', id: 'LIST' }],
        }),
        getSubject: builder.query({
            query: (id) => `subject/${id}`,
            transformResponse: res => res.data,
            providesTags: (_result, _error, id) => [{ type: 'Subject', id }],
        }),
        updateSubject: builder.mutation({
            query: ({ id, subject }) => ({
                url: `subject/${id}`,
                method: 'PUT',
                body: subject,
            }),
            transformResponse: res => res.data,
            invalidatesTags: (_result, _error, { id }) => [{ type: 'Subject', id }],
        }),
        deleteSubject: builder.mutation({
            query: (id) => ({
                url: `subject/${id}`,
                method: 'DELETE',
            }),
            transformResponse: res => res.data,
            invalidatesTags: (_result, _error, id) => [{ type: 'Subject', id }],
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
    useCreateRecordMutation,
    useGetRecordQuery,
    useUpdateRecordMutation,
    useUpdateTransportMutation,
    useCreatePlanMutation,
    useGetPlanQuery,
} = heraApi

export default heraApi