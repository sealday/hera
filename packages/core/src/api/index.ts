import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { useSelector } from 'react-redux'

interface Response {
  data: any
  access_token?: string
}

interface ApiParam {
  baseUrl: string
  onLogin: () => void
  getAuthToken: () => string
}

const genApi = ({ baseUrl = '/api/', onLogin, getAuthToken }: ApiParam) => {
  const baseQuery = fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, _api) => {
      const token = getAuthToken()
      headers.set('Authorization', `Bearer ${token}`)
      return headers
    }
  })
  // 这三个类型我都填写 any 了
  const baseQueryAuth = async (args: any, api: any, extraOptions: any) => {
    let result = await baseQuery(args, api, extraOptions)
    if (result.error && result.error.status === 401) {
      onLogin()
    }
    return result
  }
  const heraApi = createApi({
    reducerPath: 'heraApi',
    baseQuery: baseQueryAuth,
    tagTypes: [
      'Company',
      'Record',
      'Plan',
      'Employee',
      'Subject',
      'Product',
      'Invoice',
      'Contract',
      'Project',
      'Other',
      'Operation',
      'Notification',
      'Loan',
      'User',
      'Rule',
      'Attendance'
    ],
    endpoints: builder => ({
      logout: builder.mutation<any, void>({
        query: () => ({
          url: 'logout',
          method: 'POST'
        })
      }),
      login: builder.mutation<any, string>({
        query: user => ({
          url: 'login',
          method: 'POST',
          body: user
        }),
        transformResponse: (res: Response) => res.access_token
      }),
      // 获取通知列表
      getNotificationList: builder.query({
        query: () => 'notifications',
        transformResponse: (res: Response) => res.data.notifications,
        providesTags: result =>
          result
            ? [
                ...result.map(({ _id: id }: any) => ({
                  type: 'Notification',
                  id
                })),
                { type: 'Notification', id: 'PARTIAL-LIST' }
              ]
            : [{ type: 'Notification', id: 'PARTIAL-LIST' }]
      }),
      // 获取全部通知列表
      getNotificationListAll: builder.query({
        query: () => 'notifications/all',
        transformResponse: (res: Response) => res.data.notifications,
        providesTags: result =>
          result
            ? [
                ...result.map(({ _id: id }: any) => ({
                  type: 'Notification',
                  id
                })),
                { type: 'Notification', id: 'LIST' }
              ]
            : [{ type: 'Notification', id: 'LIST' }]
      }),
      // 通知已读
      readNotification: builder.mutation({
        query: id => ({
          url: `notifications/${id}`,
          method: 'POST'
        }),
        invalidatesTags: (_result, _error, id) => [{ type: 'Notification', id }]
      }),
      // 全部已读
      readAllNotification: builder.mutation({
        query: () => ({
          url: `notifications/read_all`,
          method: 'POST'
        }),
        invalidatesTags: (_result, _error) => [
          { type: 'Notification', id: 'LIST' },
          { type: 'Notification', id: 'PARTIAL-LIST' }
        ]
      }),
      // 获取产品表数据
      getProduct: builder.query({
        query: () => 'product',
        transformResponse: (res: Response) => res.data.products
      }),
      // 获取用户信息
      getUserList: builder.query({
        query: () => 'user',
        transformResponse: (res: Response) => res.data.users,
        providesTags: result =>
          result
            ? [
                ...result.map(({ _id: id }: any) => ({ type: 'User', id })),
                { type: 'User', id: 'LIST' }
              ]
            : [{ type: 'User', id: 'LIST' }]
      }),
      // 获取公司信息
      getCompanyList: builder.query({
        query: () => 'company',
        transformResponse: (res: Response) => res.data.company,
        providesTags: result =>
          result
            ? [
                ...result.map(({ _id: id }: any) => ({ type: 'Company', id })),
                { type: 'Company', id: 'LIST' }
              ]
            : [{ type: 'Company', id: 'LIST' }]
      }),
      getCompany: builder.query({
        query: id => `company/${id}`,
        transformResponse: (res: Response) => res.data.company,
        providesTags: (_result, _error, id) => [{ type: 'Company', id }]
      }),
      createCompany: builder.mutation({
        query: company => ({
          url: 'company',
          method: 'POST',
          body: company
        }),
        transformResponse: (res: Response) => res.data.company,
        invalidatesTags: [{ type: 'Company', id: 'LIST' }]
      }),
      updateCompany: builder.mutation({
        query: ({ id, company }) => ({
          url: `company/${id}`,
          method: 'POST',
          body: company
        }),
        transformResponse: (res: Response) => res.data.company,
        invalidatesTags: (_result, _error, { id }) => [{ type: 'Company', id }]
      }),
      deleteCompany: builder.mutation({
        query: id => ({
          url: `company/${id}/delete`,
          method: 'POST'
        }),
        transformResponse: (res: Response) => res.data.company,
        invalidatesTags: (_result, _error, id) => [{ type: 'Company', id }]
      }),
      // 创建订单
      createRecord: builder.mutation({
        query: record => ({
          url: `record`,
          method: 'POST',
          body: record
        }),
        transformResponse: (res: Response) => res.data.record,
        invalidatesTags: () => [{ type: 'Record', id: 'LIST' }]
      }),
      // 获取订单信息
      getRecord: builder.query({
        query: id => `record/${id}`,
        transformResponse: (res: Response) => res.data.record,
        providesTags: (_result, _error, id) => [{ type: 'Record', id }]
      }),
      // 更新订单信息
      updateRecord: builder.mutation({
        query: ({ id, record }) => ({
          url: `record/${id}`,
          method: 'POST',
          body: record
        }),
        transformResponse: (res: Response) => res.data.record,
        invalidatesTags: (_result, _error, { id }) => [{ type: 'Record', id }]
      }),
      // 收到回单
      updateRecordReceipt: builder.mutation({
        query: id => ({
          url: `record/${id}/receipt`,
          method: 'POST'
        }),
        transformResponse: (res: Response) => res.data.record,
        invalidatesTags: (_result, _error, id) => [{ type: 'Record', id }]
      }),
      // 收到存根
      updateRecordCounterfoil: builder.mutation({
        query: id => ({
          url: `record/${id}/counterfoil`,
          method: 'POST'
        }),
        transformResponse: (res: Response) => res.data.record,
        invalidatesTags: (_result, _error, id) => [{ type: 'Record', id }]
      }),
      // 更新运输单
      updateTransport: builder.mutation({
        query: ({ id, transport }) => ({
          url: `record/${id}/transport`,
          method: 'POST',
          body: transport
        }),
        transformResponse: (res: Response) => res.data.record,
        invalidatesTags: (_result, _error, { id }) => [{ type: 'Record', id }]
      }),
      // 创建计算方案
      createPlan: builder.mutation({
        query: plan => ({
          url: `plan/${plan.type}`,
          method: 'POST',
          body: plan
        }),
        transformResponse: (res: Response) => res.data.plan,
        invalidatesTags: () => [{ type: 'Plan', id: 'LIST' }]
      }),
      // 获取计算方案
      getPlan: builder.query({
        query: id => `plan/${id}`,
        transformResponse: (res: Response) => res.data.plan,
        providesTags: (_result, _error, id) => [{ type: 'Plan', id }]
      }),
      // 获取员工列表
      getEmployeeList: builder.query({
        query: () => 'employees',
        transformResponse: (res: Response) => res.data.employee,
        providesTags: result =>
          result
            ? [
                ...result.map(({ _id: id }: any) => ({ type: 'Employee', id })),
                { type: 'Employee', id: 'LIST' }
              ]
            : [{ type: 'Employee', id: 'LIST' }]
      }),
      // 创建员工
      createEmployee: builder.mutation({
        query: employee => ({
          url: 'employees',
          method: 'POST',
          body: employee
        }),
        transformResponse: (res: Response) => res.data.employee,
        invalidatesTags: [{ type: 'Employee', id: 'LIST' }]
      }),
      // 获取员工信息
      getEmployee: builder.query({
        query: id => `employees/${id}`,
        transformResponse: (res: Response) => res.data.employee,
        providesTags: (_result, _error, id) => [{ type: 'Employee', id }]
      }),
      // 更新员工
      updateEmployee: builder.mutation({
        query: ({ id, employee }) => ({
          url: `employees/${id}`,
          method: 'PUT',
          body: employee
        }),
        transformResponse: (res: Response) => res.data.employee,
        invalidatesTags: (_result, _error, { id }) => [{ type: 'Employee', id }]
      }),
      // 删除员工
      deleteEmployee: builder.mutation({
        query: id => ({
          url: `employees/${id}`,
          method: 'DELETE'
        }),
        transformResponse: (res: Response) => res.data.employee,
        invalidatesTags: (_result, _error, id) => [{ type: 'Employee', id }]
      }),
      // 科目设定相关 API
      getSubjectList: builder.query({
        query: () => 'subject',
        transformResponse: (res: Response) => res.data,
        providesTags: result =>
          result
            ? [
                ...result.map(({ _id: id }: any) => ({ type: 'Subject', id })),
                { type: 'Subject', id: 'LIST' }
              ]
            : [{ type: 'Subject', id: 'LIST' }]
      }),
      createSubject: builder.mutation({
        query: subject => ({
          url: 'subject',
          method: 'POST',
          body: subject
        }),
        transformResponse: (res: Response) => res.data,
        invalidatesTags: [{ type: 'Subject', id: 'LIST' }]
      }),
      getSubject: builder.query({
        query: id => `subject/${id}`,
        transformResponse: (res: Response) => res.data,
        providesTags: (_result, _error, id) => [{ type: 'Subject', id }]
      }),
      updateSubject: builder.mutation({
        query: ({ id, subject }) => ({
          url: `subject/${id}`,
          method: 'PUT',
          body: subject
        }),
        transformResponse: (res: Response) => res.data,
        invalidatesTags: (_result, _error, { id }) => [{ type: 'Subject', id }]
      }),
      deleteSubject: builder.mutation({
        query: id => ({
          url: `subject/${id}`,
          method: 'DELETE'
        }),
        transformResponse: (res: Response) => res.data,
        invalidatesTags: (_result, _error, id) => [{ type: 'Subject', id }]
      }),
      // 合同
      getContractList: builder.query({
        query: () => 'contract',
        transformResponse: (res: Response) => res.data.contract,
        providesTags: result =>
          result
            ? [
                ...result.map(({ _id: id }: any) => ({ type: 'Contract', id })),
                { type: 'Contract', id: 'LIST' }
              ]
            : [{ type: 'Contract', id: 'LIST' }]
      }),
      updateContract: builder.mutation({
        query: ({ id, contract }) => ({
          url: `contract/${id}`,
          method: 'POST',
          body: contract
        }),
        transformResponse: (res: Response) => res.data.contract,
        invalidatesTags: (_result, _error, { id }) => [{ type: 'Contract', id }]
      }),
      updateContractTags: builder.mutation({
        query: ({ id, tags }) => ({
          url: `contract/${id}/tags`,
          method: 'POST',
          body: { tags }
        }),
        transformResponse: (res: Response) => res.data.contract,
        invalidatesTags: (_result, _error, { id }) => [{ type: 'Contract', id }]
      }),
      getContract: builder.query({
        query: id => `contract/${id}`,
        transformResponse: (res: Response) => res.data.contract,
        providesTags: (_result, _error, id) => [{ type: 'Contract', id }]
      }),
      createContract: builder.mutation({
        query: v => ({
          url: 'contract',
          method: 'POST',
          body: v
        }),
        transformResponse: (res: Response) => res.data.contract,
        invalidatesTags: [{ type: 'Contract', id: 'LIST' }]
      }),
      deleteContract: builder.mutation({
        query: id => ({
          url: `contract/${id}/delete`,
          method: 'POST'
        }),
        transformResponse: (res: Response) => res.data,
        invalidatesTags: (_result, _error, id) => [{ type: 'Contract', id }]
      }),
      finishContract: builder.mutation({
        query: id => ({
          url: `contract/${id}/finish`,
          method: 'POST'
        }),
        transformResponse: (res: Response) => res.data,
        invalidatesTags: (_result, _error, id) => [{ type: 'Contract', id }]
      }),
      unfinishContract: builder.mutation({
        query: id => ({
          url: `contract/${id}/unfinish`,
          method: 'POST'
        }),
        transformResponse: (res: Response) => res.data,
        invalidatesTags: (_result, _error, id) => [{ type: 'Contract', id }]
      }),
      addPlanContract: builder.mutation({
        query: ({ id, item }) => ({
          url: `contract/${id}/add_item`,
          method: 'POST',
          body: item
        }),
        transformResponse: (res: Response) => res.data,
        invalidatesTags: (_result, _error, { id }) => [{ type: 'Contract', id }]
      }),
      deletePlanContract: builder.mutation({
        query: ({ id, itemId }) => ({
          url: `contract/${id}/item/${itemId}/delete`,
          method: 'POST'
        }),
        transformResponse: (res: Response) => res.data,
        invalidatesTags: (_result, _error, { id }) => [{ type: 'Contract', id }]
      }),
      addCalcContract: builder.mutation({
        query: ({ id, calc }) => ({
          url: `contract/${id}/add_calc`,
          method: 'POST',
          body: calc
        }),
        transformResponse: (res: Response) => res.data,
        invalidatesTags: (_result, _error, { id }) => [{ type: 'Contract', id }]
      }),
      deleteCalcContract: builder.mutation<any, any>({
        query: ({ id, calcId }) => ({
          url: `contract/${id}/calc/${calcId}/delete`,
          method: 'POST'
        }),
        transformResponse: (res: Response) => res.data,
        invalidatesTags: (_result, _error, { id }) => [{ type: 'Contract', id }]
      }),
      restartCalcContract: builder.mutation({
        query: ({ id, calcId, calc }) => ({
          url: `contract/${id}/calc/${calcId}/restart`,
          method: 'POST',
          body: calc
        }),
        transformResponse: (res: Response) => res.data,
        invalidatesTags: (_result, _error, { id }) => [{ type: 'Contract', id }]
      }),
      // 产品
      getProductList: builder.query({
        query: () => 'product',
        transformResponse: (res: Response) => res.data,
        providesTags: result =>
          result
            ? [
                ...result.map(({ _id: id }: any) => ({ type: 'Product', id })),
                { type: 'Product', id: 'LIST' }
              ]
            : [{ type: 'Product', id: 'LIST' }]
      }),
      createProduct: builder.mutation({
        query: product => ({
          url: 'product',
          method: 'POST',
          body: product
        }),
        transformResponse: (res: Response) => res.data,
        invalidatesTags: [{ type: 'Product', id: 'LIST' }]
      }),
      updateProduct: builder.mutation({
        query: ({ id, product }) => ({
          url: `product/${id}`,
          method: 'PUT',
          body: product
        }),
        transformResponse: (res: Response) => res.data,
        invalidatesTags: (_result, _error, { id }) => [{ type: 'Product', id }]
      }),
      deleteProduct: builder.mutation({
        query: id => ({
          url: `product/${id}`,
          method: 'DELETE'
        }),
        transformResponse: (res: Response) => res.data,
        invalidatesTags: (_result, _error, id) => [{ type: 'Product', id }]
      }),
      // 发票
      getInvoiceList: builder.query({
        query: () => 'invoice',
        transformResponse: (res: Response) => res.data,
        providesTags: result =>
          result
            ? [
                ...result.map(({ _id: id }: any) => ({ type: 'Invoice', id })),
                { type: 'Invoice', id: 'LIST' }
              ]
            : [{ type: 'Invoice', id: 'LIST' }]
      }),
      createInvoice: builder.mutation({
        query: invoice => ({
          url: 'invoice',
          method: 'POST',
          body: invoice
        }),
        transformResponse: (res: Response) => res.data,
        invalidatesTags: [{ type: 'Invoice', id: 'LIST' }]
      }),
      getInvoice: builder.query({
        query: id => `invoice/${id}`,
        transformResponse: (res: Response) => res.data,
        providesTags: (_result, _error, id) => [{ type: 'Invoice', id }]
      }),
      updateInvoice: builder.mutation({
        query: ({ id, invoice }) => ({
          url: `invoice/${id}`,
          method: 'PUT',
          body: invoice
        }),
        transformResponse: (res: Response) => res.data,
        invalidatesTags: (_result, _error, { id }) => [{ type: 'Invoice', id }]
      }),
      deleteInvoice: builder.mutation({
        query: id => ({
          url: `invoice/${id}`,
          method: 'DELETE'
        }),
        transformResponse: (res: Response) => res.data,
        invalidatesTags: (_result, _error, id) => [{ type: 'Invoice', id }]
      }),
      // 仓库/项目列表
      getProjectListAll: builder.query<any, void>({
        query: () => 'project',
        transformResponse: (res: Response) => res.data.projects,
        providesTags: result =>
          result
            ? [
                ...result.map(({ _id: id }: any) => ({ type: 'Project', id })),
                { type: 'Project', id: 'LIST' }
              ]
            : [{ type: 'Project', id: 'LIST' }]
      }),
      getProject: builder.query({
        query: id => `project/${id}`,
        transformResponse: (res: Response) => res.data.project,
        providesTags: (_result, _error, id) => [{ type: 'Project', id }]
      }),
      createProject: builder.mutation({
        query: project => ({
          url: 'project',
          method: 'POST',
          body: project
        }),
        transformResponse: (res: Response) => res.data.project,
        invalidatesTags: [{ type: 'Project', id: 'LIST' }]
      }),
      updateProject: builder.mutation({
        query: ({ id, project }) => ({
          url: `project/${id}`,
          method: 'POST',
          body: project
        }),
        transformResponse: (res: Response) => res.data.project,
        invalidatesTags: (_result, _error, { id }) => [{ type: 'Project', id }]
      }),
      deleteProject: builder.mutation({
        query: id => ({
          url: `project/${id}/delete`,
          method: 'POST'
        }),
        transformResponse: (res: Response) => res.data.project,
        invalidatesTags: (_result, _error, id) => [{ type: 'Project', id }]
      }),
      changeProjectStatus: builder.mutation({
        query: ({ id, patch }) => ({
          url: `project/${id}/status`,
          method: 'POST',
          body: patch
        }),
        transformResponse: (res: Response) => res.data.project,
        invalidatesTags: (_result, _error, { id }) => [{ type: 'Project', id }]
      }),
      // 贷款管理
      getLoanList: builder.query({
        query: () => 'loan',
        transformResponse: (res: Response) => res.data,
        providesTags: result =>
          result
            ? [
                ...result.map(({ _id: id }: any) => ({ type: 'Loan', id })),
                { type: 'Loan', id: 'LIST' }
              ]
            : [{ type: 'Loan', id: 'LIST' }]
      }),
      createLoan: builder.mutation({
        query: loan => ({
          url: 'loan',
          method: 'POST',
          body: loan
        }),
        transformResponse: (res: Response) => res.data,
        invalidatesTags: [{ type: 'Loan', id: 'LIST' }]
      }),
      getLoan: builder.query({
        query: id => `loan/${id}`,
        transformResponse: (res: Response) => res.data,
        providesTags: (_result, _error, id) => [{ type: 'Loan', id }]
      }),
      updateLoan: builder.mutation({
        query: ({ id, loan }) => ({
          url: `loan/${id}`,
          method: 'PUT',
          body: loan
        }),
        transformResponse: (res: Response) => res.data,
        invalidatesTags: (_result, _error, { id }) => [{ type: 'Loan', id }]
      }),
      deleteLoan: builder.mutation({
        query: id => ({
          url: `loan/${id}`,
          method: 'DELETE'
        }),
        transformResponse: (res: Response) => res.data,
        invalidatesTags: (_result, _error, id) => [{ type: 'Loan', id }]
      }),
      // 考勤管理
      getAttendanceList: builder.query({
        query: () => 'attendance',
        transformResponse: (res: Response) => res.data,
        providesTags: result =>
          result
            ? [
                ...result.map(({ _id: id }: any) => ({
                  type: 'Attendance',
                  id
                })),
                { type: 'Attendance', id: 'LIST' }
              ]
            : [{ type: 'Attendance', id: 'LIST' }]
      }),
      createAttendance: builder.mutation({
        query: attendance => ({
          url: 'attendance',
          method: 'POST',
          body: attendance
        }),
        transformResponse: (res: Response) => res.data,
        invalidatesTags: [{ type: 'Attendance', id: 'LIST' }]
      }),
      getAttendance: builder.query({
        query: id => `attendance/${id}`,
        transformResponse: (res: Response) => res.data,
        providesTags: (_result, _error, id) => [{ type: 'Attendance', id }]
      }),
      updateAttendance: builder.mutation({
        query: ({ id, attendance }) => ({
          url: `attendance/${id}`,
          method: 'PUT',
          body: attendance
        }),
        transformResponse: (res: Response) => res.data,
        invalidatesTags: (_result, _error, { id }) => [
          { type: 'Attendance', id }
        ]
      }),
      deleteAttendance: builder.mutation({
        query: id => ({
          url: `attendance/${id}`,
          method: 'DELETE'
        }),
        transformResponse: (res: Response) => res.data,
        invalidatesTags: (_result, _error, id) => [{ type: 'Attendance', id }]
      }),
      // 规则
      getRuleList: builder.query({
        query: () => 'rule',
        transformResponse: (res: Response) => res.data,
        providesTags: result =>
          result
            ? [
                ...result.map(({ _id: id }: any) => ({ type: 'Rule', id })),
                { type: 'Rule', id: 'LIST' }
              ]
            : [{ type: 'Rule', id: 'LIST' }]
      }),
      createRule: builder.mutation({
        query: rule => ({
          url: 'rule',
          method: 'POST',
          body: rule
        }),
        transformResponse: (res: Response) => res.data,
        invalidatesTags: [{ type: 'Rule', id: 'LIST' }]
      }),
      getRule: builder.query({
        query: id => `rule/${id}`,
        transformResponse: (res: Response) => res.data,
        providesTags: (_result, _error, id) => [{ type: 'Rule', id }]
      }),
      updateRule: builder.mutation({
        query: ({ id, rule }) => ({
          url: `rule/${id}`,
          method: 'PUT',
          body: rule
        }),
        transformResponse: (res: Response) => res.data,
        invalidatesTags: (_result, _error, { id }) => [{ type: 'Rule', id }]
      }),
      deleteRule: builder.mutation({
        query: id => ({
          url: `rule/${id}`,
          method: 'DELETE'
        }),
        transformResponse: (res: Response) => res.data,
        invalidatesTags: (_result, _error, id) => [{ type: 'Rule', id }]
      }),
      // 其他产品
      getOtherList: builder.query({
        query: () => 'other',
        transformResponse: (res: Response) => res.data,
        providesTags: result =>
          result
            ? [
                ...result.map(({ _id: id }: any) => ({ type: 'Other', id })),
                { type: 'Other', id: 'LIST' }
              ]
            : [{ type: 'Other', id: 'LIST' }]
      }),
      createOther: builder.mutation({
        query: other => ({
          url: 'other',
          method: 'POST',
          body: other
        }),
        transformResponse: (res: Response) => res.data,
        invalidatesTags: [{ type: 'Other', id: 'LIST' }]
      }),
      getOther: builder.query({
        query: id => `other/${id}`,
        transformResponse: (res: Response) => res.data,
        providesTags: (_result, _error, id) => [{ type: 'Other', id }]
      }),
      updateOther: builder.mutation({
        query: ({ id, other }) => ({
          url: `other/${id}`,
          method: 'PUT',
          body: other
        }),
        transformResponse: (res: Response) => res.data,
        invalidatesTags: (_result, _error, { id }) => [{ type: 'Other', id }]
      }),
      deleteOther: builder.mutation({
        query: id => ({
          url: `other/${id}`,
          method: 'DELETE'
        }),
        transformResponse: (res: Response) => res.data,
        invalidatesTags: (_result, _error, id) => [{ type: 'Other', id }]
      }),
      // 搜索
      detailSearch: builder.mutation({
        query: condition => ({
          url: `store/detail_search`,
          method: 'POST',
          body: condition
        }),
        transformResponse: (res: Response) => res.data
      }),
      // 查询日志
      getLatestOperationList: builder.query({
        query: () => 'operation/top_k',
        transformResponse: (res: Response) => res.data.operations,
        providesTags: result =>
          result
            ? [
                ...result.map(({ _id: id }: any) => ({
                  type: 'Operation',
                  id
                })),
                { type: 'Operation', id: 'LIST' }
              ]
            : [{ type: 'Operation', id: 'LIST' }]
      })
    })
  })
  const useGetProjectListQuery = () => {
    const getProjectList = heraApi.useGetProjectListAllQuery()
    const store = useSelector((state: any) => state.system.store)
    const result = {
      ...getProjectList,
      data: getProjectList.data
        ? getProjectList.data.filter(
            (item: any) => item.status === 'UNDERWAY' && item._id !== store._id
          )
        : getProjectList.data
    }
    return result
  }

  const invalidateRecord = (id: string) => {
    return heraApi.util.invalidateTags([{ type: 'Record', id }])
  }

  ;(heraApi as any).useGetProjectListQuery = useGetProjectListQuery
  ;(heraApi as any).invalidateRecord = invalidateRecord

  return heraApi
}

export { genApi }