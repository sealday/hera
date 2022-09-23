import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { matchPath } from 'react-router-dom'
import { useNavigate } from 'utils/hooks'
import { Layout, Button, Dropdown, Menu, message, Tabs } from 'antd'
import short_id from 'shortid'
import _, { get } from 'lodash'
import { CurrentStore, Error, Loading, MenuList } from '../components'
import { selectStore } from '../actions'
import './App.css'
import { UserOutlined } from '@ant-design/icons'
import heraApi from '../api'
import { TabContext } from '../globalConfigs'
import { changeTab, removeItem } from '../features/coreSlice'
import { config as routeConfigs } from 'routes'

export default ({ onEnter, onLeave }) => {
  const { onlineUsers, store, user, config, loading, items, active } = useSelector(state => ({
    onlineUsers: state.core.onlineUsers,
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
  const [logout, logoutResult] = heraApi.useLogoutMutation()
  useEffect(() => {
    onEnter()
    if (!isCurrentStorePermit()) {
      dispatch(selectStore(config, false))
    }
    return () => {
      onLeave()
    }
  }, [])
  useEffect(() => {
    if (logoutResult.isSuccess) {
      message.success('登出成功！')
      localStorage.removeItem('X-Hera-Token')
      navigate('/login')
    }
  }, [navigate, logoutResult.isSuccess])
  useEffect(() => {
    if (logoutResult.isError) {
      message.error('登出失败，请检查网络！')
    }
  }, [logoutResult.isError])

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

  const menu = (
    <Menu items={onlineUsers.map(user => ({
      key: short_id.generate(),
      label: get(user, ['profile', 'name'], '异常用户'),
    }))}
    />
  )
  const tabItems = items.map(item => {
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
  })
  const onTabEdit = (targetKey, action) => {
    if (action === 'add') {

    } else {
      dispatch(removeItem(targetKey))
    }
  }
  return (
    <Layout className='App'>
      <Layout.Header className='header'>
        <h5 className='title'>{config.systemName}</h5>
        <p style={{ marginLeft: '2em', float: 'left', color: '#fff' }}>{store && store.company + store.name}</p>
        <Button style={{ color: '#fff' }} onClick={() => { dispatch(selectStore(false)) }} type='text'>选择仓库</Button>
        <div style={{ float: 'right' }}>
          <Dropdown overlay={menu}>
            <Button style={{ color: '#fff' }} type='text'>当前在线 {onlineUsers.length} 人</Button>
          </Dropdown>
          <Button style={{ color: '#fff' }} type='text' onClick={logout}>退出</Button>
          <Button
            onClick={() => navigate('/profile')}
            icon={<UserOutlined />} style={{ color: '#fff' }} type='text'>{user.username}</Button>
        </div>
      </Layout.Header>
      <Layout>
        <Layout.Sider width={240} className='sider'>
          <TabContext.Provider value={{ has: true }}>
            <MenuList user={user} store={store} />
          </TabContext.Provider>
        </Layout.Sider>
        <Layout className='content'>
          {isStoreSelected() && <Tabs
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
          {!isStoreSelected() && <CurrentStore />}
        </Layout>
      </Layout>
    </Layout>
  )
}