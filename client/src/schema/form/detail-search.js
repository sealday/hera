import { RECORD_CLIENT_TYPES } from "../../utils";

export default [
  {
    name: "type",
    label: "类别",
    type: "text",
    default: '租赁类',
    option: {
      type: 'ref',
      ref: 'product',
      label: 'type',
      value: 'type',
    },
  },
  {
    name: "name",
    label: "产品",
    type: "text",
    option: {
      type: 'ref',
      ref: 'product',
      label: 'name',
      value: 'name',
      filters: [{ name: 'type', value: ['type'] }],
    },
  },
  {
    name: "size",
    label: "规格",
    type: "text",
    option: {
      type: 'ref',
      ref: 'product',
      label: 'size',
      value: 'size',
      filters: [{ name: 'type', value: ['type'] }, { name: 'name', value: ['name'] }],
    },
  },
  {
    name: "projectType",
    label: "仓库类型",
    type: "text",
    default: '项目仓库',
    option: {
      type: 'static_value_only',
      values: RECORD_CLIENT_TYPES,
    },
  },
  {
    name: "projectId",
    label: "仓库",
    type: "text",
    option: {
      type: 'ref',
      ref: 'project',
      label: 'name',
      value: '_id',
      filters: [{ name: 'type', value: ['projectType'] }],
    },
  },
  {
    name: "dateRange",
    label: "范围",
    type: "dateRange",
  },
]