
export default [
  {
    name: "name",
    label: "产品",
    type: "text",
  },
  {
    name: "size",
    label: "规格",
    type: "text",
  },
  {
    name: "projectId",
    label: "规格",
    type: "text",
    option: {
      type: 'ref',
      ref: 'project',
      label: 'name',
      value: '_id',
    },
  },
  {
    name: "in",
    label: "入库数量",
    type: "number",
  },
  {
    name: "out",
    label: "出库数量",
    type: "number",
  },
  {
    name: 'total',
    label: '小计',
    type: 'number',
  },
  {
    name: 'unit',
    label: '单位',
    type: 'text',
  }
]