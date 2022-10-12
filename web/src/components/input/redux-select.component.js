import _ from "lodash"

const { Radio, Select } = require("antd")
const { useSelector } = require("react-redux")

const ReduxSelect = ({ values, ...props }) => {
  const reduxValues = useSelector(state => _.isArray(values) ? values : _.get(state, values))
  if (reduxValues.length < 5) {
    return <Radio.Group {...props} options={reduxValues.map(v => ({ label: v, value: v }))} />
  }
  return <Select {...props} options={reduxValues.map(v => ({ label: v, value: v }))} />
}

export default ReduxSelect