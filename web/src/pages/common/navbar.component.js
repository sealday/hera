import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'utils/hooks'
import { useNavigate as useRouteNavigate } from 'react-router-dom'
import { Button, Dropdown, Menu, Popover, Badge, List, Tag, message } from 'antd'
import short_id from 'shortid'
import _, { get } from 'lodash'
import { BellOutlined, InfoCircleOutlined, LogoutOutlined, MobileOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons'
import { QRCodeCanvas } from 'qrcode.react'
import heraApi from 'api'
import { selectStore } from 'actions'
import { useEffect } from 'react'

const styles = {
  navButton: { color: '#fff' }
}

const Navbar = ({ type }) => {
  const { onlineUsers, store, user, config } = useSelector(state => ({
    onlineUsers: state.core.onlineUsers,
    store: state.system.store,
    user: state.system.user,
    config: state.system.config,
  }))
  const navigate = useNavigate()
  const routeNavigate = useRouteNavigate()
  const dispatch = useDispatch()
  const [logout, logoutResult] = heraApi.useLogoutMutation()


  const onlineUserItems = onlineUsers.map(user => ({
      key: short_id.generate(),
      label: get(user, ['profile', 'name'], '异常用户'),
    }))
  useEffect(() => {
    if (logoutResult.isSuccess) {
      message.success('登出成功！')
      localStorage.removeItem('X-Hera-Token')
      routeNavigate('/login')
    }
  }, [routeNavigate, logoutResult.isSuccess])
  const changeType = () => {
    if (type === 'tab') {
      routeNavigate('/')
    } else {
      routeNavigate('/tab')
    }
  }
  return (
    <>
      <h5 className='title'>{config.systemName}</h5>
      <p style={{ marginLeft: '2em', float: 'left', color: '#fff' }}>{store && store.company + store.name}</p>
      <Button style={styles.navButton} onClick={() => { dispatch(selectStore(false)) }} type='text'>选择仓库</Button>
      <div style={{ float: 'right' }}>
        <Button
          onClick={() => changeType()}
          style={styles.navButton}
          type='text'
        >
          {type === 'base' ? '经典版' : '多标签版'}
        </Button>
        <Dropdown menu={{ items: onlineUserItems }}>
          <Button style={styles.navButton} type='text'>在线 {onlineUsers.length} 人</Button>
        </Dropdown>
        <Popover content={<QRCodeCanvas value='https://shcx.shchuangxing.com/downloads/hera.latest.apk' />} placement='bottom'>
          <Button icon={<MobileOutlined />} title='手机端下载' type='text' style={styles.navButton}></Button>
        </Popover>
        <Popover autoAdjustOverflow={false} content={<List
          style={{ width: '300px' }}
          itemLayout='horizontal'
          dataSource={[
            { title: '系统更新', description: '1. 增加系统版本信息\n2.增加装卸运费\n3.更新计重逻辑\n' },
          ]}
          footer={<Button.Group style={{ width: '100%' }}><Button block>全部已读</Button><Button block>查看更多</Button></Button.Group>}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={item.title}
                description={item.description}
              />
            </List.Item>
          )}
        />} placement='bottom'>
          <Badge count={1} size='small' offset={[-8, 8]}>
            <Button icon={<BellOutlined />} title='消息通知' type='text' style={styles.navButton}></Button>
          </Badge>
        </Popover>
        <Popover
          autoAdjustOverflow={false}
          placement='bottomRight'
          content={<div>
            版本：<Tag color='blue'>3.2.2</Tag>更新于：<Tag color='blue'>2022-11-22 11:10:00</Tag>
          </div>}>
          <Button icon={<InfoCircleOutlined />} title='系统信息' type='text' style={styles.navButton}></Button>
        </Popover>

        <Dropdown
          menu={{
            items: [
              { key: 'setting', label: '个人设置', icon: <SettingOutlined />, onClick: () => { navigate('/profile') } },
              { key: 'logout', label: '退出系统', icon: <LogoutOutlined />, onClick: () => { logout() } },
            ]
          }}
        >
          <Button icon={<UserOutlined />} style={styles.navButton} type='text'>{user.username}</Button>
        </Dropdown>
      </div>
    </>
  )
}

export default Navbar
