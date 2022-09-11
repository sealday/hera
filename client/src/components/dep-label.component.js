import { Form } from "antd"
import _ from "lodash";
import { toFixedWithoutTrailingZero as fixed } from "../utils";
import Formula from "../utils/formula";

export default ({ form, field, parent, item }) => {
  const watches = item.watch.map(name => Form.useWatch([parent.name, field.name, name], form))
  const context = _.zipObject(item.watch, watches)
  const formula = new Formula(item.formula)
  if (_.some(watches, _.isUndefined)) {
    return <span></span>
  }
  return (
    <span>{fixed(formula.evaluate(context))}</span>
  )
}