/**
 * Created by seal on 21/01/2017.
 */

export const UPDATE_PROJECTS = 'UPDATE_PROJECTS'
export const UPDATE_ARTICLES =  'UPDATE_ARTICLES'
export const UPDATE_RECORDS_CACHE =  'UPDATE_RECORDS_CACHE'
export const UPDATE_USERS = 'UPDATE_USERS'

export const SYSTEM_LOADED = 'SYSTEM_LOADED'
export const ONLINE_USER_CHANGE = 'ONLINE_USER_CHANGE'
export const UPDATE_ARTICLE_SIZES = 'UPDATE_ARTICLE_SIZES'
export const REMOVE_PROJECT = 'REMOVE_PROJECT'

export const REQUEST_IN_RECORDS =  'REQUEST_IN_RECORDS'
export const RECEIVED_IN_RECORDS =  'RECEIVED_IN_RECORDS'

export const REQUEST_OUT_RECORDS = 'REQUEST_OUT_RECORDS'
export const RECEIVED_OUT_RECORDS =  'RECEIVED_OUT_RECORDS'

import { ajax } from './utils'

export const updateArticleSizes = (id, sizes) => ({
  type: UPDATE_ARTICLE_SIZES,
  data: {
    id,
    sizes
  }
})

export const removeProject = (id) => ({
  type: REMOVE_PROJECT,
  data: id
})

export const systemLoaded = (data) => ({
  type: SYSTEM_LOADED,
  data
})

export const updateOnlineUser = (num) => ({
  type: ONLINE_USER_CHANGE,
  data: num
})


export const requestInRecords = () => (dispatch, getState) => {
  // 不产生重复的请求
  if (!getState().store.fetching_in) {
    dispatch({ type: REQUEST_IN_RECORDS })
    return ajax('/api/transfer', {
      data: {
        inStock: getState().system.base._id
      }
    }).then(res => {
      dispatch({ type: RECEIVED_IN_RECORDS, data: res.data.records })
    }).catch(err => {
      alert('出错了！获取出库数据' + JSON.stringify(err))
    })
  }
}

export const requestOutRecords = () => (dispatch, getState) => {
  if (!getState().store.fetching_out) {
    dispatch({ type: REQUEST_OUT_RECORDS })
    return ajax('/api/transfer', {
      data: {
        outStock: getState().system.base._id
      }
    }).then(res => {
      dispatch({ type: RECEIVED_OUT_RECORDS, data: res.data.records })
    }).catch(err => {
      alert('出错了！获取出库数据' + JSON.stringify(err))
    })
  }
}

export const TOGGLE_NAV = 'TOGGLE_NAV'
export const TOGGLE_MENU = 'TOGGLE_MENU'

export const toggleNav = () => ({
  type: TOGGLE_NAV
})

export const toggleMenu = (name) => ({
  type: TOGGLE_MENU,
  data: name
})
