import _ from "lodash"
import { Error, Loading } from "."
import heraApi from "../api"

export default ({ item, value }) => {
  const { ref, label: labelKey, value: valueKey } = item.option
  const result = heraApi[`useGet${_.capitalize(ref)}ListQuery`]()
  if (result.isError) {
    return <Error />
  }
  if (result.isLoading) {
    return <Loading />
  }
  const labels = _.map(value, v => _.find(result.data, item => item[valueKey] === v)[labelKey])
  debugger
  return (
    <span>{labels.join(' / ')}</span>
  ) 
}