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

export const REQUEST_IN_RECORDS =  'REQUEST_IN_RECORDS'
export const RECEIVED_IN_RECORDS =  'RECEIVED_IN_RECORDS'
export const FETCH_IN_RECORDS_FAILS =  'FETCH_IN_RECORDS_FAILS'

export const requestInRecords = () => (dispatch, getState) => {
  // 不产生重复的请求
  if (!getState().store.fetching_in) {
    dispatch({ type: REQUEST_IN_RECORDS })
    dispatch(newInfoNotify('提示', '正在请求入库数据', 2000))
    return ajax('/api/transfer', {
      data: {
        inStock: getState().system.base._id
      }
    }).then(res => {
      dispatch({ type: RECEIVED_IN_RECORDS, data: res.data.records })
      dispatch(newSuccessNotify('提示', '请求入库数据成功', 2000))
    }).catch(err => {
      dispatch({ type: FETCH_IN_RECORDS_FAILS })
      dispatch(newErrorNotify('警告', '请求入库数据失败' + JSON.stringify(err), 2000))
    })
  }
}

export const REQUEST_OUT_RECORDS = 'REQUEST_OUT_RECORDS'
export const RECEIVED_OUT_RECORDS =  'RECEIVED_OUT_RECORDS'
export const FETCH_OUT_RECORDS_FAILS = 'FETCH_OUT_RECORDS_FAILS'

export const requestOutRecords = () => (dispatch, getState) => {
  if (!getState().store.fetching_out) {
    dispatch({ type: REQUEST_OUT_RECORDS })
    dispatch(newInfoNotify('提示', '正在请求出库数据', 2000))
    return ajax('/api/transfer', {
      data: {
        outStock: getState().system.base._id
      }
    }).then(res => {
      dispatch({ type: RECEIVED_OUT_RECORDS, data: res.data.records })
      dispatch(newSuccessNotify('提示', '请求出库数据成功', 2000))
    }).catch(err => {
      dispatch({ type: FETCH_OUT_RECORDS_FAILS })
      dispatch(newErrorNotify('警告', '请求出库数据失败' + JSON.stringify(err), 2000))
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

export const POST_TRANSFER = 'POST_TRANSFER'
export const POST_TRANSFER_SUCCESS = 'POST_TRANSFER_SUCCESS'
export const POST_TRANSFER_FAILURE = 'POST_TRANSFER_FAILURE'

export const postTransfer = (record) => (dispatch, getState) => {
  if (!getState().postTransfer.posting) {
    dispatch({ type: POST_TRANSFER })
    ajax('/api/transfer', {
      data: JSON.stringify(record),
      method: 'POST',
      contentType: 'application/json'
    }).then(res => {
      dispatch({ type: POST_TRANSFER_SUCCESS, data: res.data })
    }).catch(err => {
      dispatch({ type: POST_TRANSFER_FAILURE })
      alert('出错了' + JSON.stringify(err));
    });
  }
}

export const NEW_NOTIFY = 'NEW_NOTIFY'
export const DELETE_NOTIFY = 'DELETE_NOTIFY'

export const deleteNotify = key => ({
  type: DELETE_NOTIFY,
  data: key
})

export const newNotify = (title, msg, time, theme) => dispatch => {
  const key = Date.now()
  dispatch({ type: NEW_NOTIFY, data: {
    key, title, msg, time, theme
  }})
  // 时间到自动删除
  setTimeout(() => {
    dispatch(deleteNotify(key))
  }, time)
}

// notification helper function
export const newSuccessNotify = (title, msg, time) => newNotify(title, msg, time, 'success')
export const newErrorNotify = (title, msg, time) => newNotify(title, msg, time, 'error')
export const newInfoNotify = (title, msg, time) => newNotify(title, msg, time, 'info')
