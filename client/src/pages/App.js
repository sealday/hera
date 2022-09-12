import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useNavigate } from 'react-router-dom'
import { Layout, Button, Dropdown, Menu, message } from 'antd'

import short_id from 'shortid'
import { get } from 'lodash'

import { CurrentStore, Loading, MenuList } from '../components'
import { selectStore } from '../actions'
import './App.css'
import { UserOutlined } from '@ant-design/icons'
import heraApi from '../api'

export default ({ onEnter, onLeave }) => {
  const { onlineUsers, store, user, config, loading } = useSelector(state => ({
    onlineUsers: state.core.onlineUsers,
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
          <MenuList user={user} store={store} />
        </Layout.Sider>
        <Layout className='content'>
          {isStoreSelected() && <Outlet />}
          {!isStoreSelected() && <CurrentStore />}
        </Layout>
      </Layout>
    </Layout>
  )
}