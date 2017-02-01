/**
 * Created by seal on 22/01/2017.
 */

import { Map, Record } from 'immutable'

export const SystemRecord = Record({
  online: 0,
  projects: Map(),
  articles: Map(),
  users: Map(),
  base: {},
  notifications: Map(),
  store: false, // 选择的仓库
})

export const StoreRecord = Record({
  records: Map(),
  requesting: false,
  in: [],
  out: [],
  fetching_in: false,
  fetching_out: false,
  stocks: new Map(),
  search: [], // 搜索结果
})

export const NavRecord = Record({
  drawer: false, // 左侧菜单是否显示（在小屏幕情况下）

  store: true,
  report: true,
  system: false,
  project: false,
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

  data:[]
})