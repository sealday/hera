import { getAuthToken } from 'utils'
import { history, BASENAME } from '../globalConfigs'

import { genApi } from 'hera-common'

const heraApi = genApi({
    onLogin() {
        history.push(BASENAME + '/login')
    },
    getAuthToken
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