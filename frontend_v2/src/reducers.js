/**
 * Created by seal on 21/01/2017.
 */

import * as actionTypes from './actions'
import { Map } from 'immutable'
import {
  SystemRecord,
  ProjectRecord,
  ArticleRecord,
  UserRecord,
  StoreRecord,
  NavRecord,
} from './records'

export function system(state = new SystemRecord(), action) {
  switch (action.type) {
    case actionTypes.SYSTEM_LOADED:
      let base = new ProjectRecord(action.data.base)
      let projects = new Map().withMutations(projects => {
        action.data.projects.forEach(project => {
          projects.set(project._id, new ProjectRecord(project))
        })
      })
      let articles = new Map().withMutations(articles => {
        action.data.articles.forEach(article => {
          articles.set(article.name, new ArticleRecord(article))
        })
      })

      let users = new Map().withMutations(users => {
        action.data.users.forEach(user => {
          users.set(user._id, new UserRecord(user))
        })
      })

      return state.set('base', base)
        .set('projects', projects)
        .set('articles', articles)
        .set('users', users)
    case actionTypes.ONLINE_USER_CHANGE:
      return state.set('online', action.data)
    case actionTypes.UPDATE_ARTICLE_SIZES:
      return state.updateIn(['articles', action.data.id], article => article.set('sizes', action.data.sizes))
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