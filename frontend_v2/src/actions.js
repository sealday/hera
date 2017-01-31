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
import { push } from 'react-router-redux'

export const NEW_NOTIFY = 'NEW_NOTIFY'
export const DELETE_NOTIFY = 'DELETE_NOTIFY'

export const deleteNotify = key => ({
  type: DELETE_NOTIFY,
  data: key
})

export const UPDATE_RECORD =  'UPDATE_RECORD'
export const UPDATE_PROJECT = 'UPDATE_PROJECT'

export const updateRecord = record => ({
  type: UPDATE_RECORD,
  data: record
})

export const updateProject = project => ({
  type: UPDATE_PROJECT,
  data: project
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

export const REQUEST_RECORD = 'REQUEST_RECORD'
export const REQUEST_RECORD_SUCCESS = 'REQUEST_RECORD_SUCCESS'
export const REQUEST_RECORD_FAILURE = 'REQUEST_RECORD_FAILURE'

export const requestRecord = (id) => (dispatch, getState) => {
  if (!getState().requesting) {
    dispatch({ type: REQUEST_RECORD })
    dispatch(newInfoNotify('提示', '正在请求记录', 2000))
    ajax(`/api/transfer/${id}`).then(res => {
      const record = res.data.record
      dispatch({ type: REQUEST_RECORD_SUCCESS })
      dispatch(updateRecord(record))
      dispatch(newSuccessNotify('提示', '请求记录成功', 2000))
    }).catch(err => {
      dispatch({ type: REQUEST_RECORD_FAILURE })
      dispatch(newErrorNotify('警告', '请求记录失败', 2000))
      throw err
    })
  }
}

export const UPDATE_WORKERIN = 'UPDATE_WORKERIN'
export const POST_WORKERIN = 'POST_WORKERIN'
export const POST_WORKERIN_SUCCESS = 'POST_WORKERIN_SUCCESS'
export const POST_WORKERIN_FAILURE = 'POST_WORKERIN_FAILUER'

export const postWorkerCheckin = (workerin)=>(dispatch,getState)=>{
  if (!getState().postWorkerCheckin.posting){
    dispatch({type:POST_WORKERIN})
    dispatch(newInfoNotify('提示','正在保存工人信息',2000))
    ajax('/api/workercheckin',{
      data:JSON.stringify(workerin),
      method:'POST',
      contentType:'application/json'
    }).then(res=>{
        dispatch({ type: POST_WORKERIN_SUCCESS,data:res.data.workerinfo })
        dispatch(newSuccessNotify('提示', '保存工人信息成功', 2000))
    }).catch(err=>{
      console.log(err)
      dispatch({type:POST_WORKERIN_FAILURE,data:err})
      dispatch(newErrorNotify('警告','保存工人信息失败',2000))
        throw err
    })
  }
}

export const POST_PROJECT = 'POST_PROJECT'
export const POST_PROJECT_SUCCESS = 'POST_PROJECT_SUCCESS'
export const POST_PROJECT_FAILURE = 'POST_PROJECT_FAILURE'

export const postProject = (project) => (dispatch, getState) => {
  if (!getState().postProject.posting) {
    dispatch({ type: POST_PROJECT })
    dispatch(newInfoNotify('提示', '正在保存项目信息', 2000))
    ajax('/api/project', {
      data: JSON.stringify(project),
      method: 'POST',
      contentType: 'application/json'
    }).then(res => {
      dispatch({ type: POST_PROJECT_SUCCESS })
      dispatch({ type: UPDATE_PROJECT, data: res.data.project })
      dispatch(newSuccessNotify('提示', '保存项目信息成功', 2000))
      dispatch(push(`/project?id=${res.data.project._id}`))
    }).catch(err => {
      dispatch({ type: POST_PROJECT_FAILURE })
      dispatch(newErrorNotify('出错', '保存项目信息出错', 2000))
      console.error(err)
    })
  }
}

export const ALTER_PROJECT = 'ALTER_PROJECT'
export const ALTER_PROJECT_SUCCESS = 'ALTER_PROJECT_SUCCESS'
export const ALTER_PROJECT_FAILURE = 'ALTER_PROJECT_FAILURE'

export const alterProject = (project) => (dispatch, getState) => {
  if (!getState().alterProject.posting) {
    dispatch({ type: ALTER_PROJECT })
    dispatch(newInfoNotify('提示', '正在保存项目信息', 2000))
    ajax(`/api/project/${project._id}`, {
      data: JSON.stringify(project),
      method: 'POST',
      contentType: 'application/json'
    }).then(res => {
      dispatch({ type: ALTER_PROJECT_SUCCESS })
      dispatch({ type: UPDATE_PROJECT, data: res.data.project })
      dispatch(newSuccessNotify('提示', '保存项目信息成功', 2000))
      dispatch(push(`/project?id=${res.data.project._id}`))
    }).catch(err => {
      dispatch({ type: ALTER_PROJECT_FAILURE })
      dispatch(newSuccessNotify('出错', '保存项目信息出错', 2000))
      console.error(err)
    })
  }
}

export const REQUEST_STORE = 'REQUEST_STORE'
export const REQUEST_STORE_SUCCESS = 'REQUEST_STORE_SUCCESS'
export const REQUEST_STORE_FAILURE = 'REQUEST_STORE_FAILURE'
export const UPDATE_STORE = 'UPDATE_STORE'

export const requestStore = (stockId) => (dispatch, getState) => {
  if (!getState().requestStore.posting.get(stockId)) {
    dispatch({ type: REQUEST_STORE, data: stockId })
    dispatch(newInfoNotify('提示', '正在请求库存信息', 2000))
    ajax(`/api/store/${stockId}`).then(res => {
      dispatch({ type: REQUEST_STORE_SUCCESS, data: stockId })
      dispatch({ type: UPDATE_STORE, data: {
        id: stockId,
        inRecords: res.data.inRecords,
        outRecords: res.data.outRecords,
      }})
      dispatch(newSuccessNotify('提示', '请求库存信息成功', 2000))
    }).catch(err => {
      dispatch({ type: REQUEST_STORE_FAILURE, data: stockId })
      dispatch(newErrorNotify('提示', '请求库存信息失败', 2000))
      console.error(err)
    })
  }
}

export const SELECT_STORE = 'SELECT_STORE'

export const selectStore = (store) => {
  localStorage.setItem('store', JSON.stringify(store))

  return {
    type: SELECT_STORE,
    data: store
  }
}

export const NETWORK_BEGIN = 'NETWORK_BEGIN'
export const NETWORK_END_SUCCESS = 'NETWORK_END_SUCCESS'
export const NETWORK_END_FAILURE = 'NETWORK_END_FAILURE'

export const network = (name) => ({
  begin: {
    type: NETWORK_BEGIN,
    data: name
  },
  endSuccess: {
    type: NETWORK_END_SUCCESS,
    data: name
  },
  endFailure: {
    type: NETWORK_END_FAILURE,
    data: name
  },
  shouldProceed(state) {
    return state.get(name)
  }
})
