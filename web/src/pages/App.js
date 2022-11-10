import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { matchPath, Outlet } from 'react-router-dom'
import { useNavigate } from 'utils/hooks'
import { Layout, Tabs } from 'antd'
import _ from 'lodash'
import { CurrentStore, Error, Loading, MenuList } from '../components'
import { selectStore } from '../actions'
import './App.css'
import heraApi from '../api'
import { TabContext } from '../globalConfigs'
import { changeTab, removeItem } from '../features/coreSlice'
import { config as routeConfigs } from 'routes'
import Navbar from './common/navbar.component'

export default ({ onEnter, onLeave, type }) => {
  const { store, user, config, loading, items, active } = useSelector(state => ({
    items: state.core.items,
    active: state.core.active,
    store: state.system.store,
    user: state.system.user,
    config: state.system.config,
    loading: state.system.loading,
  }))
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const isStoreSelected = () => !!store
  const [_logout, logoutResult] = heraApi.useLogoutMutation()
  useEffect(() => {
    onEnter()
    if (!isCurrentStorePermit()) {
      dispatch(selectStore(config, false))
    }
    return () => {
      onLeave()
    }
  }, [])
  const isCurrentStorePermit = () => {
    if (user.role === '项目部管理员' || user.role === '基地仓库管理员') {
      const perms = user.perms || [];
      const projects = perms.filter((p) => p.query).map((p) => p.projectId);
      return projects.indexOf(store._id) !== -1;
    } else {
      return true;
    }
  }
  if (loading) {
    return (
      <Loading />
    )
  }

  const tabItems = type === 'tab' ? items.map(item => {
    const routeConfig = routeConfigs.find(config => {
      return matchPath(config.path, item.key)
    })
    const pathmatch = matchPath(routeConfig.path, item.key)
    const children = (
      <TabContext.Provider value={{ params: _.get(pathmatch, 'params', {}), key: item.key, has: true }}>
        {_.get(routeConfig, 'element', <Error message='找不到页面' />)}
      </TabContext.Provider>
    )
    return ({ label: item.label, key: item.key, children })
  }) : []
  const onTabEdit = (targetKey, action) => {
    if (action === 'add') {

    } else {
      dispatch(removeItem(targetKey))
    }
  }
  return (
    <Layout className='App'>
      <Layout.Header className='header'>
        <TabContext.Provider value={{ has: type === 'tab' }}>
          <Navbar type={type} />
        </TabContext.Provider>
      </Layout.Header>
      <Layout>
        <Layout.Sider width={240} className='sider'>
          <TabContext.Provider value={{ has: type === 'tab' }}>
            <MenuList user={user} store={store} />
          </TabContext.Provider>
        </Layout.Sider>
        <Layout className='content'>
          {isStoreSelected() && type === 'tab' && <Tabs
            onEdit={onTabEdit}
            tabBarStyle={{
              top: 0,
              zIndex: 1,
              position: 'sticky',
              backgroundColor: '#f0f2f5',
              marginBottom: '0',
            }}
            hideAdd
            activeKey={active}
            onChange={(k) => dispatch(changeTab(k))}
            items={tabItems}
            type='editable-card'
          />}
          {isStoreSelected() && type === 'base' && <Outlet />}
          {!isStoreSelected() && <CurrentStore />}
        </Layout>
      </Layout>
    </Layout>
  )
}