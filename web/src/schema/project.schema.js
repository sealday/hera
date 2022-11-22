import { TAB2TYPE } from "../utils"

const projectSchema = [
  {
    label: '编号',
    name: 'code',
    type: 'text',
  },
  {
    label: '类型',
    name: 'type',
    type: 'text',
    option: {
      type: 'static_value_only',
      values: TAB2TYPE,
    },
    required: true,
  },
  {
    label: '打印用公司名',
    name: 'associatedCompany',
    type: 'text',
    col: 'fullwidth',
  },
  {
    label: '单位名称',
    name: 'company',
    type: 'text',
    required: true,
  },
  {
    label: '项目名称',
    name: 'name',
    type: 'text',
    required: true,
  },
  {
    label: '单位电话',
    name: 'companyTel',
    type: 'text',
  },
  {
    label: '项目电话',
    name: 'tel',
    type: 'text',
  },
  {
    label: '地址',
    name: 'address',
    type: 'text',
    col: 'fullwidth',
  },
  {
    label: '备注',
    name: 'comments',
    type: 'text',
    col: 'fullwidth',
  },
  {
    label: '联系人列表',
    name: 'contacts',
    type: 'list',
    schema: [
      {
        label: '联系人',
        name: 'name',
        type: 'text',
        required: true,
      },
      {
        label: '联系人电话',
        name: 'phone',
        type: 'text',
        required: true,
      },
      {
        label: '身份证号码',
        name: 'number',
        type: 'text',
        mask: [
          /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, ' ',
          /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, ' ',
          /\d/, /\d/, /\d/, /\d|x|X/,
        ]
      },
    ],
  },
  {
    label: '银行列表',
    name: 'banks',
    type: 'list',
    schema: [
      {
        label: '开户行',
        name: 'bank',
        type: 'text',
      },
      {
        label: '账户名',
        name: 'name',
        type: 'text',
      },
      {
        label: '卡号',
        name: 'account',
        type: 'text',
        mask: [
          /\d/, /\d/, /\d/, /\d/, ' ',
          /\d/, /\d/, /\d/, /\d/, ' ',
          /\d/, /\d/, /\d/, /\d/, ' ',
          /\d/, /\d/, /\d/, /\d/, ' ',
          /\d/, /\d/, /\d/, /\d/
        ],
      },
    ],
  }
]

export default projectSchema