/**
 * Created by seal on 21/01/2017.
 */

import * as actionTypes from './actions'
import { Map } from 'immutable'
import { SystemRecord, ProjectRecord, ArticleRecord, UserRecord } from './records'

export function projects(state = {
  projects: [],
  base: '',
  projectIdMap: {}
}, action) {
  switch (action.type) {
    case actionTypes.UPDATE_PROJECTS:
      const projects = action.projects;
      const projectIdMap = {}
      let base = {}
      projects.forEach(project => {
        projectIdMap[project._id] = project
        if (project.type === '基地仓库') {
          base = project
        }
      })
      return {...state, projects, projectIdMap, base};
    default:
      return state
  }
}

export function system(state = SystemRecord(), action) {
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
          articles.set(article._id, new ArticleRecord(article))
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

export function articles(state = [], action) {
  switch (action.type) {
    case actionTypes.UPDATE_ARTICLES:
      return action.articles
    default:
      return state
  }
}

export function recordIdMap(state = {}, action) {
  switch (action.type) {
    case actionTypes.UPDATE_RECORDS_CACHE:
      return {...state, [action.record._id]: action.record}
    default:
      return state
  }
}

export function num(state = 0, action) {
  switch (action.type) {
    case actionTypes.UPDATE_NUM:
      return action.num
    default:
      return state
  }
}

export function users(state = 0, action) {
  switch (action.type) {
    case actionTypes.UPDATE_USERS:
      return action.users
    default:
      return state
  }
}

export function outRecords(state = [], action) {
  switch (action.type) {
    case actionTypes.UPDATE_OUT_RECORDS:
      return action.records
    default:
      return state
  }
}

export function outRecordsRequestStatus(state = 'IDLE', action) {
  switch (action.type) {
    case actionTypes.REQUEST_OUT_RECORDS:
      return action.status
    default:
      return state
  }
}

export function inRecords(state = [], action) {
  switch (action.type) {
    case actionTypes.UPDATE_IN_RECORDS:
      return action.records
    default:
      return state
  }
}

export function inRecordsRequestStatus(state = 'IDLE', action) {
  switch (action.type) {
    case actionTypes.REQUEST_IN_RECORDS:
      return action.status
    default:
      return state
  }
}
