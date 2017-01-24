/**
 * Created by seal on 22/01/2017.
 */

import { Map, Record, List } from 'immutable'

export const ProjectRecord = Record({
  _id: '',
  name: '',
  company: '',
  contacts: [],
  tel: '',
  companyTel: '',
  address: '',
  comments: '',
  type: ''
})

export const ArticleRecord = Record({
  _id: '',
  type: '',
  name: '',
  sizes: List(),
  unit: '',
  sizeUnit: '',
  countUnit: '',
  convert: 1,
  convertUnit: '',
})

export const UserRecord = Record({
  _id: '',
  username: '',
  password: '',
  projects: [],
  profile: {
    name: ''
  }
})

export const SystemRecord = Record({
  online: 0,
  projects: Map(),
  articles: Map(),
  users: Map(),
  base: ProjectRecord()
})
