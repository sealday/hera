/**
 * Created by seal on 21/01/2017.
 */

import { ajax } from './utils'
import { push } from 'react-router-redux'
import {reset} from 'redux-form'


export const UPDATE_PROJECTS = 'UPDATE_PROJECTS'
export const UPDATE_ARTICLES =  'UPDATE_ARTICLES'
export const UPDATE_RECORDS_CACHE =  'UPDATE_RECORDS_CACHE'
export const UPDATE_USERS = 'UPDATE_USERS'

export const SYSTEM_LOADED = 'SYSTEM_LOADED'
export const ONLINE_USER_CHANGE = 'ONLINE_USER_CHANGE'
export const UPDATE_ARTICLE_SIZES = 'UPDATE_ARTICLE_SIZES'
export const REMOVE_PROJECT = 'REMOVE_PROJECT'

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

export const REQUEST_WORKERS = 'REQUEST_WORKERS'
export const REQUEST_WORKERS_SUCCESS='REQUEST_WORKERS_SUCCESS'
export const REQUEST_WORKERS_FAILURE = 'REQUEST_WORKERS_FAILURE'

export const requestWorkerlist =()=> (dispatch,getState)=>{
  if (!getState().requestWorkerlist.requesting){
    dispatch({type:REQUEST_WORKERS})
      dispatch(newInfoNotify("提示",'正在请求数据',2000))
    ajax('api/workercheckin').then(res=>{
      const workers = res.data.workers
        dispatch({type:REQUEST_WORKERS_SUCCESS,data:workers})
        dispatch(newSuccessNotify('提示','请求数据成功',2000))

    }).catch(err=>{
      dispatch({type:REQUEST_WORKERS_FAILURE})
        dispatch(newErrorNotify('警告','请求数据失败',2000))
    })
  }
}

export const ALTER_WORKER = 'ALTER_WORKER'
export const ALTER_WORKER_SUCCESS = 'ALTER_WORKER_SUCCESS'
export const ALTER_WORKER_FAILURE= 'ALTER_WORKER_FAILURE'

export const alterWorker = (worker)=>(dispatch,getState)=>{
    if(!getState().requestWorkerlist.posting){
      dispatch({type:ALTER_WORKER})
      dispatch(newInfoNotify('提示','正在修改工人信息',2000))
      ajax(`/api/workercheckin/${worker._id}`,{
          data: JSON.stringify(worker),
          method: 'POST',
          contentType: 'application/json'
    }).then(res =>{
      const workerinfo = res.data.workerinfo;
      dispatch({type:ALTER_WORKER_SUCCESS,data:workerinfo})
      dispatch(newSuccessNotify('提示','修改工人信息成功',2000))
      dispatch(push(`/worker_checkin`))
      }).catch(err=>{
      dispatch({type:ALTER_WORKER_FAILURE})
      dispatch(newErrorNotify('警告','修改工人信息失败',2000))
    })
    }
}

export const POST_WORKERIN = 'POST_WORKERIN'
export const POST_WORKERIN_SUCCESS = 'POST_WORKERIN_SUCCESS'
export const POST_WORKERIN_FAILURE = 'POST_WORKERIN_FAILUER'

