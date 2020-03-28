import { push, goBack } from 'react-router-redux'
import { reset } from 'redux-form'

import { ajax, updateEntry } from './utils'

export const SYSTEM_LOADED = 'SYSTEM_LOADED'
export const ONLINE_USER_CHANGE = 'ONLINE_USER_CHANGE'
export const ONLINE_USERS_CHANGE = 'ONLINE_USERS_CHANGE'
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

export const updateOnlineUsers = (users) => ({
  type: ONLINE_USERS_CHANGE,
  data: users,
})

export const TOGGLE_NAV = 'TOGGLE_NAV'
export const TOGGLE_MENU = 'TOGGLE_MENU'

export const toggleNav = () => ({
  type: TOGGLE_NAV
})

export const toggleMenu = (name) => ({
  type: TOGGLE_MENU,
  data: name
})

/**
 * 查询签到情况，后台还没有写完
 * @type {string}
 * FIXME
 */
export const SEARCH_SIGNIN_WORKER = 'SEARCH_SIGNIN_WORKER'
export const SEARCH_SIGNIN_WORKER_SUCCESS = 'SEARCH_SIGNIN_WORKER_SUCCESS'
export const SEARCH_SIGNIN_WORKER_FAILURE = 'SEARCH_SIGNIN_WORKER_FAILURE'
export const searchSignin = (data)=>(dispatch,getState)=>{
  dispatch({type:SEARCH_SIGNIN_WORKER})
  dispatch(newInfoNotify('提示','正在查询',2000))
  ajax('/api/sign/search',{
    data:JSON.stringify(data),
    method:'POST',
    contentType:'application/json'
  }).then(res=>{
    dispatch({type:SEARCH_SIGNIN_WORKER_SUCCESS})
    dispatch(newSuccessNotify('提示','查询成功',2000))

  }).catch(err=>{
    dispatch({type:SEARCH_SIGNIN_WORKER_FAILURE})
    dispatch(newErrorNotify('警告','查询失败',2000))
  })
}


export const SIGNIN_WORKER = 'SIGNIN_WORKER'
export const SIGNIN_WORKER_SUCCESS = 'SIGNIN_WORKER_SUCCESS'
export const SIGNIN_WORKER_FAILURE = 'SIGNIN_WORKER_FAILURE'
export const signinWorker = (time)=>(dispatch,getState)=>{
  dispatch({type:SIGNIN_WORKER});
  dispatch(newInfoNotify('提示','正在签到',2000))
    ajax('/api/workercheckin/58a1b55e54928b30e823e7cd/signin',{
      data:JSON.stringify({signintime:time,signinaddition:'hello'}),
      method:'POST',
      contentType:'application/json'
    }).then(res=>{
      dispatch({type:SIGNIN_WORKER_SUCCESS})
      dispatch(newSuccessNotify('提示','签到成功',2000))
    }).catch(err=>{
      dispatch({type:SIGNIN_WORKER_FAILURE})
      dispatch(newErrorNotify('警告','签到失败',2000))
    })
}

export const DELETE_WORKER = 'DELETE_WORKER'
export const DELETE_WORKER_SUCCESS = 'DELETE_WORKER_SUCCESS'
export const DELETE_WORKER_FAILURE = 'DELETE_WORKER_FAILURE'

export const removeWorker =(id)=>(dispatch,getState)=>{
  if(!getState().requestWorkerlist.posting){
    dispatch({type:DELETE_WORKER});
    dispatch(newInfoNotify('提示','正在删除',2000))
      ajax(`/api/workercheckin/${id}/delete`,{
          method: 'POST',
          contentType: 'application/json'
      }).then(res=>{
        dispatch({type:DELETE_WORKER_SUCCESS,data:id})
        dispatch(newSuccessNotify('提示','删除成功',2000))
        dispatch(push(`/worker_checkin`))
      }).catch(err=>{
        dispatch({type:DELETE_WORKER_FAILURE})
        dispatch(newErrorNotify('警告','删除失败',2000))
      })
  }
}

export const REQUEST_WORKERS = 'REQUEST_WORKERS'
export const REQUEST_WORKERS_SUCCESS='REQUEST_WORKERS_SUCCESS'
export const REQUEST_WORKERS_FAILURE = 'REQUEST_WORKERS_FAILURE'

