export default [
  {
    name: "type",
    label: "凭证类型",
    type: "text",
    option: {
      type: "static_value_only",
      values: ["付款凭证", "收款凭证", "转账凭证", "报销凭证", "应收凭证", "应付凭证"]
    },
    required: true,
  },
  {
    name: "priority",
    label: "优先级",
    type: "text",
    option: {
      type: "static_value_only",
      values: ["一般", "紧急", "非常紧急"]
    },
    required: true,
  },
  {
    name: "companyId",
    label: "公司名称",
    type: "text",
    option: {
      type: 'ref',
      ref: 'company',
      label: 'name',
      value: '_id',
    },
    required: true,
  },
  {
    name: "projectId",
    label: "项目名称",
    type: "text",
    option: {
      type: 'ref',
      ref: 'project',
      label: 'name',
      value: '_id',
    },
    required: true,
  },
  {
    name: "comments",
    label: "事由",
    type: "text",
    required: true,
    col: 'fullwidth',
    rows: 3,
  },
  {
    label: '明细',
    name: 'items',
    type: 'list',
    schema: [
      {
        label: '凭证科目',
        name: 'subjectId',
        type: 'text',
        option: {
          type: 'ref',
          ref: 'subject',
          label: 'name',
          value: 'id',
          select: 'cascader',
        },
        required: true,
      },
      {
        label: '金额',
        name: 'money',
        type: 'number',
        required: true,
      },
    ],
  }
]