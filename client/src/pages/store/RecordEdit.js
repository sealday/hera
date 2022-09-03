import { useParams } from "react-router-dom"
import { useGetRecordQuery } from "../../api"
import { Error, Loading, PageHeader } from "../../components"

const RecordEdit = () => {
    const params = useParams()
    const { data, error, isLoading } = useGetRecordQuery(params.id)
    if (error) {
        return <Error />
    }
    if (isLoading) {
        return <Loading />
    }
    return <PageHeader
        title="订单编辑"
    />
}

export default RecordEdit