export const requestWorkerlist =(flag)=> (dispatch,getState)=>{
  if (!getState().requestWorkerlist.requesting){
    dispatch({type:REQUEST_WORKERS})
    if (flag === "displaysignin"){

    }else {
      dispatch(newInfoNotify("提示", '正在请求数据', 2000))
    }
    ajax('/api/workercheckin').then(res=>{
      const workers = res.data.workers
        dispatch({type:REQUEST_WORKERS_SUCCESS,data:workers})
        if (flag === "displaysignin"){

        }else{
          dispatch(newSuccessNotify('提示','请求数据成功',2000))
        }

    }).catch(err=>{
      dispatch({type:REQUEST_WORKERS_FAILURE})
      if (flag === "displaysignin"){

      }else {
        dispatch(newErrorNotify('警告', '请求数据失败', 2000))
      }
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
      ajax(`/api/workercheckin/${worker._id}/edit`,{
          data: JSON.stringify(worker),
          method: 'POST',
          contentType: 'application/json'
    }).then(res =>{
      const workerinfo = res.data.workerinfo;
      dispatch({type:ALTER_WORKER_SUCCESS,data:workerinfo})
      dispatch(newSuccessNotify('提示','修改工人信息成功',2000))
      dispatch(push(`/worker/create`))
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

export const requestStore = (condition) => (dispatch, getState) => {
  const stockId = condition.project
  if (!getState().requestStore.posting.get(stockId)) {
    dispatch({ type: REQUEST_STORE, data: stockId })
    dispatch(newInfoNotify('提示', '正在请求库存信息', 2000))
    ajax(`/api/store/${stockId}`, {
      data: {
        condition: JSON.stringify(condition)
      }
    }).then(res => {
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

export const selectStore = (config, store) => {
  localStorage.setItem(`store-${ config.db }`, JSON.stringify(store))

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
export const OPERATOR_DELETE = 'OPERATOR_DELETE' // 删除操作员
export const NEW_OPERATOR = 'NEW_OPERATOR' // 接收到数据的 action

export const PRINT_COMPANY_UPDATE = 'PRINT_COMPANY_UPDATE'

export const selectPrintCompany = (name) => {
  return {
    type: PRINT_COMPANY_UPDATE,
    data: name
  }
}

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

export const deleteOperator = operator => (dispatch, getState) => {
  const networking = network(OPERATOR_DELETE)
  if (networking.shouldProceed(getState())) {
    dispatch(networking.begin)
    dispatch(newInfoNotify('提示', '正在删除操作员', 2000))
    ajax(`/api/user/${operator._id}/delete`, {
      data: JSON.stringify(operator),
      method: 'POST',
      contentType: 'application/json'
    }).then(res => {
      dispatch(networking.endSuccess)
      dispatch({ type: OPERATOR_DELETE, data: res.data.user })
      dispatch(newSuccessNotify('提示', '删除操员成功！', 2000))
    }).catch(err => {
      dispatch(networking.endFailure)
      dispatch(newErrorNotify('错误', '删除操作员失败！', 2000))
      throw err
    })
  }
}

export const POST_TRANSFER = 'POST_TRANSFER'

/**
 * 创建新的出入库记录
 * @param record
 */
export const postTransfer = (record) => (dispatch, getState) => {
  const networking = network(POST_TRANSFER)
  if (networking.shouldProceed(getState())) {
    updateEntry(record, getState().system.products)
    dispatch(networking.begin)
    dispatch(newInfoNotify('提示', '创建中', 2000))
    ajax('/api/record', {
      data: JSON.stringify(record),
      method: 'POST',
      contentType: 'application/json'
    }).then(res => {
      dispatch(networking.endSuccess)
      dispatch(updateRecord(res.data.record))
      dispatch(newSuccessNotify('提示', '创建成功！', 2000))
      dispatch(push(`/record/${res.data.record._id}`))
    }).catch(err => {
      dispatch(networking.endFailure)
      dispatch(newErrorNotify('错误', '创建失败！', 3000))
      throw err
    });
  }
}

export const UPDATE_TRANSFER = 'UPDATE_TRANSFER'

/**
 * 更新出入库记录
 * @param record
 */
export const updateTransfer = (record) => (dispatch, getState) => {
  const networking = network(UPDATE_TRANSFER)
  if (networking.shouldProceed(getState())) {
    updateEntry(record, getState().system.products)
    dispatch(networking.begin)
    dispatch(newInfoNotify('提示', '正在更新调拨单', 2000))
    ajax(`/api/record/${record._id}`, {
      data: JSON.stringify(record),
      method: 'POST',
      contentType: 'application/json'
    }).then(res => {
      dispatch(networking.endSuccess)
      dispatch(updateRecord(res.data.record)) // 更新出入库记录缓存
      dispatch(newSuccessNotify('提示', '更新调拨单成功！', 2000))
      // FIXME 为了保证用户可以直接通过返回回到查询界面，这里没有使用 push
      dispatch(goBack())
    }).catch(err => {
      dispatch(networking.endFailure)
      dispatch(newErrorNotify('错误', '更新调拨单失败！', 2000))
      throw err
    });
  }
}

export const REQUEST_RECORD = 'REQUEST_RECORD'

/**
 * 请求出入库记录
 * @param id
 */
export const requestRecord = (id) => (dispatch, getState) => {
  const networking = network(REQUEST_RECORD)
  if (networking.shouldProceed(getState())) {
    dispatch(networking.begin)
    dispatch(newInfoNotify('提示', '正在请求记录详情', 2000))
    ajax(`/api/record/${id}`).then(res => {
      dispatch(networking.endSuccess)
      dispatch(updateRecord(res.data.record)) // 更新出入库记录缓存
      dispatch(newSuccessNotify('提示', '请求记录详情成功', 2000))
    }).catch(err => {
      dispatch(networking.endFailure)
      dispatch(newErrorNotify('警告', '请求记录详情失败', 2000))
      throw err
    })
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

export const SAVE_RESULTS = 'SAVE_RESULTS' // 可能我们还需要清理结果等等？

export const queryStore = (key, condition) => (dispatch, getState) => {
  const search = network(SIMPLE_SEARCH + key) // 让查询网络不会重复
  if (search.shouldProceed(getState())) {
    dispatch(search.begin)
    dispatch(newInfoNotify('提示', '正在根据给定条件搜索仓库', 2000))
    ajax('/api/store/simple_search', {
      data: {
        condition: JSON.stringify(condition)
      }
    }).then(res => {
      dispatch(search.endSuccess)
      dispatch({ type: SAVE_RESULTS, data: {
        key,
        result: res.data.search
      }})
      dispatch(newSuccessNotify('提示', '搜索仓库成功！', 2000))
    }).catch(err => {
      dispatch(search.endFailure)
      dispatch(newErrorNotify('错误', '搜索仓库失败！', 2000))
      throw err
    })
  }
}

export const PAYABLE = 'PAYABLE';

export const payables = data => (dispatch, getState) => {
  const payable = network(PAYABLE)
  if (payable.shouldProceed(getState())) {
    dispatch(payable.begin)
    dispatch(newInfoNotify('提示','正在查询',2000))
    ajax('/api/payable_search',{
      data:{
        condition: JSON.stringify(data)
      }
    }).then(res => {
      dispatch(payable.endSuccess)
      dispatch({ type: PAYABLE, data: res.data.payables })
      dispatch(newSuccessNotify('提示','查询成功',2000))
    }).catch(err => {
      dispatch(payable.endFailure)
      dispatch(newErrorNotify('提示','查询失败',2000))
    })
  }
}

const ALL_PAYER =  "ALL_PAYER"

export const fetchAllPayer = () => (dispatch, getState) => {
  const search = network(ALL_PAYER) // 让查询网络不会重复
  if (search.shouldProceed(getState())) {
    dispatch(search.begin)
    dispatch(newInfoNotify('提示', '正在刷新付款方列表', 2000))
    ajax('/api/record/all_payer').then(res => {
      dispatch(search.endSuccess)
      dispatch({ type: SAVE_RESULTS, data: {
        key: 'payers',
        result: res.data.payers
      }})
      dispatch(newSuccessNotify('提示', '刷新付款方列表成功', 1000))
    }).catch(err => {
      dispatch(search.endFailure)
      dispatch(newErrorNotify('错误', '刷新付款方列表失败', 1000))
      throw err
    })
  }
}

const SAVE_PROFILE = 'SAVE_PROFILE'

export const saveProfile = (user) => (dispatch, getState) => {
  const search = network(SAVE_PROFILE)
  if (search.shouldProceed(getState())) {
    dispatch(search.begin)
    dispatch(newInfoNotify('提示', '正在保存个人配置', 1000))
    ajax(`/api/user/${ user._id }/profile`, {
      data: JSON.stringify(user),
      method: 'POST',
      contentType: 'application/json'
    }).then((res) => {
      dispatch(search.endSuccess)
      dispatch(newSuccessNotify('提示', '保存个人配置成功', 1000))
    }).catch((err) => {
      dispatch(search.endFailure)
      dispatch(newErrorNotify('提示', '保存个人配置失败', 1000))
    })
  }
}

export const SYSTEM_SETTINGS = 'SYSTEM_SETTINGS'
export const SYSTEM_SETTINGS_UPDATED = 'SYSTEM_SETTINGS_UPDATED'

export const saveSettings = (settings) => (dispatch, getState) => {
  const search = network(SYSTEM_SETTINGS)
  if (search.shouldProceed(getState())) {
    dispatch(search.begin)
    dispatch(newInfoNotify('提示', '正在保存系统基础配置', 1000))
    ajax(`/api/system/settings`, {
      data: JSON.stringify(settings),
      method: 'POST',
      contentType: 'application/json'
    }).then((res) => {
      dispatch({
        type: SYSTEM_SETTINGS_UPDATED,
        data: res.data.settings,
      })
      dispatch(search.endSuccess)
      dispatch(newSuccessNotify('提示', '保存系统基础配置成功', 1000))
    }).catch((err) => {
      dispatch(search.endFailure)
      dispatch(newErrorNotify('提示', '保存系统基础配置失败', 1000))
    })
  }
}

const UPDATE_TRANSPORT_PAID_STATUS = "UPDATE_TRANSPORT_PAID_STATUS"
export const PAYER_TRANSPORT_PAID_STATUS_CHANGED = 'PAYER_TRANSPORT_PAID_STATUS_CHANGED'

export const updateTransportPaidStatus = (id, status) => (dispatch, getState) => {
  const update = network(UPDATE_TRANSPORT_PAID_STATUS)
  if (update.shouldProceed(getState())) {
    dispatch(update.begin)
    ajax(`/api/record/${ id }/transport_paid`, {
      data: JSON.stringify({ paid: status }),
      method: 'POST',
      contentType: 'application/json'
    }).then((res) => {
      dispatch(update.endSuccess)
      dispatch({
        type: PAYER_TRANSPORT_PAID_STATUS_CHANGED,
        data: {
          key: '运输单查询公司',
          id: id,
          paid: status,
        }
      })
      dispatch(newSuccessNotify('提示', '改变付款状态成功！', 1000))
    }).catch((err) => {
      dispatch(update.endFailure)
      dispatch(newErrorNotify('提示', '改变付款状态失败！', 1000))
    })
  }
}

const UPDATE_TRANSPORT_CHECKED_STATUS = "UPDATE_TRANSPORT_CHECKED_STATUS"
export const PAYER_TRANSPORT_CHECKED_STATUS_CHANGED = 'PAYER_TRANSPORT_CHECKED_STATUS_CHANGED'
export const updateTransportCheckedStatus = (id, status) => (dispatch, getState) => {
  const update = network(UPDATE_TRANSPORT_CHECKED_STATUS)
  if (update.shouldProceed(getState())) {
    dispatch(update.begin)
    ajax(`/api/record/${ id }/transport_checked`, {
      data: JSON.stringify({ checked: status }),
      method: 'POST',
      contentType: 'application/json'
    }).then((res) => {
      dispatch(update.endSuccess)
      dispatch({
        type: PAYER_TRANSPORT_CHECKED_STATUS_CHANGED,
        data: {
          key: '运输单查询公司',
          id: id,
          checked: status,
        }
      })
      dispatch(newSuccessNotify('提示', '改变核对状态成功！', 1000))
    }).catch((err) => {
      dispatch(update.endFailure)
      dispatch(newErrorNotify('提示', '改变核对状态失败！', 1000))
    })
  }
}

const OPERATION_FETCH = 'OPERATION_FETCH'
export const OPERATION_TOP_K_RESULT = 'OPERATION_TOP_K_RESULT'

export const queryLatestOperations = () => (dispatch, getState) => {
  const update = network(OPERATION_FETCH)
  if (update.shouldProceed(getState())) {
    dispatch(update.begin)
    ajax('/api/operation/top_k').then((res) => {
      dispatch(update.endSuccess)
      dispatch({
        type: OPERATION_TOP_K_RESULT,
        data: {
          key: 'operations',
          operations: res.data.operations,
        }
      })
      dispatch(newSuccessNotify('提示', '查询最近操作记录成功！', 1000))
    }).catch((err) => {
      dispatch(update.endFailure)
      dispatch(newErrorNotify('警告', '查询最近操作记录失败！', 1000))
    })
  }
}

export const OPERATION_NEXT_K_RESULT = 'OPERATION_NEXT_K_RESULT'

export const queryMoreOperations = (id) => (dispatch, getState) => {
  const update = network(OPERATION_FETCH)
  if (update.shouldProceed(getState())) {
    dispatch(update.begin)
    ajax(`/api/operation/next_k?id=${ id }`).then((res) => {
      dispatch(update.endSuccess)
      dispatch({
        type: OPERATION_NEXT_K_RESULT,
        data: {
          key: 'operations',
          operations: res.data.operations,
        }
      })
      if (res.data.operations.length === 0) {
        dispatch(newInfoNotify('提示', '没有更多的记录了！', 1000))
      }
    }).catch((err) => {
      dispatch(update.endFailure)
      dispatch(newErrorNotify('警告', '加载更多操作记录失败！', 1000))
    })
  }
}

export const PRICE_PLAN = 'PRICE_PLAN'

export const queryPricePlan = () => (dispatch, getState) => {
  const search = network(PRICE_PLAN) // 让查询网络不会重复
  const key = PRICE_PLAN
  if (search.shouldProceed(getState())) {
    dispatch(search.begin)
    dispatch(newInfoNotify('提示', '正在加载合同方案', 2000))
    ajax('/api/price').then(res => {
      dispatch(search.endSuccess)
      dispatch({ type: SAVE_RESULTS, data: {
          key,
          result: res.data.prices
        }})
      dispatch(newSuccessNotify('提示', '加载合同方案成功', 2000))
    }).catch(err => {
      dispatch(search.endFailure)
      dispatch(newErrorNotify('错误', '加载合同方案失败', 2000))
      throw err
    })
  }
}

export const WEIGHT_PLAN = 'WEIGHT_PLAN'

export const queryWeightPlan = () => (dispatch, getState) => {
  const key = WEIGHT_PLAN
  const search = network(key) // 让查询网络不会重复
  if (search.shouldProceed(getState())) {
    dispatch(search.begin)
    dispatch(newInfoNotify('提示', '正在加载计重方案', 2000))
    ajax('/api/weight').then(res => {
      dispatch(search.endSuccess)
      dispatch({ type: SAVE_RESULTS, data: {
          key,
          result: res.data.prices
        }})
      dispatch(newSuccessNotify('提示', '加载计重方案成功', 2000))
    }).catch(err => {
      dispatch(search.endFailure)
      dispatch(newErrorNotify('错误', '加载计重方案失败', 2000))
      throw err
    })
  }
}


export const RENT = 'RENT'

export const queryRent = (condition) => (dispatch, getState) => {
  const search = network(RENT) // 让查询网络不会重复
  const key = RENT
  if (search.shouldProceed(getState())) {
    dispatch(search.begin)
    dispatch(newInfoNotify('提示', '正在计算租金', 2000))
    ajax('/api/store/rent', {
      data: {
        condition: JSON.stringify(condition)
      }
    }).then(res => {
      dispatch(search.endSuccess)
      dispatch({ type: SAVE_RESULTS, data: {
          key,
          result: res.data.rent
        }})
      dispatch(newSuccessNotify('提示', '计算租金成功', 2000))
    }).catch(err => {
      dispatch(search.endFailure)
      dispatch(newErrorNotify('错误', '计算租金失败', 2000))
      throw err
    })
  }
}

export const PROJECT_ADD_ITEM = 'PROJECT_ADD_ITEM'
export const PROJECT_DELETE_ITEM = 'PROJECT_DELETE_ITEM'

export const projectAddItem = (condition) => (dispatch, getState) => {
  const search = network(PROJECT_ADD_ITEM) // 让查询网络不会重复
  if (search.shouldProceed(getState())) {
    dispatch(search.begin)
    dispatch(newInfoNotify('提示', '正在生成对账单', 2000))
    ajax(`/api/project/${ condition.project }/add_item`, {
      data: JSON.stringify(condition),
      method: 'POST',
      contentType: 'application/json'
    }).then(res => {
      dispatch(search.endSuccess)
      dispatch({ type: UPDATE_PROJECT, data: res.data.project })
      dispatch(newSuccessNotify('提示', '生成对账单成功', 2000))
      dispatch(push(`/contract/${ condition.project }`))
    }).catch(err => {
      const res = err.responseJSON
      dispatch(search.endFailure)
      dispatch(newErrorNotify('错误', `生成对账单失败：${ res.message }`, 2000))
    })
  }
}

export const projectDeleteItem = (condition) => (dispatch, getState) => {
  const search = network(PROJECT_DELETE_ITEM)
  if (search.shouldProceed(getState())) {
    dispatch(search.begin)
    ajax(`/api/project/${ condition.project }/item/${ condition.item }/delete`, {
      method: 'POST',
      contentType: 'application/json'
    }).then(res => {
      dispatch(search.endSuccess)
      dispatch({ type: UPDATE_PROJECT, data: res.data.project })
      dispatch(newSuccessNotify('提示', '删除对账单成功', 2000))
      dispatch(push(`/contract/${ condition.project }`))
    }).catch(err => {
      const res = err.responseJSON
      dispatch(search.endFailure)
      dispatch(newErrorNotify('错误', `删除对账单失败：${ res.message }`, 2000))
    })
  }
}
