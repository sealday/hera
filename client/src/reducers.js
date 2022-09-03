import * as actionTypes from './actions'
import { Map, OrderedMap } from 'immutable'
import { makeKeyFromNameSize } from'./utils'
import {
  SystemRecord,
  StoreRecord,
  NavRecord,
  PostRecord,
  PostRecords,
} from './records'

export function system(state = new SystemRecord(), action) {
  switch (action.type) {
    case actionTypes.SYSTEM_LOADED:
      const base = action.data.base
      const user = action.data.user
      const config = action.data.config
      const projects = new Map(action.data.projects.map(project => [project._id, project]))
      const users = new Map(action.data.users.map(user => [user._id, user]))
      const products = {}
      const articles = new OrderedMap(action.data.products.map((product) => {
        products[makeKeyFromNameSize(product.name, product.size)] = product
        return [product.number, product]
      }))

      return state.set('base', base)
        .set('projects', projects.filter(project => project.status !== 'FINISHED'))
        .set('rawProjects', projects)
        .set('articles', articles)
        .set('products', products)
        .set('users', users)
        .set('user', user)
        .set('config', config)
        .set('loading', false)
    case actionTypes.UPDATE_ARTICLE_SIZES:
      return state.updateIn(['articles', action.data.id], article => ({ ...article, sizes: action.data.sizes }) )
    case actionTypes.UPDATE_PROJECT:
      const project = action.data
      return state.update('projects', projects => projects.set(project._id, project))
        .update('projects', projects => projects.filter(project => project.status !== 'FINISHED'))
        .update('rawProjects', projects => projects.set(project._id, project))
    case actionTypes.REMOVE_PROJECT:
      const projectId = action.data
      return state.update('projects', projects => projects.delete(projectId))
        .update('rawProjects', projects => projects.delete(projectId))
    case actionTypes.SELECT_STORE:
      return state.set('store', action.data)
    case actionTypes.NEW_OPERATOR:
      return state.setIn(['users', action.data._id], action.data)
    case actionTypes.OPERATOR_DELETE:
      return state.removeIn(['users', action.data._id]);
    case actionTypes.PRINT_COMPANY_UPDATE:
      return state.set('printCompany', action.data)
    case actionTypes.SYSTEM_SETTINGS_UPDATED:
      return state.set('config', { ...state.config, ...action.data })
    default:
      return state
  }
}
export function store(state = new StoreRecord(), action) {
  switch (action.type) {
    case actionTypes.UPDATE_RECORD:
      const record = action.data
      return state.update('records', records => records.set(record._id, record))
    case actionTypes.UPDATE_STORE:
      const stock = action.data
      return state.update('stocks', stocks => stocks.set(stock.id, stock))
    case actionTypes.STORE_SEARCH:
      return state.set('search', action.data)
    case actionTypes.SIMPLE_SEARCH:
      return state.set('simpleSearch', action.data)
    default:
      return state
  }
}
export function nav(state = new NavRecord(), action) {
  switch (action.type) {
    case actionTypes.TOGGLE_NAV:
      return state.set('drawer', !state.drawer)
    case actionTypes.TOGGLE_MENU:
      const name = action.data
      return state.set(name, !state[name])
    default:
      return state
  }
}
export function postProject(state = new PostRecord(), action) {
  switch (action.type) {
    case actionTypes.POST_PROJECT:
      return state.set('posting', true)
    case actionTypes.POST_PROJECT_SUCCESS:
      return state.set('posting', false)
    case actionTypes.POST_PROJECT_FAILURE:
      return state.set('posting', false)
    default:
      return state
  }
}
export function alterProject(state = new PostRecord(), action) {
  switch (action.type) {
    case actionTypes.ALTER_PROJECT:
      return state.set('posting', true)
    case actionTypes.ALTER_PROJECT_SUCCESS:
      return state.set('posting', false)
    case actionTypes.ALTER_PROJECT_FAILURE:
      return state.set('posting', false)
    default:
      return state
  }
}
export function requestStore(state = new PostRecords(), action) {
  switch (action.type) {
    case actionTypes.REQUEST_STORE:
      return state.update('posting', posting => posting.set(action.data, true))
    case actionTypes.REQUEST_STORE_SUCCESS:
      return state.update('posting', posting => posting.set(action.data, false))
    case actionTypes.REQUEST_STORE_FAILURE:
      return state.update('posting', posting => posting.set(action.data, false))
    default:
      return state
  }
}
export function networks(state = new Map(), action) {
  switch (action.type) {
    case actionTypes.NETWORK_BEGIN:
      return state.set(action.data, true)
    case actionTypes.NETWORK_END_SUCCESS:
    case actionTypes.NETWORK_END_FAILURE:
      return state.set(action.data, false)
    default:
      return state
  }
}
export function results(state = new Map(), action) {
  switch (action.type) {
    case actionTypes.SAVE_RESULTS:
      return state.set(action.data.key, action.data.result)
    case actionTypes.PAYER_TRANSPORT_PAID_STATUS_CHANGED: {
      const records = state.get(action.data.key)
      const newRecords = []
      records.forEach((record) => {
        if (record._id === action.data.id) {
          record.transportPaid = action.data.paid
        }
        newRecords.push(record)
      })
      return state.set(action.data.key, newRecords)
    }
    case actionTypes.PAYER_TRANSPORT_CHECKED_STATUS_CHANGED: {
      const records = state.get(action.data.key)
      const newRecords = []
      records.forEach((record) => {
        if (record._id === action.data.id) {
          record.transportChecked = action.data.checked
        }
        newRecords.push(record)
      })
      return state.set(action.data.key, newRecords)
    }
    case actionTypes.OPERATION_TOP_K_RESULT: {
      const newOps = action.data.operations
      return state.set(action.data.key, newOps)
    }
    case actionTypes.OPERATION_NEXT_K_RESULT: {
      const operations = state.get(action.data.key)
      return state.set(action.data.key, operations.concat(action.data.operations))
    }
    default:
      return state
  }
}
