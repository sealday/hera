import { Space } from "antd"
import moment from "moment"
import heraApi from "../../api"
import { Error, Loading, ModalFormButton, PageHeader, PopconfirmButton, ResultTable } from "../../components"
import { attendanceSchema } from "../../schema"
import { genTableColumn } from "../../utils/antd"

export default () => {
  const getAttendanceList = heraApi.useGetAttendanceListQuery()
  const [createAttendance] = heraApi.useCreateAttendanceMutation()
  const [deleteAttendance] = heraApi.useDeleteAttendanceMutation()
  const [updateAttendance] = heraApi.useUpdateAttendanceMutation()
  if (getAttendanceList.isError) {
    return <Error />
  }
  if (getAttendanceList.isLoading) {
    return <Loading />
  }
  const columns = genTableColumn(attendanceSchema).concat([{
    key: 'action',
    title: '操作',
    render(_, item) {
      return (
        <Space>
          <ModalFormButton
            onSubmit={v => updateAttendance({ id: item._id, attendance: v })}
            title='编辑考勤信息' type='link' schema={attendanceSchema} initialValues={item}>编辑</ModalFormButton>
          <PopconfirmButton  onConfirm={() => deleteAttendance(item._id)} danger title='确认删除'>删除</PopconfirmButton>
        </Space>
      )
    }
  }])
  const data = getAttendanceList.data
    // TODO 处理日期
    .map(record => ({ ...record, date: moment(record.date) }))
  return (
    <PageHeader
      title='员工考勤'
      onCreate={{
        title: '期初录入',
        onSubmit: createAttendance,
        schema: attendanceSchema,
      }}
    >
      <ResultTable columns={columns} dataSource={data} rowKey='_id' schema={attendanceSchema} />
    </PageHeader>
  )
}