export const postWorkerCheckin = (workerin)=>(dispatch,getState)=>{
  if (!getState().requestWorkerlist.posting){
    dispatch({type:POST_WORKERIN})
    dispatch(newInfoNotify('提示','正在保存工人信息',2000))
    ajax('/api/workercheckin',{
      data:JSON.stringify(workerin),
      method:'POST',
      contentType:'application/json'
    }).then(res=>{
      dispatch(reset('WorkerCheckinForm'))
        dispatch({ type: POST_WORKERIN_SUCCESS,data:res.data.workerinfo })
        dispatch(newSuccessNotify('提示', '保存工人信息成功', 2000))
    }).catch(err=>{
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
      dispatch(newErrorNotify('出错', '保存项目信息出错', 2000))
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
    return !state.networks.get(name)
  }
})

export const STORE_SEARCH = 'STORE_SEARCH'

export const storeSearch = condition => (dispatch, getState) => {
  const search = network(STORE_SEARCH)
  if (search.shouldProceed(getState())) {
    dispatch(search.begin)
    dispatch(newInfoNotify('提示', '正在根据给定条件搜索仓库明细', 2000))
    ajax('/api/store/search', {
      data: {
        condition: JSON.stringify(condition)
      }
    }).then(res => {
      dispatch(search.endSuccess)
      dispatch({ type: STORE_SEARCH, data: res.data.search })
      dispatch(newSuccessNotify('提示', '搜索仓库明细成功！', 2000))
    }).catch(err => {
      dispatch(search.endFailure)
      dispatch(newErrorNotify('错误', '搜索仓库明细失败！', 2000))
      throw err
    })
  }
}

export const OPERATOR_CREATE = 'OPERATOR_CREATE' // 网络请求 action
export const OPERATOR_UPDATE = 'OPERATOR_UPDATE' // 网络请求 action
export const NEW_OPERATOR = 'NEW_OPERATOR' // 接收到数据的 action

export const createOperator = operator => (dispatch, getState) => {
  const networking = network(OPERATOR_CREATE)
  if (networking.shouldProceed(getState())) {
    dispatch(networking.begin)
    dispatch(newInfoNotify('提示', '正在创建操作员', 2000))
    ajax('/api/user', {
      data: JSON.stringify(operator),
      method: 'POST',
      contentType: 'application/json'
    }).then(res => {
      dispatch(networking.endSuccess)
      dispatch({ type: NEW_OPERATOR, data: res.data.user })
      dispatch(newSuccessNotify('提示', '创建操作员成功！', 2000))
      dispatch(push('/operator'))
    }).catch(err => {
      dispatch(networking.endFailure)
      dispatch(newErrorNotify('错误', '创建操作员失败！', 2000))
      throw err
    })
  }
}

export const updateOperator = operator => (dispatch, getState) => {
  const networking = network(OPERATOR_UPDATE)
  if (networking.shouldProceed(getState())) {
    dispatch(networking.begin)
    dispatch(newInfoNotify('提示', '正在更新操作员', 2000))
    ajax(`/api/user/${operator._id}`, {
      data: JSON.stringify(operator),
      method: 'POST',
      contentType: 'application/json'
    }).then(res => {
      dispatch(networking.endSuccess)
      dispatch({ type: NEW_OPERATOR, data: res.data.user })
      dispatch(newSuccessNotify('提示', '更新操员成功！', 2000))
      dispatch(push('/operator'))
    }).catch(err => {
      dispatch(networking.endFailure)
      dispatch(newErrorNotify('错误', '更新操作员失败！', 2000))
      throw err
    })
  }
}

export const POST_TRANSFER = 'POST_TRANSFER'

export const postTransfer = (record) => (dispatch, getState) => {
  const networking = network(POST_TRANSFER)
  if (networking.shouldProceed(getState())) {
    dispatch(networking.begin)
    dispatch(newInfoNotify('提示', '正在创建调拨单', 2000))
    ajax('/api/transfer', {
      data: JSON.stringify(record),
      method: 'POST',
      contentType: 'application/json'
    }).then(res => {
      dispatch(networking.endSuccess)
      dispatch(updateRecord(res.data.record))
      dispatch(newSuccessNotify('提示', '创建调拨单成功！', 2000))
      dispatch(push(`/transfer/${res.data.record._id}`))
    }).catch(err => {
      dispatch(networking.endFailure)
      dispatch(newErrorNotify('错误', '创建调拨单失败！', 2000))
      throw err
    });
  }
}

export const UPDATE_TRANSFER = 'UPDATE_TRANSFER'

export const updateTransfer = (record) => (dispatch, getState) => {
  const networking = network(UPDATE_TRANSFER)
  if (networking.shouldProceed(getState())) {
    dispatch(networking.begin)
    dispatch(newInfoNotify('提示', '正在更新调拨单', 2000))
    ajax(`/api/transfer/${record._id}`, {
      data: JSON.stringify(record),
      method: 'POST',
      contentType: 'application/json'
    }).then(res => {
      dispatch(networking.endSuccess)
      dispatch(updateRecord(res.data.record))
      dispatch(newSuccessNotify('提示', '更新调拨单成功！', 2000))
      dispatch(push(`/transfer/${res.data.record._id}`))
    }).catch(err => {
      dispatch(networking.endFailure)
      dispatch(newErrorNotify('错误', '更新调拨单失败！', 2000))
      throw err
    });
  }
}

export const SIMPLE_SEARCH = 'SIMPLE_SEARCH'

export const simpleSearch = condition => (dispatch, getState) => {
  const search = network(SIMPLE_SEARCH)
  if (search.shouldProceed(getState())) {
    dispatch(search.begin)
    dispatch(newInfoNotify('提示', '正在根据给定条件搜索仓库', 2000))
    ajax('/api/store/simple_search', {
      data: {
        condition: JSON.stringify(condition)
      }
    }).then(res => {
      dispatch(search.endSuccess)
      dispatch({ type: SIMPLE_SEARCH, data: res.data.search })
      dispatch(newSuccessNotify('提示', '搜索仓库成功！', 2000))
    }).catch(err => {
      dispatch(search.endFailure)
      dispatch(newErrorNotify('错误', '搜索仓库失败！', 2000))
      throw err
    })
  }
}
