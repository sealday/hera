/**
 * Created by seal on 21/01/2017.
 */

import * as actionTypes from './actions'
import { Map, OrderedMap } from 'immutable'
import {
  SystemRecord,
  StoreRecord,
  NavRecord,
  PostRecord,
  PostRecords,
  WorkerRecord
} from './records'

export function system(state = new SystemRecord(), action) {
  switch (action.type) {
    case actionTypes.SYSTEM_LOADED:
      const base = action.data.base
      const projects = new Map(action.data.projects.map(project => [project._id, project]))
      const users = new Map(action.data.users.map(user => [user._id, user]))
      const articles = new OrderedMap(action.data.articles.map(article => [article._id, article]))

      return state.set('base', base)
        .set('projects', projects)
        .set('articles', articles)
        .set('users', users)
    case actionTypes.ONLINE_USER_CHANGE:
      return state.set('online', action.data)
    case actionTypes.UPDATE_ARTICLE_SIZES:
      return state.updateIn(['articles', action.data.id], article => ({ ...article, sizes: action.data.sizes }) )
    case actionTypes.NEW_NOTIFY:
      const item = action.data
      return state.update('notifications', notifications => notifications.set(item.key, item))
    case actionTypes.DELETE_NOTIFY:
      const key = action.data
      return state.update('notifications', notifications => notifications.delete(key))
    case actionTypes.UPDATE_PROJECT:
      const project = action.data
      return state.update('projects', projects => projects.set(project._id, project))
    case actionTypes.SELECT_STORE:
      return state.set('store', action.data)
    case actionTypes.NEW_OPERATOR:
      return state.setIn(['users', action.data._id], action.data)
    default:
      return state
  }
}

export function store(state = new StoreRecord(), action) {
  switch (action.type) {
    case actionTypes.REQUEST_IN_RECORDS:
      if (state.fetching_in) {
        return state
      } else {
        return state.set('fetching_in', true)
      }
    case actionTypes.REQUEST_OUT_RECORDS:
      if (state.fetching_out) {
        return state
      } else {
        return state.set('fetching_out', true)
      }
    case actionTypes.RECEIVED_IN_RECORDS:
      const inRecords = action.data
      return state.set('records', state.records.withMutations(cache => {
        inRecords.forEach(record => {
          cache.set(record._id, record)
        })
      })).set('in', inRecords)
        .set('fetching_in', false)
    case actionTypes.FETCH_IN_RECORDS_FAILS:
      return state.set('fetching_in', false)
    case actionTypes.FETCH_OUT_RECORDS_FAILS:
      return state.set('fetching_out', false)
    case actionTypes.RECEIVED_OUT_RECORDS:
      const outRecords = action.data
      return state.set('records', state.records.withMutations(cache => {
        outRecords.forEach(record => {
          cache.set(record._id, record)
        })
      })).set('out', outRecords)
        .set('fetching_out', false)
    case actionTypes.REQUEST_RECORD:
      return state.set('requesting', true)
    case actionTypes.REQUEST_RECORD_SUCCESS:
      return state.set('requesting', false)
    case actionTypes.REQUEST_RECORD_FAILURE:
      return state.set('requesting', false)
    case actionTypes.UPDATE_RECORD:
      const record = action.data
      return state.update('records', records => records.set(record._id, record))
    case actionTypes.UPDATE_STORE:
      const stock = action.data
      return state.update('stocks', stocks => stocks.set(stock.id, stock))
    case actionTypes.STORE_SEARCH:
      return state.set('search', action.data)
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

export function requestWorkerlist(state= new WorkerRecord(),action) {
    switch (action.type){
        case actionTypes.REQUEST_WORKERS_SUCCESS:
            return state.set('requesting',false).update('data',data=>data.concat(action.data));
        case actionTypes.REQUEST_WORKERS:
            return state.set('requesting',true);
        case actionTypes.REQUEST_WORKERS_FAILURE:
            return state.set('requesting',false);
        case actionTypes.POST_WORKERIN:
            return state.set('posting',true);
        case actionTypes.POST_WORKERIN_SUCCESS:
            return state.set('posting',false).update('data',data => data.concat(action.data));
        case actionTypes.POST_WORKERIN_FAILURE:
            return state.set('posting',false);
        case actionTypes.ALTER_WORKER:
          return state.set('posting',true)
        case actionTypes.ALTER_WORKER_SUCCESS:
          const worker = action.data;
          const workers = state.get('data');
            workers.forEach((w,i)=>{
              if (w._id === worker._id){
                workers[i]= worker
              }
            })
            return state.set('posting',false).set('data',workers)
        case actionTypes.ALTER_WORKER_FAILURE:
          return state.set('posting',false)
        default:
          return state;
    }
}

export function postTransfer(state = new PostRecord(), action) {
  switch (action.type) {
    case actionTypes.POST_TRANSFER:
      return state.set('posting', true)
    case actionTypes.POST_TRANSFER_SUCCESS:
      return state.set('posting', false).set('data', action.data)
    case actionTypes.POST_TRANSFER_FAILURE:
      return state.set('posting', false)
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