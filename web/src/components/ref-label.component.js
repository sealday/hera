import _ from "lodash"
import { Error, Loading } from "."
import heraApi from "../api"

export default ({ item, value }) => {
  const { ref, label: labelKey, value: valueKey } = item.option
  let apiKey = `useGet${_.capitalize(ref)}ListQuery`
  // TODO 只用于信息查询，可以访问 All 风格 API
  if (_.has(heraApi, `useGet${_.capitalize(ref)}ListAllQuery`)) {
    apiKey = `useGet${_.capitalize(ref)}ListAllQuery`
  }
  const result = heraApi[apiKey]()
  if (result.isError) {
    return <Error />
  }
  if (result.isLoading) {
    return <Loading />
  }
  const current = result.data.find(item => item[valueKey] === value)
  return (
    <span>{_.get(current, labelKey)}</span>
  ) 
}