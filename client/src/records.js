import { Map, Record } from 'immutable'

export const SystemRecord = Record({
  online: 0,
  onlineUsers: [],
  printCompany: '上海创兴建筑设备租赁有限公司',
  projects: Map(),
  articles: Map(),
  products: {},
  users: Map(),
  base: {},
  user: {},
  notifications: Map(),
  store: false, // 选择的仓库
  config: {},
  loading: true,
  rawProjects: Map(), // 未过滤过的
})

export const StoreRecord = Record({
  records: new Map(),
  in: [],
  out: [],
  fetching_in: false,
  fetching_out: false,
  stocks: new Map(),
  search: [], // 搜索结果
  simpleSearch: [], // 通过项目部名称和对方单位的搜索结果
})

export const NavRecord = Record({
  drawer: false, // 左侧菜单是否显示（在小屏幕情况下）

  store: true,
  report: true,
  system: false,
  project: false,
  file: false,
  finance: false,
  company: false,
})

export const PostRecord = Record({
  posting: false,

  data: null
})

export const PostRecords = Record({
  posting: new Map()
})

export const WorkerRecord = Record({
  posting:false,
  requesting:false  ,

  data:[]
})

export const PaycheckRecord = Record({
  payables:[]
})